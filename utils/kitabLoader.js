const fs = require('fs');
const path = require('path');

// Function to load the Kitab-Mukhtashor Jiddan Syarah.md content
function loadKitabContent() {
  try {
    const kitabPath = path.join(__dirname, '..', 'Kitab-Mukhtashor Jiddan Syarah.md');
    const content = fs.readFileSync(kitabPath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error loading Kitab content:', error);
    return null;
  }
}

// Get the loaded content
const kitabContent = loadKitabContent();

module.exports = {
  getKitabContent: () => kitabContent
}; 