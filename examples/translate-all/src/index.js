/**
 * Custom sidebar widget to translate all content.
 * Displays a “Translate all content” button in the sidebar.
 */

import Localizer from './localizer'
import NonLocalizedLocalizablesGenerator from './localizables-generator'

const $ = document.querySelector.bind(document)

window.contentfulWidget.init(initWidget)

function initWidget (cfApi) {
  cfApi.window.startAutoResizer()

  const contentTypeId = cfApi.entry.getSys().contentType.sys.id
  const translateButton = $('#trall-btn-translate')
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

    newLocalizer().localize(localesGenerator.generateLocalizables())
      .then(releaseButton)
      .catch(releaseButton)

    function releaseButton () {
      translateButton.classList.remove('cf-is-loading')
      translateButton.disabled = false
    }
  })

  function newLocalizer () {
    const copyUntranslatableLocales = $('#trall-copy-untranslatable').checked
    return new Localizer({copyUntranslatableLocales})
  }
}

function getFieldTypesMapFromContentType (contentType) {
  const fieldTypes = {}
  contentType.fields.forEach((fieldDefinition) => {
    fieldTypes[fieldDefinition.id] = fieldDefinition.type
  })
  return fieldTypes
}
