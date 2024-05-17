const axios = require('axios');
const { logError } = require('../utils/log');
require('dotenv').config();

const getMap = async () => {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://www.tekplace.eu/api/getMap',
      headers: {
        'Authorization': 'Bearer ' + process.env.TOKEN,
      }
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    logError('❌ Error ==> Could not get the map.');
  }
}

module.exports = getMap;
