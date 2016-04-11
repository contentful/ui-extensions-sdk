import 'babel-polyfill'

export default class NonLocalizedLocalizablesGenerator {
  constructor (entry, fieldTypes, defaultLocale) {
    this.entry = entry
    this.fieldTypes = fieldTypes
    this.defaultLocale = defaultLocale
  }

  * generateLocalizables () {
    const fields = this.entry.fields
    for (let fieldId in fields) {
      const field = fields[fieldId]
      yield* this._generateLocalizablesOfField(field, fieldId)
    }
  }

  * _generateLocalizablesOfField (field, fieldId) {
    const srcLocale = this.defaultLocale
    const srcValue = field.getValue()
    if (srcValue === undefined) {
      return
    }
    const valueType = this.fieldTypes[fieldId]

    for (let locale of field.locales) {
      const value = field.getValue(locale)
      // TODO: Remove one of those once we made up our mind what to return.
      if (value === undefined || value === null) {
        yield {
          locale,
          srcLocale,
          valueType,
          localize: (value) => field.setValue(value, locale)
        }
      }
    }
  }
}
