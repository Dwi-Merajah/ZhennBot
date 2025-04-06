(async () => {
    require('dotenv').config();
    require('events').EventEmitter.defaultMaxListeners = 500;
    require("./lib/config.js");
    
    global.db = {
        users: [],
        chats: [],
        groups: [],
        redeem: {},
        menfess: {},
        statistic: {},
        sticker: {},
        msgs: {},
        setting: {},
        ...(await machine.fetch() || {})
    };

    await machine.save(global.db);
    setInterval(async () => {
        if (global.db) await machine.save(global.db);
    }, 30 * 1000);

    const loadPlugins = async () => {
        const files = await Scandir(process.cwd() + '/plugins');
        const plugins = Object.fromEntries(files.filter(v => v.endsWith('.js')).map(file => [path.basename(file, '.js'), require(path.resolve(process.cwd() + '/plugins', file))]));
        global.plugins = plugins;
    };

    loadPlugins();

    conn.on("message", async (msg) => {
        const m = smsg(conn, msg) || msg;
        await handler(conn, m, env);
    });
    conn.on("callback_query", async (callbackQuery) => {
     try {
        const m = smsg(conn, callbackQuery.message);
        m.text = callbackQuery.data;
        await handler(conn, m, env);
        await conn.editMessageReplyMarkup({
            inline_keyboard: []
        }, {
            chat_id: m.chat,
            message_id: m.id
        });

    } catch (error) {
        console.error("Error handling callback query:", error);
    }
  });
})();