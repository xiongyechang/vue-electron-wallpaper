// get-metadata.js
const core = require('@actions/core')
const { version, name } = require(process.env.GITHUB_WORKSPACE + 'package.json')
core.exportVariable('VERSION', version)
core.exportVariable('NAME', name)

core.setOutput('VERSION', version)
core.setOutput('NAME', name)