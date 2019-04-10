[
  'CONTENTFUL_PAT',
  'CONTENTFUL_CMA_URL',
  'CONTENTFUL_APP_URL',
  'CONTENTFUL_USER',
  'CONTENTFUL_PASSWORD'
].forEach(envvar => {
  console.log(`${envvar}=${process.env[envvar]}`)
})

console.log('No tests yet.')

process.exit(0)
