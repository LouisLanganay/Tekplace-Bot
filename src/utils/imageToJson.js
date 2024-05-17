const sharp = require("sharp");
const fs = require("fs");
const { logInfo, logError } = require("./log");

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
    logInfo(`Pixel data has been written to ${outputJsonPath}`);
  } catch (error) {
    logError('Error processing the image:', error);
  }
}

module.exports = imageToJson;
