import { setup, cleanup } from './steps'
;(async function main() {
  try {
    await setup()
  } catch (err) {
    console.log(err)
    await cleanup()
    process.exit(1)
  }
})()
