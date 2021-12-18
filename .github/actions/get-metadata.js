// get-metadata.js
const core = require('@actions/core')
const path = require('path');
const { version, name } = require(path.join(process.env.GITHUB_WORKSPACE, 'package.json'))
core.exportVariable('VERSION', version)
core.exportVariable('NAME', name)

core.setOutput('VERSION', version)
core.setOutput('NAME', name)