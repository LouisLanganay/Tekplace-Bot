const axios = require('axios');
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
      data : data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error putting pixel:', error);
  }
}

module.exports = putPixel;
