
module.exports.config = {
    name: "work",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "TOHI-BOT-HUB",
    description: "Work to earn money with cooldown",
    commandCategory: "Economy",
    usages: "[work]",
    cooldowns: 5,
    usePrefix: true
};

module.exports.languages = {
    "vi": {
        "cooldown": "⏰ Bạn đã làm việc rồi, quay lại sau %1 phút %2 giây",
        "rewarded": "💰 Bạn đã làm công việc %1 và kiếm được %2$",
        "job1": "Lập trình viên",
        "job2": "Nhà thiết kế",
        "job3": "Giáo viên",
        "job4": "Bác sĩ",
        "job5": "Kỹ sư",
        "job6": "Kiến trúc sư",
        "job7": "Nhà báo",
        "job8": "Đầu bếp",
        "job9": "Tài xế",
        "job10": "Thợ điện",
        "job11": "Thợ sửa chữa",
        "job12": "Nhân viên bán hàng",
        "job13": "Quản lý",
        "job14": "Nhân viên văn phòng",
        "job15": "Freelancer"
    },
    "en": {
        "cooldown": "⏰ You have already worked, come back after %1 minutes %2 seconds",
        "rewarded": "💰 You worked as a %1 and earned %2$",
        "job1": "Programmer",
        "job2": "Designer", 
        "job3": "Teacher",
        "job4": "Doctor",
        "job5": "Engineer",
        "job6": "Architect",
        "job7": "Journalist",
        "job8": "Chef",
        "job9": "Driver",
        "job10": "Electrician",
        "job11": "Mechanic",
        "job12": "Sales Representative",
        "job13": "Manager",
        "job14": "Office Worker",
        "job15": "Freelancer"
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const cooldown = 600000; // 10 minutes in milliseconds
    
    let data = await Currencies.getData(senderID);
    
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
        var time = cooldown - (Date.now() - data.workTime),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);
        
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
    }
    else {
        const job = [
            getText("job1"),
            getText("job2"),
            getText("job3"),
            getText("job4"),
            getText("job5"),
            getText("job6"),
            getText("job7"),
            getText("job8"),
            getText("job9"),
            getText("job10"),
            getText("job11"),
            getText("job12"),
            getText("job13"),
            getText("job14"),
            getText("job15")
        ];
        
        const amount = Math.floor(Math.random() * 600);
        
        return api.sendMessage(getText("rewarded", job[Math.floor(Math.random() * job.length)], amount), threadID, async () => {
            await Currencies.increaseMoney(senderID, parseInt(amount));
            await Currencies.setData(senderID, { workTime: Date.now() });
            return;
        }, messageID);
    }     
}
