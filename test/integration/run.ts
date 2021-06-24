import { run, cleanup } from './steps'
;(async function main() {
  try {
    await run()
    await cleanup()
  } catch (err) {
    console.log(err)
    await cleanup()
    process.exit(1)
  }
})()
