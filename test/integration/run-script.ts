import spawn from 'cross-spawn'

export default (command, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')}. Exit code: ${code}`))
      } else {
        resolve()
      }
    })
  })
}
