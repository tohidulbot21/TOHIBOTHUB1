
const fs = require('fs');
const path = require('path');

// Clean up YouTube player script files
function cleanupScriptFiles() {
  try {
    const rootDir = path.join(__dirname, '..');
    const files = fs.readdirSync(rootDir);
    
    files.forEach(file => {
      if (file.match(/^\d+-player-script\.js$/)) {
        try {
          fs.unlinkSync(path.join(rootDir, file));
          console.log(`[CLEANUP] Removed script file: ${file}`);
        } catch(err) {
          console.log(`[CLEANUP] Failed to remove ${file}:`, err.message);
        }
      }
    });
  } catch(err) {
    console.log('[CLEANUP] Script cleanup error:', err.message);
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupScriptFiles, 5 * 60 * 1000);

// Run cleanup on startup
cleanupScriptFiles();

module.exports = { cleanupScriptFiles };
