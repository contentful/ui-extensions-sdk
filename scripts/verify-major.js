// Commits can land between the plan and release jobs, so a major the plan didn't route through approval fails here
const [type] = process.argv.slice(2)

if (type === 'major' && process.env.RELEASE_ENVIRONMENT !== 'release-major') {
  console.error(
    '❌ Next release is major, but this run was not approved through the release-major environment. Re-run Release to plan it again.',
  )
  process.exit(1)
}
