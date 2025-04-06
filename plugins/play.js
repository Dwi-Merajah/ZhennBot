exports.run = {
   usage: ['play'],
   use: 'query',
   category: 'downloader',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      Scraper
   }) => {
      try {
         if (!text) return conn.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m.msg)
         m.reply(global.status.wait)
         var json = await Api.neoxr('/play', {
            q: text
         })
         if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m.msg)
         let caption = `乂  Y T - P L A Y  乂\n\n`
         caption += `	◦  Title : ${json.title}\n`
         caption += `	◦  Size : ${json.data.size}\n`
         caption += `	◦  Duration : ${json.duration}\n`
         caption += `	◦  Bitrate : ${json.data.quality}\n\n`
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit.` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return conn.reply(m.chat, isOver, m.msg)
         conn.sendFile(m.chat, json.thumbnail, "image.jpg", caption, m.msg).then(async () => {
           conn.sendFile(m.chat, json.data.url, json.data.filename, '', m.msg)
         })
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m.msg)
      }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}