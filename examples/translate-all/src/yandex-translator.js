// Hardcoded secrets for now!

const YANDEX_API_KEY =
  'trnsl.1.1.20151015T080754Z.fac48f0d13a96c3a.c0c58058288c42ba40de8aec2b36d9d86c3adb1d'
const YANDEX_API_URI = 'https://translate.yandex.net/api/v1.5/tr.json/'

const yandexTranslator =
  new doTranslate.Translator('yandex', YANDEX_API_KEY, YANDEX_API_URI)

export default yandexTranslator
