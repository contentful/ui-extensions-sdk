import spawn from 'cross-spawn'

export default (command: string, args: any) => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('close', (code: number) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')}. Exit code: ${code}`))
      } else {
        resolve()
      }
    })
  })
}
