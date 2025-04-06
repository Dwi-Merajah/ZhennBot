exports.run = {
   usage: ['tiktok', 'tikmp3', 'tikwm'],
   hidden: ['tt'],
   use: 'link',
   category: 'downloader',
   async: async (m, {
      conn,
      args,
      isPrefix,
      command,
      Func
   }) => {
      try {
         if (!args || !args[0]) return m.reply(Func.example(isPrefix, command, 'https://vm.tiktok.com/ZSR7c5G6y/'))
         if (!args[0].match('tiktok.com')) return m.reply(global.status.invalid)
         m.reply(global.status.wait)
         let old = new Date()
         const json = await Api.neoxr('/tiktok', {
            url: args[0]
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         if (command == 'tiktok' || command == 'tt') {
            if (json.data.video) return conn.sendFile(m.chat, json.data.video, 'video.mp4', `🍟 Fetching : ${((new Date - old) * 1)} ms`, m.msg)
            if (json.data.photo) {
               for (let p of json.data.photo) {
                  conn.sendFile(m.chat, p, 'image.jpg', `🍟 Fetching : ${((new Date - old) * 1)} ms`, m.msg)
                  await Func.delay(1500)
               }
            }
         }
         if (command == 'tikwm') return conn.sendFile(m.chat, json.data.videoWM, 'video.mp4', `🍟 Fetching : ${((new Date - old) * 1)} ms`, m.msg)
         if (command == 'tikmp3') return !json.data.audio ? m.reply(global.status.fail) : conn.sendFile(m.chat, json.data.audio, json.data.music.title + '.mp3', '', m.msg, json.data.music.title || "Nyoman Developers")
      } catch (e) {
         return m.reply(Func.jsonFormat(e))
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}