require('dotenv').config()
console.clear()
const { spawn } = require('child_process')
const path = require('path')
const CFonts = require('cfonts')
const chalk = require('chalk')

if (!process.env.BOT_TOKEN || process.env.BOT_TOKEN.trim() === '') {
   console.error(chalk.red('❌ BOT_TOKEN tidak ditemukan atau kosong. Gagal menghubungkan ke main.js.'));
   process.exit(1);
}

const unhandledRejections = new Map()
process.on('uncaughtException', (err) => {
   if (err.code === 'ENOMEM') {
      console.error('Out of memory error detected. Cleaning up resources...')
   } else {
      console.error('Uncaught Exception:', err)
   }
})

process.on('unhandledRejection', (reason, promise) => {
   unhandledRejections.set(promise, reason)
   if (reason.code === 'ENOMEM') {
      console.error('Out of memory error detected. Attempting recovery...')
      Object.keys(require.cache).forEach((key) => {
         delete require.cache[key]
      })
   } else {
      console.log('Unhandled Rejection at:', promise, 'reason:', reason)
   }
})

process.on('rejectionHandled', (promise) => {
   unhandledRejections.delete(promise)
})

process.on('Something went wrong', function (err) {
   console.log('Caught exception: ', err)
})

process.on('warning', (warning) => {
   if (warning.name === 'MaxListenersExceededWarning') {
      console.warn('Potential memory leak detected:', warning.message)
   }
})

function start() {
   let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)]
   let p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
      .on('message', data => {
         if (data == 'reset') {
            console.log('Restarting...')
            p.kill()
            delete p
         }
      })
      .on('exit', code => {
         console.error('Exited with code:', code)
         start()
      })
}

const major = parseInt(process.versions.node.split('.')[0], 10)
if (major < 20) {
   console.error(
      `\n❌ This script requires Node.js 20+ to run reliably.\n` +
      `   You are using Node.js ${process.versions.node}.\n` +
      `   Please upgrade to Node.js 20+ to proceed.\n`
   )
   process.exit(1)
}

CFonts.say('Keys', {
   colors: ["cyan", "blue"],
   font: "block",
   align: "center",
   gradient: ["cyan", "blue"],
   transitionGradient: true,
})


start()