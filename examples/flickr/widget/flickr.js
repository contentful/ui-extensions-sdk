var axios = require('axios');
var qs = require('querystring');
var config = 'format=json&api_key=e86f3f9b4c8fda066c35dd855a00f9ba&';

module.exports = {
  req: function (httpMethod, flickrMethod, params) {
    params = params ? '&'+qs.stringify(params) : '';
    return axios[httpMethod]('https://api.flickr.com/services/rest/?'+config+'method='+flickrMethod+params)
    .then(response => {
      var jsonString = response.data.replace('jsonFlickrApi(', '').replace(/\)$/, '');
      return JSON.parse(jsonString);
    }, data => {
      console.log('error', data);
    });
  },

  imgUrl: function (photo) {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_s.jpg`;
  }
}
