import fs from 'fs-extra'
import os from 'os'
import path from 'path'

const rootDirectory = fs.realpathSync(process.cwd())
export const resolvePath = (relativePath: string) => path.resolve(rootDirectory, relativePath)

let stepCount = 1

export function printStepTitle(title: string) {
  console.log('')
  console.log('-----------------------')
  console.log(`Step ${stepCount++}: ${title}`)
  console.log('-----------------------')
  console.log('')
}

export function writeJSONFile(path: string, obj: any) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + os.EOL, {
    encoding: 'utf8',
    flag: 'w'
  })
}

export function sleep(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
