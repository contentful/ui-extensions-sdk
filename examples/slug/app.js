var input = document.getElementById('slug')

// The IDs of the content types we check for duplicate slug values.
var contentTypes = ['slug', 'slug2']

window.contentfulWidget.init(function (api) {
  var statusElements = {
    error: document.getElementById('error'),
    ok: document.getElementById('ok'),
    loading: document.getElementById('loading')
  }

  api.window.updateHeight()

  var slugField = api.field
  var titleField = api.entry.fields.title

  titleField.onValueChanged(function (title) {
    setSlug(window.getSlug(title || ''))
  })

  var debouncedUpdateStatus = _.debounce(updateStatus, 500)

  updateStatus(slugField.getValue())

  /**
   * Set the input value to 'slug' and update the status by checking for
   * duplicates.
   */
  function setSlug (slug) {
    input.value = slug
    slugField.setValue(slug)
    setStatusStyle('loading')
    debouncedUpdateStatus(slug)
  }

  function updateStatus(slug) {
    getDuplicates(slug).then(function (hasDuplicates) {
      if (hasDuplicates) {
        setStatusStyles('error')
      } else {
        setStatusStyles('ok')
      }
    })
  }

  function setStatusStyles (status) {
    _.each(statusElements, function (el, name) {
      if (name === status) {
        el.style.display = 'inline'
      } else {
        el.style.display = 'none'
      }
    })
  }


  function hasDuplicates (slug) {
    if (!slug) {
      return Promise.resolve(false)
    }

    return Promise.all(
      contentTypes.map(function (ct) {
        return contentTypeDuplicates(ct, slug)
      })
    ).then(function (values) {
      return _.any(values)
    })
  }

  /**
   * Resolves to 'true' if there are entries of the given content type that have
   * the same 'slug' value.
   */
  function contentTypeDuplicates (ct, slug) {
    var query = {}
    query['content_type'] = ct
    query['fields.' + api.field.id] = slug;
    query['sys.id[ne]'] = api.entry.getSys().id;
    query['sys.publishedAt[exists]'] = true;

    return api.space.getEntries(query)
    .then(function (result) {
      return result.length > 0
    })
  }
})
