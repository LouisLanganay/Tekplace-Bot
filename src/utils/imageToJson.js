const sharp = require("sharp");
const fs = require("fs");
const { logInfo, logError } = require("./log");
const inquirer = require("inquirer");
const inquirerPrompt = require("inquirer-autocomplete-prompt");
const updateEnvFile = require("./updateEnvFile");

async function imageToJson(imagePath, outputJsonPath) {
  try {
    const image = sharp(imagePath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = [];
    const { width, height, channels } = info;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const pixel = {
          position: { x, y },
          color: {
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
            ...(channels === 4 && { a: data[idx + 3] })
          }
        };
        pixels.push(pixel);
      }
    }

    fs.writeFileSync(outputJsonPath, JSON.stringify(pixels, null, 2));
    logInfo(`🖼️ CREATE ==> Pixel data has been written to ${outputJsonPath}`);
    return 1;
  } catch (error) {
    logError('❌ Error ==> Could not convert image to JSON.');

    inquirer.registerPrompt('autocomplete', inquirerPrompt);
    const prompt = await inquirer.prompt([{
      type: 'autocomplete',
      name: 'imagePath',
      message: 'Please enter the path to the image file:',
      source: async (answersSoFar, input) => {
        if (!input)
          return fs.readdirSync('./');
        return fs.readdirSync(input);
      }
    }]);
    await updateEnvFile('INPUT_IMAGE', prompt.imagePath);
    process.env.INPUT_IMAGE = prompt.imagePath;
    return imageToJson(prompt.imagePath, outputJsonPath);
  }
}

module.exports = imageToJson;
