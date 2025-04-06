const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const Func = require("./functions");
const axios = require('axios');
const { readdir, stat } = require('fs').promises;
const { resolve, basename } = require('path');
const fs = require("fs")
const { exec } = require("child_process");

exports.makeTelegramBot = (token, options = {}) => {
  let conn = new TelegramBot(token, { polling: true, ...options });

  conn.reply = async (chatId, text, msg) => {
    let replyOptions = {};
    if (msg?.message_id) {
      replyOptions.reply_to_message_id = msg.message_id;
    }
    return conn.sendMessage(chatId, text, replyOptions);
  };
  
  conn.sendButton = async (chatId, buttons, caption, source, msg, artist = "Unknown Artist") => {
    let replyMarkup = {
        reply_markup: {
            inline_keyboard: buttons.map(btn => [{ text: btn.name, callback_data: btn.command }])
        }
    };
    let replyOptions = {};
    if (msg?.message_id) {
        replyOptions.reply_to_message_id = msg.message_id;
    }
    let fileData = await Func.getFile(source);
    if (!fileData.status) return conn.reply(chatId, "Gagal mengambil file.", msg);
    let { file, extension } = fileData;
    let tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        let outputFile = path.join(tempDir, path.basename(file));
        try {
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i "${file}" -metadata artist="${artist}" -metadata title="${path.basename(file).replace('.mp3', '')}" -codec copy "${outputFile}"`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            file = outputFile;
        } catch (err) {
            console.error("Error saat menambahkan metadata:", err);
        }
    }
    let sendFunction;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        sendFunction = conn.sendPhoto(chatId, file, { caption, ...replyOptions, ...replyMarkup });
    } else if (["mp4", "mov", "avi", "mkv"].includes(extension)) {
        sendFunction = conn.sendVideo(chatId, file, { caption, ...replyOptions, ...replyMarkup });
    } else if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        sendFunction = conn.sendAudio(chatId, file, { caption, ...replyOptions, ...replyMarkup });
    } else {
        sendFunction = conn.sendDocument(chatId, file, { caption, filename: path.basename(file), ...replyOptions, ...replyMarkup });
    }
    sendFunction.finally(() => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });

    return sendFunction;
   };
     
    conn.sendFile = async (chatId, source, filename = "", caption = "", msg, artist = "Unknown Artist") => {
    let replyOptions = {};
    if (msg?.message_id) {
        replyOptions.reply_to_message_id = msg.message_id;
    }

    let fileData = await Func.getFile(source, filename);
    if (!fileData.status) return conn.reply(chatId, "Gagal mengambil file.", msg);
    let { file, extension } = fileData;
    let tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        let outputFile = path.join(tempDir, filename);
        try {
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i "${file}" -metadata artist="${artist}" -metadata title="${filename.replace('.mp3', '')}" -codec copy "${outputFile}"`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            file = outputFile;
        } catch (err) {
            console.error("Error saat menambahkan metadata:", err);
        }
    }

    let sendFunction;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        sendFunction = conn.sendPhoto(chatId, file, { caption, ...replyOptions });
    } else if (["mp4", "mov", "avi", "mkv"].includes(extension)) {
        sendFunction = conn.sendVideo(chatId, file, { caption, ...replyOptions });
    } else if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        sendFunction = conn.sendAudio(chatId, file, { caption, ...replyOptions });
    } else {
        sendFunction = conn.sendDocument(chatId, file, { caption, filename, ...replyOptions });
    }

    sendFunction.finally(() => {
    const filePath = process.cwd() + "/media/cover.jpg";
    if (file !== filePath && fs.existsSync(file)) {
        fs.unlinkSync(file);
     }
    });

    return sendFunction;
  };
  return conn;
};

exports.smsg = (conn, msg) => {
  if (!msg) return msg;

  let m = {
    msg: msg,
    id: msg.message_id,
    chat: msg.chat.id,
    isGroup: msg.chat.type === "group" || msg.chat.type === "supergroup",
    sender: msg.from.id,
    name: msg.from.first_name || "",
    username: msg.from.username || null,
    text: msg.text || msg.caption || "", 
    mentionedJid: msg.entities ? msg.entities.filter(entity => entity.type === "mention").map(entity => msg.text.substring(entity.offset, entity.offset + entity.length)) : [],
    quoted: msg.reply_to_message ? exports.smsg(conn, msg.reply_to_message) : null,
    groupName: msg.chat.title || null,
    type: "text"
  };

  if (msg.photo) m.type = "photo";
  else if (msg.video) m.type = "video";
  else if (msg.audio) m.type = "audio";
  else if (msg.voice) m.type = "voice";
  else if (msg.document) m.type = "document";
  else if (msg.sticker) m.type = "sticker";
  else if (msg.animation) m.type = "animation";

  m.reply = (text) => conn.reply(m.chat, text, m.msg);

  m.download = async () => {
    try {
      let fileId =
        msg.photo?.[msg.photo.length - 1]?.file_id ||
        msg.video?.file_id ||
        msg.document?.file_id;

      if (!fileId) {
        return null;
      }

      let fileInfo = await conn.getFile(fileId);
      let fileUrl = `https://api.telegram.org/file/bot${conn.token}/${fileInfo.file_path}`;

      let response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "arraybuffer",
      });

      return response.data;
    } catch (err) {
      console.error("Gagal mengunduh file:", err);
      return null;
    }
  };

  return m || msg;
};

exports.Scandir = async (dir) => {
  let subdirs = await readdir(dir)
  let files = await Promise.all(subdirs.map(async (subdir) => {
    let res = resolve(dir, subdir)
    return (await stat(res)).isDirectory() ? Scandir(res) : res
  }))
  return files.reduce((a, f) => a.concat(f), [])
}