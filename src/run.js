const getMap = require('./api/getMap');
const getUser = require('./api/getUser');
const putPixel = require('./api/putPixel');
const imageToJson = require('./utils/imageToJson');
const { logWarning, logInfo, logSuccess, logGray } = require('./utils/log');
const rgbaToHexClosest = require('./utils/rgbaToHexClosest');
require('dotenv').config();

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

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function generate() {
  await imageToJson(process.env.INPUT_IMAGE, '/tmp/pixels.json');

  const ouput = require('/tmp/pixels.json');
  const totalPixels = ouput.length;
  let user = await getUser(process.env.USERNAME);
  let map = await getMap();

  logGray(`Username: ${user.username}`);
  logGray(`Pixels available: ${user.nbPixels}`);
  logGray(`Time until next pixel: ${user.timeUntilNextPixel}`);
  logGray(`Map size: ${map.length}`);
  logGray(`Total pixels to place: ${totalPixels}`);
  const pixelsToPlace = ouput
    .filter(pixel => pixel.color.a !== 0)
    .length;
  logGray(`Maximum time to complete: ${Math.ceil(totalPixels * 5 / 60)} hours`);
  logGray(`Estimated time to complete: ${Math.ceil(pixelsToPlace * 5)} minutes (${Math.ceil(pixelsToPlace * 5 / 60)} hours)`);
  logGray('==============================')

  for (let i = 0; i < totalPixels; i++) {
    const pixel = ouput[i];
    const x = pixel.position.x + parseInt(process.env.X_OFFSET);
    const y = pixel.position.y + parseInt(process.env.Y_OFFSET);
    const color = rgbaToHexClosest(pixel.color, colors);
    user = await getUser(process.env.USERNAME);
    map = await getMap();
    if (user.nbPixels <= 0) {
      const nextPixelTime = new Date(user.timeUntilNextPixel).getTime();
      const currentTime = new Date().getTime();
      const secondsUntilNextPixel = Math.ceil((nextPixelTime - currentTime) / 1000);

      logWarning(`No more pixels available. Next pixel available in ${secondsUntilNextPixel} seconds. ==> SLEEP`);
      await sleep(secondsUntilNextPixel);
    }
    if (map.some(p => p.x === x && p.y === y && p.color === color)) {
      logInfo(`Pixel at (${x}, ${y}) already has color ${color} ==> SKIP`);
      continue;
    }
    logSuccess(`Putting pixel at (${x}, ${y}) with color ${JSON.stringify(color)} ==> PUT`);
    logGray(`Remaining pixels: ${user.nbPixels - 1} - Remaining pixels to place: ${ouput.length - i - 1}`);
    putPixel(x, y, color);
  }
  logSuccess('All pixels have been processed');
}

module.exports = generate;
