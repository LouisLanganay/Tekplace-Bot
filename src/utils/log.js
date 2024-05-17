const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";


const logSuccess = (message) => {
  console.log(`${FgGreen}${message}${Reset}`);
}

const logError = (message) => {
  console.log(`${FgRed}${message}${Reset}`);
}

const logInfo = (message) => {
  console.log(`${FgBlue}${message}${Reset}`);
}

const logWarning = (message) => {
  console.log(`${FgYellow}${message}${Reset}`);
}

const logGray = (message) => {
  console.log(`${FgWhite}${message}${Reset}`);
}

module.exports = { logSuccess, logError, logInfo, logWarning, logGray };
