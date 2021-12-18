// modify-latest.js
const core = require('@actions/core')
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const dist = path.join(process.env.GITHUB_WORKSPACE, 'dist_electron');

const AppImage_download_url = core.getInput('AppImage_download_url', { required: true });
const deb_download_url = core.getInput('deb_download_url', { required: true });
const rpm_download_rul = core.getInput('rpm_download_url', { required: true });

const linuxLatestYaml = path.join(dist, 'latest-linux.yml');
const ldoc = yaml.load((fs.readFileSync(linuxLatestYaml)).toString());
console.log(ldoc);
const files = ldoc.files;
files.forEach(file => {
  const map = {
    AppImage: AppImage_download_url,
    deb: deb_download_url,
    rpm: rpm_download_rul
  }
  const extname = path.extname(file.url).slice('1');
  file.url = map[extname];
});

const out = yaml.dump(ldoc);
console.log(out);

fs.writeFileSync(linuxLatestYaml, out);

// const exe_download_rul = core.getInput('exe_download_url', { required: true });
// const WindowsLatestYaml = path.join(dist, 'latest.yml');
// const wdoc = yaml.load((fs.readFileSync(WindowsLatestYaml)).toString());
// console.log(wdoc);
// const files = wdoc.files;
// files.forEach(file => {
//   file.url = exe_download_rul;
// });

// const wout = yaml.dump(wdoc);
// console.log(wout);

// fs.writeFileSync(WindowsLatestYaml, wout);



