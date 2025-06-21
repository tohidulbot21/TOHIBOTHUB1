
const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    commandCategory: "Image",
    name: "anicouple",
    version: "1.0.9",
    permission: 0, // Everyone can use this command
    usePrefix: true,
    credits: "TOHI-BOT-HUB",
    description: "Fetches a random anime couple photo with a stylish output.",
    category: "media",
    cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
    try {
        // Ensure cache directory exists
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Send loading message
        const loadingMsg = await api.sendMessage("🔄 Fetching a beautiful anime couple photo... ✨", event.threadID);

        // Fetch random anime couple image from API with timeout
        const response = await axios.get("https://api.waifu.pics/sfw/couple", {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; TOHI-BOT-HUB/1.0)'
            }
        });

        if (!response.data || !response.data.url) {
            throw new Error("Invalid API response - no image URL found");
        }

        const imgUrl = response.data.url;

        // Download the image with timeout and better error handling
        const imgResponse = await axios({
            url: imgUrl,
            responseType: "stream",
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; TOHI-BOT-HUB/1.0)'
            }
        });

        // Generate unique filename to avoid conflicts
        const filename = `anicouple_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
        const filePath = path.join(cacheDir, filename);
        const writer = fs.createWriteStream(filePath);

        // Pipe the image data to file
        imgResponse.data.pipe(writer);

        // Wait for the image to be saved with proper error handling
        await new Promise((resolve, reject) => {
            writer.on("finish", () => {
                writer.close();
                resolve();
            });
            writer.on("error", (error) => {
                writer.close();
                // Clean up partial file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(error);
            });
            
            // Handle stream errors
            imgResponse.data.on("error", (error) => {
                writer.close();
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(error);
            });
        });

        // Remove loading message
        if (loadingMsg && loadingMsg.messageID) {
            api.unsendMessage(loadingMsg.messageID);
        }

        // Verify file was created and has content
        if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
            throw new Error("Failed to download image - file is empty or doesn't exist");
        }

        // Prepare stylish message
        const msg = `╭───✨ **Anime Couple Photo** ✨───╮\n` +
                    `│  📸 **Random Anime Couple**  │\n` +
                    `╰──────────────────────╯\n\n` +
                    `🌟 **Enjoy this adorable moment!** 🌟\n` +
                    `💕 **Perfect couple vibes** 💕\n\n` +
                    `╭───💡 **Crafted by Tohidul** 💡───╮\n` +
                    `╰─────────────────────────╯`;

        // Send message with image attachment
        const attachment = fs.createReadStream(filePath);
        
        api.sendMessage({
            body: msg,
            attachment: attachment
        }, event.threadID, (err) => {
            // Clean up file after sending (whether success or failure)
            attachment.destroy(); // Close the stream
            
            setTimeout(() => {
                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (cleanupError) {
                        console.log(`[ANICOUPLE] Cleanup warning: ${cleanupError.message}`);
                    }
                }
            }, 1000); // Give some time for the attachment to be processed
            
            if (err) {
                console.log(`[ANICOUPLE] Send error: ${err.message}`);
            }
        }, event.messageID);

    } catch (error) {
        console.log(`[ANICOUPLE] Error: ${error.message}`);
        
        // Enhanced error messages based on error type
        let errorMessage = "❌ **Oops! Something went wrong!** 😓\n";
        
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            errorMessage += "🌐 **Network connection issue!** Please check your internet connection and try again later.";
        } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            errorMessage += "⏰ **Request timed out!** The server is taking too long to respond. Please try again.";
        } else if (error.response && error.response.status) {
            errorMessage += `🚫 **API Error ${error.response.status}!** The anime image service is currently unavailable.`;
        } else if (error.message.includes('Invalid API response')) {
            errorMessage += "📡 **API Response Error!** The service returned invalid data. Please try again.";
        } else if (error.message.includes('Failed to download')) {
            errorMessage += "📥 **Download Failed!** Could not save the image. Please try again.";
        } else {
            errorMessage += "🔧 **Technical Error!** Please try again later or contact support.";
        }
        
        errorMessage += "\n\n🚨 **Try again in a few moments!**";
        
        api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
};
