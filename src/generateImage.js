const getMap = require("./api/getMap");
const getUser = require("./api/getUser");
const putPixel = require("./api/putPixel");
const colors = require("./static/colors");
const getPosition = require("./utils/getPosition");
const { logInfo, logSuccess, logGray, logWarning } = require("./utils/log");
const rgbaToHexClosest = require("./utils/rgbaToHexClosest");

const loadingChars = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯'];

async function getApiInformations() {
  const user = await waitForPixels();
  const map = await getMap();
  return {
    user,
    map
  };
}

async function waitForPixels() {
  let charIndex = 0;
  let waited = false;

  while (true) {
    const user = await getUser(process.env.USERNAME);
    if (user.nbPixels > 0) {
      if (waited)
        console.log();
      return user;
    }
    const nextPixelTime = new Date(user.timeUntilNextPixel).getTime();
    let currentTime = new Date().getTime();
    let secondsUntilNextPixel = Math.ceil((nextPixelTime - currentTime) / 1000);

    for (let i = 0; i < (secondsUntilNextPixel * 2 < 10 ? 10 : secondsUntilNextPixel * 2); i++) {
      const loadingChar = loadingChars[charIndex];
      currentTime = new Date().getTime();
      process.stdout.clearLine(1);
      process.stdout.cursorTo(0);
      process.stdout.write(`\x1b[33m⏳ WAITING ${loadingChar} ==> No more pixels available. Next pixel available in ${secondsUntilNextPixel} seconds.\x1b[0m`);
      await new Promise(resolve => setTimeout(resolve, 300));
      charIndex = (charIndex + 1) % loadingChars.length;
      secondsUntilNextPixel = Math.ceil((nextPixelTime - currentTime) / 1000);
      waited = true;
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

async function generateImage(ouput, erase) {
  let { user, map } = await getApiInformations();

  for (let i = 0; i < ouput.length; i++) {
    const pixel = ouput[i];
    let color = rgbaToHexClosest(pixel.color, colors);
    const { x, y } = getPosition(pixel);

    if (color === undefined) {
      if (map.some(p => p.x === x && p.y === y)) {
        if (!erase) {
          logInfo(`⏭️ SKIP ==> Pixel at (${x}, ${y}) is already placed. (erase option is disabled)`);
          continue;
        }
        color = '#FFF1E8';
      } else {
        logInfo(`⏭️ SKIP ==> Pixel at (${x}, ${y}) is transparent.`);
        continue;
      }
    }
    if (map.some(p => p.x === x && p.y === y && p.color === color)) {
      logInfo(`⏭️ SKIP ==> Pixel at (${x}, ${y}) already has color ${color}.`);
      continue;
    }
    logSuccess(`🎨 PUT ==> Putting pixel at (${x}, ${y}) with color ${JSON.stringify(color)}.`);
    logGray(`ℹ️ INFO ==> Remaining pixels: ${user.nbPixels -= 1} - Remaining pixels to place: ${ouput.length - i - 1}`);
    let response = await putPixel(x, y, color);
    if (response === null) {
      logWarning('⚠️ WARNING ==> Could not place the pixel. Retrying...');
      i--;
      continue;
    }
    let updatedApiData = await getApiInformations();
    user = updatedApiData.user;
    map = updatedApiData.map;
  }
  logSuccess('🎉 All pixels have been placed!');
}

module.exports = generateImage;
