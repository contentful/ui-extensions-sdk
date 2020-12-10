import spawn from 'cross-spawn'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import os from 'os'
import { printStepTitle } from '../utils'

export default async () => {
  printStepTitle('Runnings tests...')

  const cypressJSONRaw = fs.readFileSync(path.resolve(__dirname, '../../../cypress.json'), {
    encoding: 'UTF-8',
  })
  const cypressJSON = JSON.parse(cypressJSONRaw)

  const testFiles = await new Promise<string[]>((resolve, reject) =>
    glob(
      path.resolve(
        cypressJSON.integrationFolder || 'cypress/integration',
        cypressJSON.testFiles || '**/*.*'
      ),
      {
        cwd: path.resolve(__dirname, '../../..'),
      },
      (error, matches) => {
        if (error) {
          reject(error)
        }
        resolve(matches)
      }
    )
  )

  const chunk1 = testFiles.slice(0, testFiles.length / 2)
  const chunk2 = testFiles.slice(testFiles.length / 2, testFiles.length)

  await Promise.all([chunk1, chunk2].map((chunk, chunkIndex) => run(chunk, chunkIndex)))
}

async function run(specFiles: string[], index: number) {
  return await runScript(
    './node_modules/.bin/cypress',
    ['run', '--browser', 'chrome', '--spec', specFiles.join(',')],
    index
  )
}

async function runScript(command: string, args: any, index: number) {
  const XDG_CONFIG_HOME = path.resolve(process.env.TMPDIR || os.tmpdir(), `cypress-${index}`)
  fs.mkdirSync(XDG_CONFIG_HOME, { recursive: true })

  await new Promise<void>((resolve, reject) => {
    let data = ''
    const child = spawn(command, args, {
      stdio: 'pipe',
      env: {
        ...process.env,
        XDG_CONFIG_HOME,
      },
    })
    child.stdout!.on('data', (message) => {
      data += message
    })
    child.on('close', (code: number) => {
      console.log(data)
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')}. Exit code: ${code}`))
      } else {
        resolve()
      }
    })
  })
}
