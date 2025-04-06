const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mime = require("mime-types");
const { fromBuffer } = require("file-type");
const moment = require("moment-timezone");

class Function {
  greeting() {
    let time = moment.tz("Asia/Makassar").format('HH')
    let res = `Don't forget to sleep`
    if (time >= 3) res = `Good Evening`
    if (time > 6) res = `Good Morning`
    if (time >= 11) res = `Good Afternoon`
    if (time >= 18) res = `Good Night`
    return res
  }
  sizeLimit(str, max) {
    let data
    if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
      oversize: true
    }
    if (str.match('M') || str.match('MB')) {
      let first = str.replace(/MB|M|G|T/g, '').trim()
      if (isNaN(first)) return data = {
        oversize: true
      }
      if (first > max) return data = {
        oversize: true
      }
      return data = {
        oversize: false
      }
    } else {
      return data = {
        oversize: false
      }
    }
  }
  jsonRandom(file) {
    let json = JSON.parse(fs.readFileSync(file))
    return json[Math.floor(Math.random() * json.length)]
  }
  toTime(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
  }
  uuid() {
    return Math.random().toString(36).substr(2, 9);
  }
  example = (isPrefix, command, args) => {
      return `📮 Example : ${isPrefix + command} ${args}`
  }
  jsonFormat(obj) {
    try {
      let print = (obj && (obj.constructor.name == 'Object' || obj.constructor.name == 'Array')) ? require('util').format(JSON.stringify(obj, null, 2)) : require('util').format(obj)
      return print
    } catch {
      return require('util').format(obj)
    }
  }
  fetchJson = async (url, options) => {
    try {
      options ? options : {};
      const res = await axios({
        method: "GET",
        url: url,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        },
        ...options,
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };
  fetchBuffer = async (url, options) => {
    try {
      options ? options : {}
      const res = await axios({
        method: "GET",
        url,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
          'DNT': 1,
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (err) {
      return err
    }
  }
  Styles(text, style = 1) {
    var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('')
    var yStr = Object.freeze({
      1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
    })
    var replacer = []
    xStr.map((v, i) => replacer.push({
      original: v,
      convert: yStr[style].split('')[i]
    }))
    var str = text.toLowerCase().split('')
    var output = []
    str.map(v => {
      const find = replacer.find(x => x.original == v)
      find ? output.push(find.convert) : output.push(v)
    })
    return output.join('')
  }
  
  formatSize(size) {
    if (size < 1024) return size + " B";
    else if (size < 1048576) return (size / 1024).toFixed(2) + " KB";
    else if (size < 1073741824) return (size / 1048576).toFixed(2) + " MB";
    else return (size / 1073741824).toFixed(2) + " GB";
  }
  arrayJoin(arr) {
    var construct = []
    for (var i = 0; i < arr.length; i++) construct = construct.concat(arr[i])
    return construct
  }
  getFile(source, filename, options) {
    return new Promise(async (resolve) => {
      try {
        const tempDir = path.join(process.cwd(), 'temp'); // Menentukan direktori 'temp' di current working directory
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir); // Pastikan direktori 'temp' ada
        if (Buffer.isBuffer(source)) {
          let ext, mimeType;
          try {
            mimeType = await (await fromBuffer(source)).mime;
            ext = await (await fromBuffer(source)).ext;
          } catch {
            mimeType = mime.lookup(filename ? filename.split(".")[filename.split(".").length - 1] : "txt");
            ext = mime.extension(mimeType);
          }

          let size = Buffer.byteLength(source);
          let filepath = path.join(tempDir, this.uuid() + "." + ext);
          fs.writeFileSync(filepath, source);

          let data = {
            status: true,
            file: filepath,
            filename: filename || path.basename(filepath),
            mime: mimeType,
            extension: ext,
            size: this.formatSize(size),
            bytes: size,
          };
          resolve(data);
        } else if (source.startsWith("./") || source.startsWith("/")) {
          let ext, mimeType;
          try {
            mimeType = await (await fromBuffer(source)).mime;
            ext = await (await fromBuffer(source)).ext;
          } catch {
            mimeType = mime.lookup(filename ? filename.split(".")[filename.split(".").length - 1] : "txt");
            ext = mime.extension(mimeType);
          }

          let size = fs.statSync(source).size;
          let data = {
            status: true,
            file: source,
            filename: filename || path.basename(source),
            mime: mimeType,
            extension: ext,
            size: this.formatSize(size),
            bytes: size,
          };
          resolve(data);
        } else {
          axios
            .get(source, {
              responseType: "stream",
              ...options,
            })
            .then(async (response) => {
              let extension = filename
                ? filename.split(".")[filename.split(".").length - 1]
                : mime.extension(response.headers["content-type"]);
              let file = fs.createWriteStream(path.join(tempDir, this.uuid() + "." + extension));
              let name = filename || path.basename(file.path);
              response.data.pipe(file);

              file.on("finish", async () => {
                let data = {
                  status: true,
                  file: file.path,
                  filename: name,
                  mime: mime.lookup(file.path),
                  extension: extension,
                  size: this.formatSize(response.headers["content-length"] || 0),
                  bytes: response.headers["content-length"] || 0,
                };
                resolve(data);
                file.close();
              });
            });
        }
      } catch (e) {
        console.log(e);
        resolve({
          status: false,
        });
      }
    });
  }
}

module.exports = new Function();
