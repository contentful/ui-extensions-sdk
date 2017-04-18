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
        localizedValues[i] = newValue
        localize(localizedValues)
      }
    }
  })
}

export function localeToLanguage (locale) {
  return locale.match(/^[a-z]+/)[0]
}
