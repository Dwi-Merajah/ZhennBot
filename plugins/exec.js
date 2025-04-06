const { exec } = require('child_process');
const syntax = require('syntax-error');

exports.run = {
   async: async (m, { conn, Api, body, Func, users, env, isROwner }) => {
      if (typeof body === 'object' || !isROwner) return;
      let command, text;
      let x = body && body.trim().split`\n`, y = '';
      command = x[0] ? x[0].split` ` [0] : '';
      y += x[0] ? x[0].split` `.slice`1`.join` ` : '', y += x ? x.slice`1`.join`\n` : '';
      text = y.trim();
      if (!text) return;
      if (command === '=>') {
         try {
            const evL = await eval(`(async () => { return ${text} })()`);
            conn.reply(m.chat, Func.jsonFormat(evL), m);
         } catch (e) {
            const err = await syntax(text);
            m.reply(typeof err !== 'undefined' ? err + '\n\n' : '' + require('util').format(e));
         }
      } else if (command === '>') {
         try {
            const evL = await eval(`(async () => { ${text} })()`);
            m.reply(Func.jsonFormat(evL));
         } catch (e) {
            const err = await syntax(text);
            m.reply(typeof err !== 'undefined' ? err + '\n\n' : '' + Func.jsonFormat(e));
         }
      } else if (command == '$') {
         exec(text.trim(), (err, stdout) => {
            if (err) return m.reply(err.toString());
            if (stdout) return m.reply(stdout.toString());
         });
      }
   },
   error: false,
   cache: true,
   location: __filename
};