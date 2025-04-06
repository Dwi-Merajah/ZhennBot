const chalk = require('chalk');
const moment = require('moment-timezone');
const path = require("path");

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFD700', '#00FFFF'];
const randomColor = () => chalk.hex(colors[Math.floor(Math.random() * colors.length)]);

module.exports = async function (command, m, conn) {
    if (!command) return;

    const senderName = m.username || "Anonymous";
    const senderNumber = m.sender || "Unknown";
    
    const chatType = m.isGroup ? "Group" : "Private";
    const chatName = m.isGroup ? m.groupName : m.username;

    const time = moment().tz("Asia/Makassar").format('HH:mm');

    console.log(randomColor()("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(randomColor()(`⏰ Jam     : ${time}`));
    console.log(randomColor()(`⚡ Command : ${command}`));
    console.log(randomColor()(`👤 Nama    : ${senderName}`));
    console.log(randomColor()(`📞 ID      : ${senderNumber}`));
    console.log(randomColor()(`🏠 Chat    : ${chatType} (${chatName})`));
    console.log(randomColor()("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
};