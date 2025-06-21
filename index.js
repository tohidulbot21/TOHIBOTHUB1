const { exec } = require("child_process");
const chalk = require("chalk");
const check = require("get-latest-version");
const fs = require("fs");
const semver = require("semver");

// Initialize global loading system
global.loading = require("./utils/log.js");

/**
 * TOHI-BOT-HUB - Advanced Bot System
 * Created by TOHI-BOT-HUB
 * https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB
 */

let configJson;
let packageJson;
const sign = "TOHI-BOT-HUB";
const fbstate = "appstate.json";

// Load configuration
try {
  configJson = require("./config.json");
  console.log(chalk.green("✓ Configuration loaded successfully"));
} catch (error) {
  console.error(chalk.red("❌ Error loading config.json:"), error.message);
  process.exit(1);
}

// Animated message display function
const delayedLog = async (message, speed = 50) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const char of message) {
    process.stdout.write(char);
    await delay(speed);
  }
  console.log();
};

// Show appstate removal message
const showRemovalMessage = async () => {
  const message = chalk.yellow(
    "🔄 The 'removeSt' property is enabled in config.json. " +
    "Appstate has been cleared! You can now add a new appstate file."
  );
  await delayedLog(message);
};

// Handle appstate removal
if (configJson.removeSt) {
  try {
    fs.writeFileSync(fbstate, sign, { encoding: "utf8", flag: "w" });
    showRemovalMessage();

    // Reset removeSt flag
    configJson.removeSt = false;
    fs.writeFileSync(
      "./config.json",
      JSON.stringify(configJson, null, 2),
      "utf8"
    );

    console.log(chalk.blue("⏰ Bot will exit in 5 seconds..."));
    setTimeout(() => {
      process.exit(0);
    }, 5000);
    return;
  } catch (error) {
    console.error(chalk.red("❌ Error handling appstate removal:"), error.message);
  }
}

// Load package.json
try {
  packageJson = require("./package.json");
  console.log(chalk.green("✓ Package.json loaded successfully"));
} catch (error) {
  console.error(chalk.red("❌ Error loading package.json:"), error.message);
  return;
}

// Get excluded packages from config
const excluded = configJson.UPDATE?.EXCLUDED || [];

// Normalize version function
function normalizeVersion(version) {
  return version.replace(/^\^/, "");
}

// Update package function with enhanced error handling
async function updatePackage(dependency, currentVersion, latestVersion) {
  if (excluded.includes(dependency)) {
    console.log(chalk.gray(`⏭️  Skipping ${dependency} (excluded)`));
    return;
  }

  try {
    const normalizedCurrent = normalizeVersion(currentVersion);

    if (semver.neq(normalizedCurrent, latestVersion)) {
      console.log(
        chalk.bgYellow.bold(" UPDATE "),
        `New version available for ${chalk.yellow(dependency)}: ${chalk.green(`^${latestVersion}`)} (current: ${chalk.red(normalizedCurrent)})`
      );

      // Update package.json
      packageJson.dependencies[dependency] = `^${latestVersion}`;
      fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

      console.log(
        chalk.green.bold("✅ UPDATED"),
        `${chalk.yellow(dependency)} → ${chalk.green(`^${latestVersion}`)}`
      );

      // Install the updated package
      return new Promise((resolve, reject) => {
        exec(`npm install ${dependency}@latest --save`, (error, stdout, stderr) => {
          if (error) {
            console.error(chalk.red(`❌ Failed to install ${dependency}:`), error.message);
            reject(error);
          } else {
            console.log(chalk.green(`✅ ${dependency} installed successfully`));
            resolve(stdout);
          }
        });
      });
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error updating ${dependency}:`), error.message);
  }
}

// Main update checker function
async function checkAndUpdateDependencies() {
  if (!configJson.UPDATE?.Package) {
    console.log(chalk.yellow("📦 Package updates are disabled in config.json"));
    return;
  }

  console.log(chalk.blue("🔍 Checking for package updates..."));

  try {
    const dependencies = Object.entries(packageJson.dependencies || {});
    let updatedCount = 0;

    for (const [dependency, currentVersion] of dependencies) {
      try {
        const latestVersion = await check(dependency);
        await updatePackage(dependency, currentVersion, latestVersion);
        updatedCount++;
      } catch (error) {
        if (!error.message.includes('404')) {
          console.log(chalk.red(`❌ Failed to check ${dependency}:`), error.message);
        }
      }
    }

    console.log(chalk.green(`✅ Update check completed! Processed ${updatedCount} packages.`));
  } catch (error) {
    console.error(chalk.red("❌ Error during update check:"), error.message);
  }
}

// Initialize colorful logging system
const logger = require("./utils/log");

// Initialize system health monitoring
const systemHealth = require('./utils/systemHealth');
systemHealth.startHealthMonitoring();

// Enhanced startup sequence
console.log(chalk.blue.bold(`
╔══════════════════════════════════════╗
║          TOHI-BOT-HUB v1.8.0         ║
║      Advanced Facebook Bot System    ║
║     Created by TOHI-BOT-HUB Team     ║
╚══════════════════════════════════════╝
`));

// Use themed logging for startup
logger.themed.banner("TOHI-BOT-HUB STARTING UP");
console.success("Colorful logging system initialized!");

// Start update check with delay for better startup experience
setTimeout(() => {
  checkAndUpdateDependencies().catch(error => {
    console.error(chalk.red("❌ Critical error during startup:"), error.message);
  });
}, 15000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow("\n🛑 Graceful shutdown initiated..."));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow("\n🛑 Termination signal received..."));
  process.exit(0);
});

console.log(chalk.green("🚀 TOHI-BOT-HUB initialization completed!"));
console.log(chalk.blue("📝 Visit: https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB"));

/**
 * Credits: TOHI-BOT-HUB
 * GitHub: https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB
 * Do not remove credits - Respect the developers
 */