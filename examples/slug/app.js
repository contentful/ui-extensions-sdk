var input = document.getElementById('slug')
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

  function setSlug (slug) {
    input.value = slug
    slugField.setValue(slug)
    setStatus('loading')
    debouncedUpdateStatus(slug)
  }

  function setStatus (status) {
    _.each(statusElements, function (el, name) {
      if (name === status) {
        el.style.display = 'inline'
      } else {
        el.style.display = 'none'
      }
    })
  }

  function updateStatus(slug) {
    console.log('update')
    getDuplicates(slug).then(function (hasDuplicates) {
      if (hasDuplicates) {
        setStatus('error')
      } else {
        setStatus('ok')
      }
    })

  }

  function getDuplicates (slug) {
    if (!slug) {
      return Promise.resolve(false)
    }

    return Promise.all(
      contentTypes.map(function (ct) { return query(ct, slug)})
    ).then(function (values) {
      return _.any(values)
    })
  }

  function query(ct, slug) {
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
