/**
 * Custom sidebar widget to translate all content.
 * Displays a “Translate all content” button in the sidebar.
 */

import 'babel-polyfill'

import Localizer from './localizer'
import NonLocalizedLocalizablesGenerator from './localizables-generator'

window.contentfulWidget.init(initWidget)

function initWidget (cfApi) {
  cfApi.window.updateHeight()

  const contentTypeId = cfApi.entry.getSys().contentType.sys.id
  const translateButton = document.getElementsByTagName('button')[0]
  const translator = new Localizer()
  let localesGenerator

  cfApi.space.getContentType(contentTypeId).then(function (contentType) {
    const fieldTypes = getFieldTypesMapFromContentType(contentType)
    localesGenerator =
      new NonLocalizedLocalizablesGenerator(
        cfApi.entry, fieldTypes, cfApi.locales.default)

    translateButton.disabled = false
  })

  translateButton.addEventListener('click', () => {
    translateButton.classList.add('cf-is-loading')
    translateButton.disabled = true

    translator.localize(localesGenerator.generateLocalizables())
      .then(releaseButton)
      .catch(releaseButton)

    function releaseButton () {
      translateButton.classList.remove('cf-is-loading')
      translateButton.disabled = false
    }
  })
}

function getFieldTypesMapFromContentType (contentType) {
  const fieldTypes = {}
  contentType.fields.forEach((fieldDefinition) => {
    fieldTypes[fieldDefinition.id] = fieldDefinition.type
  })
  return fieldTypes
}
