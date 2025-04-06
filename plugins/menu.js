const fs = require('fs');

exports.run = {
  usage: ['menu', 'help', 'start'],
  hidden: ['menutype'],
  async: async (m, { conn, Func, users, isROwner, text, isPrefix, command, plugins, env, setting }) => {
    try {
      let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage);
      let cmd = Object.fromEntries(filter);
      let category = {};

      for (let name in cmd) {
        let obj = cmd[name].run;
        if (!obj || !obj.category) continue;

        if (!category[obj.category]) category[obj.category] = [];
        category[obj.category].push(obj);
      }

      const keys = Object.keys(category).sort();
      let print = `Hai ${Func.greeting()}! I am ${env.botname}, an automated bot that can assist you with various tasks.\n\n`;
      print += `乂  ${"INFOBOT".toUpperCase().split('').join(' ')}  乂\n`;
      print += `Name: ${m.username}\n`;
      print += `Limit: ${users.limit}\n`;
      print += `Status: ${isROwner ? "Developer" : users.premium ? "Premium User" : "Free User"}`;
      
      for (let k of keys) {
        print += `\n\n乂  ${k.toUpperCase().split('').join(' ')}  乂\n\n`;

        let cmdList = category[k].map(v => {
          let usageList = Array.isArray(v.usage) ? v.usage : [v.usage];
          return usageList.map(cmd => ({ usage: cmd, use: v.use ? v.use : '' }));
        }).flat();

        cmdList = cmdList.sort((a, b) => a.usage.localeCompare(b.usage));
        if (cmdList.length === 0) continue;

        print += cmdList.map(v => `  ◦  ${isPrefix}${v.usage} ${v.use}`).join('\n');
      }

      await conn.sendFile(m.chat, process.cwd() + "/media/cover.jpg", 'cover.jpg', print.trim(), m.msg);
    } catch (e) {
      console.error('[ERROR] Failed to generate menu:', e);
    }
  },
  error: false,
  cache: true,
  location: __filename
};
