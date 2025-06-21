# 🤖 TOHI-BOT-HUB

<p align="center">
  <img src="https://i.postimg.cc/nhM2PPjW/admin.png" alt="Version">
  <img src="https://img.shields.io/badge/Node.js-18.x-success?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Platform-Facebook_Messenger-blue?style=for-the-badge&logo=messenger" alt="Platform">
</p>

<p align="center">
  <img src="https://i.ibb.co/9ZQX8Kp/tohi-bot-banner.png" alt="TOHI-BOT-HUB Banner" width="100%">
</p>

## 🌟 About TOHI-BOT-HUB

**TOHI-BOT-HUB** is a powerful and feature-rich Facebook Messenger chatbot framework built with Node.js. This advanced bot system provides an extensive collection of commands, automated features, and customizable themes to enhance your Messenger experience.

### ✨ Key Features

- 🎨 **Multiple Themes** - 15+ beautiful console themes
- 🔧 **180+ Commands** - Comprehensive command library
- 🌐 **Multi-Language Support** - English, Vietnamese, Tagalog, Bengali, Arabic
- 🔒 **Security Features** - Appstate encryption and admin controls
- 📊 **Database Management** - Auto-create and manage user/thread data
- 🎵 **Media Support** - Music, video, image processing
- 🤖 **AI Integration** - Multiple AI services support
- 📱 **Social Media Tools** - TikTok, Instagram, YouTube downloaders

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- Facebook account with Messenger access
- Valid Facebook app state

### Installation

1. **Fork this repository** on Replit
2. **Configure your bot**:
   ```json
   {
     "BOTNAME": "Your Bot Name",
     "PREFIX": "/",
     "ADMINBOT": ["your_facebook_id"]
   }
   ```
3. **Add your appstate.json** file
4. **Click the Run button** to start your bot

## 🎨 Available Themes

<p align="center">
  <img src="https://i.ibb.co/2ZpqK1M/themes-preview.png" alt="Theme Preview" width="80%">
</p>

Choose from 15+ stunning themes:
- 🌊 **Aqua** - Ocean blue gradient
- 🔥 **Fiery** - Red flame effects
- 💙 **Blue** - Classic blue theme
- 🧡 **Orange** - Warm orange tones
- 💖 **Pink** - Soft pink gradient
- ❤️ **Red** - Bold red design
- 🕰️ **Retro** - Vintage styling
- ☀️ **Sunlight** - Bright yellow theme
- 👥 **Teen** - Modern youth design
- 🌺 **Summer** - Tropical vibes
- 🌸 **Flower** - Floral patterns
- 👻 **Ghost** - Dark mysterious theme
- 💜 **Purple** - Royal purple
- 🌈 **Rainbow** - Multi-color gradient
- 💚 **Hacker** - Matrix green
- ⚫ **Matrix** - Digital rain effect

## 📋 Command Categories

<details>
<summary>🎵 <strong>Media & Entertainment</strong></summary>

- Music download and streaming
- Video processing and download
- Image generation and editing
- Lyrics search
- Spotify integration
</details>

<details>
<summary>🤖 <strong>AI & Utilities</strong></summary>

- AI chat and assistance
- Image recognition
- Text translation
- Weather information
- QR code generation
</details>

<details>
<summary>👥 <strong>Group Management</strong></summary>

- User kick/ban system
- Admin controls
- Auto moderation
- Welcome/goodbye messages
- Group statistics
</details>

<details>
<summary>📱 <strong>Social Media</strong></summary>

- TikTok video download
- Instagram content fetch
- YouTube search and download
- Facebook video processing
- Twitter content access
</details>

## 🛠️ Configuration

### Basic Setup
```json
{
  "version": "1.8.0",
  "language": "en",
  "BOTNAME": "TOHI-BOT",
  "PREFIX": "/",
  "ADMINBOT": ["your_admin_id"],
  "DESIGN": {
    "Title": "TOHI-BOT-HUB",
    "Theme": "matrix",
    "Admin": "Your Name"
  }
}
```

### Security Options
```json
{
  "encryptSt": true,
  "adminOnly": false,
  "autoClean": true
}
```

## 🌐 Multi-Language Support

<p align="center">
  <img src="https://i.ibb.co/9qK8F3M/language-support.png" alt="Language Support" width="70%">
</p>

