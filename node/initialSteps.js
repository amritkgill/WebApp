const fs = require('fs');
const { promises: fsPromises } = require('fs');

const isWebApp = !process.env.npm_lifecycle_script.includes('CORDOVA=1');
console.log('initialSteps -- isWebApp = ', isWebApp);

// Creates the compileDate.js file that contains the compile date as a string, so it can be displayed where wanted in the app.
const d = new Date();
const fileContent = `module.exports = ['${d.toLocaleString()}'];\n`;
try {
  fs.writeFileSync('./src/js/compileDate.js', fileContent, { encoding: 'utf8', flag: 'w' });
  console.log('initialSteps -- created ./src/js/compileDate.js');
} catch (err) {
  console.log('initialSteps -- \'./src/js/compileDate.js\' WAS NOT written:', err);
}

if (isWebApp) {
  // Removes Cordova's jsconfig.json and srcCordova if they exist in the project root dir
  try {
    fs.unlinkSync('./jsconfig.json');
    console.log('initialSteps -- deleted ./jsconfig.json');
  } catch (err) {
    console.log('initialSteps -- DID NOT delete ./jsconfig.json (not a problem)');
  }
  try {
    fsPromises.rm('./srcCordova', { force: true, recursive: true });
    console.log('initialSteps -- deleted ./srcCordova');
  } catch (err) {
    console.log('initialSteps -- DID NOT delete ./srcCordova (not a problem)');
  }
} else {
  // if Cordova, Copies jsconfig.json into the project root dir
  try {
    fs.copyFileSync('./node/Cordova/jsconfig.json', 'jsconfig.json');
    console.log('initialSteps -- jsconfig.json file copied successfully for Cordova!');
  } catch (err) {
    console.log('initialSteps -- Error copying jsconfig.json file for Cordova:', err);
  }
}
