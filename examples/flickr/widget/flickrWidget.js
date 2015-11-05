'use strict';
(function () {

var cfApi;
var React = require('react');
var flickr = require('./flickr');

var ValueChangerWidget = React.createClass({
  getInitialState(){
    return {
      url: cfApi.field.getValue(),
      title: ''
    };
  },

  handleButton() {
    cfApi.dialog.open({
      template: '<html><head></head><body>'+
        '<main></main>'+
        '<script src="http://localhost:9011/cf-widget-api.js"></script>'+
        '<script src="http://localhost:9011/flickrWidgetDialog.bundle.js"></script>'+
        '</body>'
    })
    .then(data => {
      this.setState({
        url: flickr.imgUrl(data),
        title: data.title
      });
      cfApi.field.setValue(flickr.imgUrl(data));
      cfApi.fields.get('flickrTitle').setValue(cfApi.currentFieldLocale, data.title);
      console.log('dialog confirmed', data);
    }, data => {
      console.log('dialog cancelled', data);
    });
  },

  render() {
    return (
      <div>
        <p>{this.state.title}</p>
        <img src={this.state.url} />
        <p><button onClick={this.handleButton}>Open Flickr</button></p>
      </div>
    );
  }
});



window.addEventListener('cfWidgetReady', function (ev) {
  cfApi = ev.detail;
  React.render(<ValueChangerWidget />, document.getElementsByTagName('main')[0]);
});

}());
