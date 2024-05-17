const fs = require('fs');
const path = require('path');
const envFilePath = path.resolve(__dirname, '../../.env');

async function updateEnvFile(field, newValue) {
  let envContent = fs.readFileSync(envFilePath, 'utf-8');

  if (envContent.includes(`${field}=`))
    envContent = envContent.replace(new RegExp(`${field}=.+`), `${field}=${newValue}`);
  else
    envContent += `\n${field}=${newValue}`;
  fs.writeFileSync(envFilePath, envContent);
}

module.exports = updateEnvFile;
