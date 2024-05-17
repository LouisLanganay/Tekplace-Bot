const axios = require('axios');

const getUser = async (username) => {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://www.tekplace.eu/api/user/' + username,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.TOKEN,
      }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('Error getting user:', error);
  }
}

module.exports = getUser;
