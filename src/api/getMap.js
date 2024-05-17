const axios = require('axios');
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
    console.error('Error getting map:', error);
  }
}

module.exports = getMap;
