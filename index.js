const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const unlink = util.promisify(require('fs').unlink);
const carlo = require('carlo');

const wavFile = 'output.wav';

const openJtalk = path.format({
  dir: path.join(process.cwd(), 'open_jtalk'),
  base: 'open_jtalk.exe'
});

const htsvoice = path.format({
  dir: path.join(process.cwd(), 'open_jtalk/mei'),
  base: 'mei_normal.htsvoice'
});

const dic = path.format({
  dir: path.join(process.cwd(), 'open_jtalk/dic')
});

const ffplay = path.format({
  dir: path.join(process.cwd(), 'ffmpeg'),
  base: 'ffplay.exe'
});

const speak = (text) => {
  return exec(`echo "${text}" | ${openJtalk} -m ${htsvoice} -x ${dic} -a 0.5 -r 1.15 -fm 2.8 -ow ${wavFile} && ${ffplay} -nodisp -autoexit -i ${wavFile}`);
};

(async () => {
  const app = await carlo.launch({
    width: 1040,
    height: 320
  });
  app.on('exit', () => process.exit());
  app.serveFolder(__dirname);
  app.exposeFunction('speak', (args) => {
    try {
      const context = JSON.parse(args);
      if (context.seq) {
        console.log(context.args[0]);
        speak(context.args[0]);
      }
    } catch (err) {
      console.error(err);
    }
  });
  await app.load('app/app.html');
})();

process.on('exit', async () => {
  try {
    await unlink(wavFile);
  } catch (err) {
    console.error(err);
  }
});
