const fs = require('fs');
const potrace = require('potrace');

const inputFile = './public/sketch-avatar.jpg';
const outputFile = './public/sketch-avatar.svg';

potrace.trace(inputFile, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync(outputFile, svg);
  console.log('Successfully vectorized avatar to ' + outputFile);
});
