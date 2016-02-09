export function arrayLocalizableToTextLocalizables (
  {locale, srcLocale, srcValue, localize}
) {
  const localizedValues = srcValue.slice()
  return srcValue.map((value, i) => {
    return {
      locale,
      srcLocale,
      srcValue: value,
      valueType: 'Text',
      localize: (newValue) => {
        console.log('srcValue was', srcValue, 'set', i, 'new value is', localizedValues)
        localizedValues[i] = newValue
        localize(localizedValues)
      }
    }
  })
}

export function localeToLanguage (locale) {
  return locale.match(/^[a-z]+/)[0]
}
