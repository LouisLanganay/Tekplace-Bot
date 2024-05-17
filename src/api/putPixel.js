const axios = require('axios');
const { logError } = require('../utils/log');
require('dotenv').config();

const putPixel = async (x, y, color) => {
  try {
    let data = JSON.stringify({
      "x": x,
      "y": y,
      "color": color
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://www.tekplace.eu/api/placePixel',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.TOKEN,
      },
      data: data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    logError('❌ Error ==> Could not place the pixel.');
  }
}

module.exports = putPixel;
