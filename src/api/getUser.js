const axios = require('axios');
const { logError } = require('../utils/log');
const inquirer = require('inquirer');
const updateEnvFile = require('../utils/updateEnvFile');

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
    if (error.response.status === 500) {
      logError('❌ Error ==> Bad authorization token.');
      const prompt = await inquirer.prompt([{
        type: 'password',
        name: 'token',
        message: 'Please enter your Tekplace token:'
      }]);
      await updateEnvFile('TOKEN', prompt.token);
      process.env.TOKEN = prompt.token;
      return getUser(username);
    }
    return null;
  }
}

module.exports = getUser;
