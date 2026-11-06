const fs = require('fs')
const { release } = require('../package.json')

const ANALYZER = '@semantic-release/commit-analyzer'

// Only the configured commit analyzer runs, so the plan matches the real release's next version with no plugin side effects
async function main() {
  const analyzer = release.plugins.find((plugin) => [].concat(plugin)[0] === ANALYZER)
  if (!analyzer) throw new Error(`${ANALYZER} is not configured in package.json#release`)

  const { default: semanticRelease } = await import('semantic-release')
  const result = await semanticRelease({ dryRun: true, plugins: [analyzer] })
  const type = result ? result.nextRelease.type : ''

  console.log(type ? `Next release type: ${type}` : 'No release planned')
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `type=${type}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
