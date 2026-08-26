const fs = require('fs');
const target1 = "C:\\Users\\iitia\\Documents\\antigravity\\focused-pascal\\src\\layouts\\AnimeLayout.jsx";
const target2 = "C:\\Users\\iitia\\OneDrive\\Desktop\\Portfolio\\Anime-Cyberpunk-Design\\src\\layouts\\AnimeLayout.jsx";

[target1, target2].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const filtered = lines.filter(line => !line.includes('<Phone size={16}/>'));
    fs.writeFileSync(file, filtered.join('\n'), 'utf8');
    console.log("Removed from", file);
  }
});
