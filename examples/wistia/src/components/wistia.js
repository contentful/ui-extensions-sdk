export default class Wistia {

  constructor() {
    this.videoBrowserEl = document.querySelector('.videoBrowser');
    this.errorEl = document.querySelector('.error');
    this.preloaderEl = document.querySelector('.preloader');
    this.widgetApi = null;
    this.axios = require('axios');
  }

  getVideos(projectId, url) {
    if (!this.widgetApi) {
      return;
    }
    this.axios.get(url, {
        params: {
          project_id: projectId
        }
      })
      .then(response => {
        this.preloaderEl.style.display = 'none';

        const ejsTemplate = require('ejs!./../templates/video-browser.ejs');

        this.videoBrowserEl.innerHTML = ejsTemplate({'title': 'Wistia Widget', 'data': response.data});

        this.inputEl = document.getElementById('wistia-url');

        // Pass value from Contentful to input element.
        this.inputEl.value = this.widgetApi.field.getValue();

        // TODO (floelhoeffel): Is this a save assumption to access DOM here?
        const thumbnailEls = document.querySelectorAll('.thumbnail .btn');

        for (let i = 0; i < thumbnailEls.length; i++) {
          thumbnailEls[i].addEventListener('click', this.onThumbnailClick.bind(this));
        }
      })
      .catch(response => {
        this.preloaderEl.style.display = 'none';
        this.errorEl.style.display = 'block';
        console.error(response);
      });
  }

  /**
   * Calls the callback every time the value of the field is changed by some external event
   * (e.g. when multiple editors are working on the same entry).
   * @param val The newly changed value.
   */
  onValueChanged(val) {

    if (this.inputEl) {
      this.inputEl.value = val;
    }
  }

  setWidgetAPI(widget) {
    this.widgetApi = widget;

    this.widgetApi.field.onValueChanged(this.onValueChanged.bind(this));

    // Resize iframe in Contenful UI.
    this.widgetApi.window.updateHeight();
  }

  onThumbnailClick(event) {
    if (!this.inputEl) {
      return;
    }
    if (this.activeThumbnailEl) {
      this.activeThumbnailEl.classList.remove('active');
    }
    event.currentTarget.classList.add('active');

    const embedURL = '//fast.wistia.net/embed/iframe/' + event.currentTarget.dataset.videoId;

    // Show value in view.
    this.inputEl.value = embedURL;

    this.activeThumbnailEl = event.currentTarget;

    // Send value to entry in Contentful.
    if (this.widgetApi) {
      this.widgetApi.field.setValue(embedURL);
    }
  }
}
