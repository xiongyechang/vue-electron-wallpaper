// 修改 latest.yml 信息
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const core = require('@actions/core');

const asset_url = core.getInput('asset_url', { required: true });

const dist = path.join(process.env.GITHUB_WORKSPACE, 'dist_electron');

const WindowsLatestYaml = path.join(dist, 'latest.yml');

const wdoc = yaml.load((fs.readFileSync(WindowsLatestYaml)).toString());

const files = wdoc.files;

files.forEach(file => {
  file.url = asset_url;
});

const wout = yaml.dump(wdoc);

console.log(wout);

fs.writeFileSync(WindowsLatestYaml, wout);



