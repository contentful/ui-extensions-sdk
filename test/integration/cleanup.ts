import { cleanup } from './setup'
;(async function main() {
  try {
    await cleanup()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
