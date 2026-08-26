const fs = require('fs');
const path = require('path');

const target = 'shreyash.designs@gmail.com';
const replacement = 'shreyash.aiml.dev@gmail.com';

const dirs = [
  "C:\\Users\\iitia\\Documents\\antigravity\\focused-pascal\\src",
  "C:\\Users\\iitia\\OneDrive\\Desktop\\Portfolio\\Brutalist-Design\\src",
  "C:\\Users\\iitia\\OneDrive\\Desktop\\Portfolio\\Sketchbook-Design\\src",
  "C:\\Users\\iitia\\OneDrive\\Desktop\\Portfolio\\Anime-Cyberpunk-Design\\src"
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else {
      if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(target)) {
          content = content.split(target).join(replacement);
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log("Updated", fullPath);
        }
      }
    }
  }
}

dirs.forEach(processDir);
console.log("Done replacing emails.");
