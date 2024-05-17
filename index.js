const generate = require('./src/run');
const { logInfo } = require('./src/utils/log');
const inputImagePath = process.env.INPUT_IMAGE;
require('dotenv').config();

logInfo(`🚀 START ==> Starting the script with the image: ${inputImagePath}`);
generate();
