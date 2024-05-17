const getMap = require("./api/getMap");
const getUser = require("./api/getUser");
const putPixel = require("./api/putPixel");
const { logInfo, logSuccess, logGray, logWarning } = require("./utils/log");
const rgbaToHexClosest = require("./utils/rgbaToHexClosest");

const colors = [
  "#000000", // Black
  "#1D2B53", // Dark Blue
  "#7E2553", // Dark Purple
  "#008751", // Dark Green
  "#AB5236", // Brown
  "#5F574F", // Dark Gray
  "#C2C3C7", // Light Gray
  "#FFF1E8", // White
  "#FF004D", // Red
  "#FFA300", // Orange
  "#FFEC27", // Yellow
  "#00E436", // Green
  "#29ADFF", // Blue
  "#83769C", // Indigo
  "#FF77A8", // Pink
  "#FFCCAA" // Peach
]

function getPosition(pixel) {
  return {
    x: pixel.position.x + parseInt(process.env.X_OFFSET),
    y: pixel.position.y + parseInt(process.env.Y_OFFSET)
  };
}

async function getApiInformations() {
  const user = await getUser(process.env.USERNAME);
  const map = await getMap();
  return {
    user,
    map
  };
}

async function waitForPixels() {
  while (true) {
    const user = await getUser(process.env.USERNAME);
    if (user.nbPixels > 0)
      return user;
    const nextPixelTime = new Date(user.timeUntilNextPixel).getTime();
    const currentTime = new Date().getTime();
    const secondsUntilNextPixel = Math.ceil((nextPixelTime - currentTime) / 1000);

    logWarning(`⏳ WAITING ==> No more pixels available. Next pixel available in ${secondsUntilNextPixel} seconds.`);
    await new Promise(resolve => setTimeout(resolve,
      (secondsUntilNextPixel * 1000 / 2) < 5000 ?
      5000 : secondsUntilNextPixel * 1000 / 2
    ));
  }
}

async function generateImage(ouput) {
  for (let i = 0; i < ouput.length; i++) {
    const pixel = ouput[i];
    let color = rgbaToHexClosest(pixel.color, colors);
    const { x, y } = getPosition(pixel);
    const { map } = await getApiInformations();
    let user = await waitForPixels();

    if (color === undefined) {
      if (map.some(p => p.x === x && p.y === y)) {
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
    logGray(`ℹ️ INFO ==> Remaining pixels: ${user.nbPixels - 1} - Remaining pixels to place: ${ouput.length - i - 1}`);
    putPixel(x, y, color);
    user.nbPixels -= 1;
  }
  logSuccess('🎉 All pixels have been placed!');
}

module.exports = generateImage;
