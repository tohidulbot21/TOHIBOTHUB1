
module.exports.config = {
  name: "review",
  version: "1.0.0",
  hasPermssion: 0,
  usePrefix: true,
  credits: "TOHI-BOT-HUB",
  description: "Rate and review bot features or commands",
  commandCategory: "utility",
  usages: "[add/view/stats] [command_name] [rating 1-5] [review_text]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const fs = require("fs-extra");
  const path = require("path");
  const reviewFile = path.join(__dirname, "cache", "reviews.json");
  
  // Initialize reviews file if it doesn't exist
  if (!fs.existsSync(reviewFile)) {
    fs.writeFileSync(reviewFile, JSON.stringify({}, null, 2));
  }
  
  let reviews = JSON.parse(fs.readFileSync(reviewFile, "utf8"));
  const senderID = event.senderID;
  const userName = await Users.getNameUser(senderID) || "User";
  
  if (!args[0]) {
    return api.sendMessage(
      `🌟 REVIEW SYSTEM 🌟\n\n` +
      `📝 Add Review: review add [command] [rating] [text]\n` +
      `👀 View Reviews: review view [command]\n` +
      `📊 View Stats: review stats\n` +
      `📋 List Commands: review list\n\n` +
      `Rating: 1⭐ (Poor) to 5⭐ (Excellent)\n` +
      `Example: review add help 5 Great command!`,
      event.threadID, event.messageID
    );
  }
  
  const action = args[0].toLowerCase();
  
  switch (action) {
    case "add":
      if (!args[1] || !args[2] || !args[3]) {
        return api.sendMessage(
          "❌ Usage: review add [command] [rating 1-5] [review text]",
          event.threadID, event.messageID
        );
      }
      
      const command = args[1].toLowerCase();
      const rating = parseInt(args[2]);
      const reviewText = args.slice(3).join(" ");
      
      if (rating < 1 || rating > 5) {
        return api.sendMessage(
          "❌ Rating must be between 1 and 5 stars!",
          event.threadID, event.messageID
        );
      }
      
      if (reviewText.length < 5) {
        return api.sendMessage(
          "❌ Review text must be at least 5 characters long!",
          event.threadID, event.messageID
        );
      }
      
      if (!reviews[command]) {
        reviews[command] = [];
      }
      
      // Check if user already reviewed this command
      const existingReview = reviews[command].find(r => r.userID === senderID);
      if (existingReview) {
        existingReview.rating = rating;
        existingReview.review = reviewText;
        existingReview.date = new Date().toISOString();
      } else {
        reviews[command].push({
          userID: senderID,
          userName: userName,
          rating: rating,
          review: reviewText,
          date: new Date().toISOString()
        });
      }
      
      fs.writeFileSync(reviewFile, JSON.stringify(reviews, null, 2));
      
      const stars = "⭐".repeat(rating);
      return api.sendMessage(
        `✅ Review Added Successfully!\n\n` +
        `📝 Command: ${command}\n` +
        `${stars} Rating: ${rating}/5\n` +
        `💬 Review: ${reviewText}\n` +
        `👤 By: ${userName}`,
        event.threadID, event.messageID
      );
      
    case "view":
      if (!args[1]) {
        return api.sendMessage(
          "❌ Usage: review view [command_name]",
          event.threadID, event.messageID
        );
      }
      
      const viewCommand = args[1].toLowerCase();
      if (!reviews[viewCommand] || reviews[viewCommand].length === 0) {
        return api.sendMessage(
          `❌ No reviews found for command: ${viewCommand}`,
          event.threadID, event.messageID
        );
      }
      
      const commandReviews = reviews[viewCommand];
      const avgRating = (commandReviews.reduce((sum, r) => sum + r.rating, 0) / commandReviews.length).toFixed(1);
      
      let viewText = `🌟 REVIEWS FOR: ${viewCommand.toUpperCase()} 🌟\n\n`;
      viewText += `📊 Average Rating: ${avgRating}/5 ⭐\n`;
      viewText += `📝 Total Reviews: ${commandReviews.length}\n\n`;
      
      commandReviews.slice(0, 5).forEach((review, index) => {
        const stars = "⭐".repeat(review.rating);
        viewText += `${index + 1}. ${stars} ${review.rating}/5\n`;
        viewText += `👤 ${review.userName}\n`;
        viewText += `💬 "${review.review}"\n`;
        viewText += `📅 ${new Date(review.date).toLocaleDateString()}\n\n`;
      });
      
      if (commandReviews.length > 5) {
        viewText += `... and ${commandReviews.length - 5} more reviews`;
      }
      
      return api.sendMessage(viewText, event.threadID, event.messageID);
      
    case "stats":
      if (Object.keys(reviews).length === 0) {
        return api.sendMessage(
          "📊 No reviews available yet!",
          event.threadID, event.messageID
        );
      }
      
      let statsText = `📊 REVIEW STATISTICS 📊\n\n`;
      let totalReviews = 0;
      let totalRating = 0;
      
      const commandStats = [];
      
      for (const [cmd, cmdReviews] of Object.entries(reviews)) {
        if (cmdReviews.length > 0) {
          const cmdAvg = (cmdReviews.reduce((sum, r) => sum + r.rating, 0) / cmdReviews.length).toFixed(1);
          commandStats.push({
            command: cmd,
            average: parseFloat(cmdAvg),
            count: cmdReviews.length
          });
          totalReviews += cmdReviews.length;
          totalRating += cmdReviews.reduce((sum, r) => sum + r.rating, 0);
        }
      }
      
      const overallAvg = (totalRating / totalReviews).toFixed(1);
      
      // Sort by average rating
      commandStats.sort((a, b) => b.average - a.average);
      
      statsText += `🎯 Overall Average: ${overallAvg}/5 ⭐\n`;
      statsText += `📝 Total Reviews: ${totalReviews}\n`;
      statsText += `🎪 Commands Reviewed: ${commandStats.length}\n\n`;
      statsText += `🏆 TOP RATED COMMANDS:\n\n`;
      
      commandStats.slice(0, 10).forEach((stat, index) => {
        const stars = "⭐".repeat(Math.round(stat.average));
        statsText += `${index + 1}. ${stat.command} - ${stat.average}/5 ${stars}\n`;
        statsText += `   📝 ${stat.count} review(s)\n\n`;
      });
      
      return api.sendMessage(statsText, event.threadID, event.messageID);
      
    case "list":
      const reviewedCommands = Object.keys(reviews).filter(cmd => reviews[cmd].length > 0);
      
      if (reviewedCommands.length === 0) {
        return api.sendMessage(
          "📋 No commands have been reviewed yet!",
          event.threadID, event.messageID
        );
      }
      
      let listText = `📋 REVIEWED COMMANDS (${reviewedCommands.length})\n\n`;
      
      reviewedCommands.forEach((cmd, index) => {
        const cmdReviews = reviews[cmd];
        const avgRating = (cmdReviews.reduce((sum, r) => sum + r.rating, 0) / cmdReviews.length).toFixed(1);
        listText += `${index + 1}. ${cmd} - ${avgRating}/5 ⭐ (${cmdReviews.length} reviews)\n`;
      });
      
      listText += `\n💡 Use "review view [command]" to see detailed reviews!`;
      
      return api.sendMessage(listText, event.threadID, event.messageID);
      
    default:
      return api.sendMessage(
        "❌ Invalid action! Use: add, view, stats, or list",
        event.threadID, event.messageID
      );
  }
};
