const { logGray } = require("./utils/log");
const inquirer = require('inquirer');

async function displayStats(user, map, ouput) {
  console.log('');
  const padLabel = (label) => label.padEnd(30, ' ');

  logGray(`${padLabel('Username:')} ${user.username}`);
  logGray(`${padLabel('Pixels available:')} ${user.nbPixels}`);
  logGray(`${padLabel('Time until next pixel:')} ${user.timeUntilNextPixel}`);
  logGray(`${padLabel('Map size:')} ${map.length}`);
  logGray(`${padLabel('Total pixels to place:')} ${ouput.length}`);

  const pixelsToPlace = ouput.filter(pixel => pixel.color.a !== 0).length;

  logGray(`${padLabel('Maximum time to complete:')} ${Math.ceil(ouput.length * 5 / 60)} hours`);
  logGray(`${padLabel('Estimated time to complete:')} ${Math.ceil(pixelsToPlace * 5)} minutes (${Math.ceil(pixelsToPlace * 5 / 60)} hours)`);

  console.log('');

  await inquirer.prompt([{
    type: 'confirm',
    name: 'continue',
    message: 'Do you want to continue?'
  }]);
}

module.exports = displayStats;
