const getMap = require('./api/getMap');
const getUser = require('./api/getUser');
const imageToJson = require('./utils/imageToJson');
let ouput = require('../tmp/pixels.json');
const displayStats = require('./displayStats');
const displayQuestion = require('./displayQuestion');
const generateImage = require('./generateImage');
const { logGray } = require('./utils/log');
const getPosition = require('./utils/getPosition');
require('dotenv').config();

async function generate() {
  const response = await imageToJson(process.env.INPUT_IMAGE, 'tmp/pixels.json');
  if (response === null)
    return;

  let user = await getUser(process.env.USERNAME);
  let map = await getMap();

  if (!user || !map)
    return;

  await displayStats(user, map, ouput);
  const { recurence, display, erase } = await displayQuestion();

  if (display === 'random')
    ouput = ouput.sort(() => Math.random() - 0.5);

  if (recurence === 'one-time') {
    await generateImage(ouput, erase);
  } else {
    while (true) {
      await generateImage(ouput, erase);
      logGray('⏳ WAITING ==> 30 seconds before generating again.');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
}

module.exports = generate;