Supported languages:
- 🇺🇸 **English** (en)
- 🇻🇳 **Vietnamese** (vi)
- 🇵🇭 **Tagalog** (tl)
- 🇵🇭 **Bisaya/Cebuano** (cb)
- 🇧🇩 **Bengali** (bd)
- 🇸🇦 **Arabic** (ar)

## 📊 Web Dashboard

Access your bot's web interface at `/dashboard` for:
- 📈 Analytics and statistics
- ⚙️ Configuration management
- 👥 User management
- 📝 Command reviews
- 🔧 System monitoring

<p align="center">
  <img src="https://i.ibb.co/XkL2Vg4/web-dashboard.png" alt="Web Dashboard" width="80%">
</p>

## 🔧 Development

### Adding Custom Commands
```javascript
module.exports.config = {
  name: "yourcommand",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TOHI-BOT-HUB",
  description: "Your command description",
  commandCategory: "category",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  // Your command logic here
};
```

### Event Handling
Create custom events in `/modules/events/` to handle bot interactions.

## 🚀 Deployment on Replit

1. **Fork the repository**
2. **Configure environment variables**
3. **Upload your appstate.json**
4. **Click Run to deploy**

Your bot will be automatically deployed and accessible 24/7 on Replit's infrastructure.

## 🔒 Security Features

- 🔐 **Appstate Encryption** - Protect your login credentials
- 👮 **Admin Controls** - Restrict sensitive commands
- 🛡️ **Anti-Spam Protection** - Prevent message flooding
- 📝 **Audit Logs** - Track all bot activities
- 🚫 **User Blacklist** - Block problematic users

## 📚 Documentation

For detailed documentation, visit our [Wiki](https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB/wiki) or join our community:

- 💬 [Facebook Community](https://www.facebook.com/groups/178711334798450)
- 📧 [Support Email](mailto:support@tohi-bot.com)
- 🐛 [Report Issues](https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB/issues)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📈 Statistics

<p align="center">
  <img src="https://img.shields.io/github/stars/TOHI-BOT-HUB/TOHI-BOT-HUB?style=social" alt="Stars">
  <img src="https://img.shields.io/github/forks/TOHI-BOT-HUB/TOHI-BOT-HUB?style=social" alt="Forks">
  <img src="https://img.shields.io/github/issues/TOHI-BOT-HUB/TOHI-BOT-HUB" alt="Issues">
  <img src="https://img.shields.io/github/last-commit/TOHI-BOT-HUB/TOHI-BOT-HUB" alt="Last Commit">
</p>

## ⚠️ Disclaimer

> **Warning**: Using automated bots on Facebook may violate their Terms of Service. Use at your own risk. We are not responsible for any account suspensions or bans.

## 🏆 Credits & Acknowledgments

### 👨‍💻 Main Developer
- **[TOHIDUL](https://github.com/YANDEVA)** - Project Creator & Lead Developer

### 🌟 Special Thanks
- **SpermLord** - Core framework contributions
- **CatalizCS** - Original Mirai bot foundation
- **D-Jukie** - Disme-Bot base implementation
- **NTKhang03** - Command structure improvements
- **KhangGia1810** - Event handling system
- **XaviaTeam** - API integrations
- **NethWs3Dev** - FCA implementation

### 🤝 Collaborators
- **[Liane Cagara](https://www.facebook.com/nealiana.kaye.cagara)** - UI/UX Design & Testing

### 🌍 Community Contributors
- **Translation Team** - Multi-language support
- **Beta Testers** - Quality assurance
- **Command Creators** - Extended functionality
- **Bug Reporters** - Stability improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- 🌐 **Demo**: [Try TOHI-BOT-HUB](https://replit.com/@YanMaglinte/TOHI-BOT-HUB)
- 📖 **Documentation**: [Wiki](https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB/wiki)
- 💬 **Community**: [Facebook Group](https://www.facebook.com/groups/178711334798450)
- 🐛 **Issues**: [GitHub Issues](https://github.com/TOHI-BOT-HUB/TOHI-BOT-HUB/issues)

---

<p align="center">
  <img src="https://i.ibb.co/sQq3C9C/footer-logo.png" alt="TOHI-BOT-HUB Footer" width="60%">
</p>

<p align="center">
  <strong>Made with ❤️ by TOHIDUL & Community</strong><br>
  <em>© 2024 TOHI-BOT-HUB. All rights reserved.</em>
</p>

---

**Last Updated**: January 2025 | **Version**: 1.8.0 | **Platform**: Replit# TOHI-BOT-HUB
# TOHI_BOT_HUB
