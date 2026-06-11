// Voxe overlay deploy: upload the built site (out/) to Hostinger over FTP.
// SAFETY: this script ONLY uploads/overwrites and creates folders. It NEVER
// deletes anything on the server (so the Google verification file, .git, and any
// other live-only files are left untouched). Runs on the Linux CI runner, which
// handles the colon-in-folder-name that Windows cannot.
const ftp = require('basic-ftp');

(async () => {
  const target = (process.env.DEPLOY_DIR || '').trim(); // blank = LIVE public_html root
  const client = new ftp.Client(60000);
  try {
    await client.access({
      host: process.env.FTP_SERVER,
      port: 21,
      user: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
    console.log('Connected. Root cwd:', await client.pwd());

    if (target && target !== '/') {
      await client.ensureDir(target); // create + cd into a throwaway test dir
      console.log('Deploying into subdir:', await client.pwd());
    } else {
      console.log('Deploying into LIVE public_html root.');
    }

    console.log('Uploading out/ (overlay — no deletes)...');
    await client.uploadFromDir('out'); // overwrites/creates; deletes nothing

    const here = (await client.list()).map((f) => f.name);
    for (const k of ['index.html', 'rooms.html', 'homa.html']) {
      console.log((here.includes(k) ? 'OK   ' : 'MISS ') + k);
    }
    console.log('Overlay deploy complete.');
  } finally {
    client.close();
  }
})().catch((e) => { console.error('DEPLOY ERROR:', e.message); process.exit(1); });
