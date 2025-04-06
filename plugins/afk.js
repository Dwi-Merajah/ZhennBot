exports.run = {
   usage: ['afk'],
   use: 'reason',
   category: 'main',
   async: async (m, {
      conn,
      text,
      Func
   }) => {
      try {
         let user = global.db.users.find(v => v.jid == m.sender)
         user.afk = +new Date
         user.afkReason = text
         user.afkObj = m
         return m.reply(`🚩 ${m.username} is now AFK!`)
      } catch {
         m.reply("Error")
      }
   },
   error: false,
   group: true
}

