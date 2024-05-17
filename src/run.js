const getMap = require('./api/getMap');
const getUser = require('./api/getUser');
const imageToJson = require('./utils/imageToJson');
const ouput = require('../tmp/pixels.json');
const displayStats = require('./displayStats');
const displayQuestion = require('./displayQuestion');
const generateImage = require('./generateImage');
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
  const { mode } = await displayQuestion();

  if (mode === 'one-time') {
    await generateImage(ouput);
  } else {
    while (true) {
      await generateImage(ouput);
    }
  }
}

module.exports = generate;
