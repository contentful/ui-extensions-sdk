'use strict';
(function () {

var cfApi;
var React = require('react');

var ValueChangerWidget = React.createClass({
  getInitialState(){
    return {
      value: cfApi.field.getValue()
    };
  },

  componentDidMount() {
  },

  handleButton() {
    cfApi.dialog.open({
      template: '<html><head></head><body>'+
        '<main></main>'+
        '<script src="http://localhost:9011/cf-widget-api.js"></script>'+
        '<script src="http://localhost:9011/valueChangerWidgetDialog.bundle.js"></script>'+
        '</body>'
    })
    .then(data => {
      this.setState({value: data});
      cfApi.field.setValue(data);
      console.log('dialog confirmed', data);
    }, data => {
      console.log('dialog cancelled', data);
    });
  },

  render() {
    return (
      <div>
        <p>{this.state.value}</p>
        <button onClick={this.handleButton}>open value changer</button>
      </div>
    );
  }
});



window.addEventListener('cfWidgetReady', function (ev) {
  cfApi = ev.detail;
  React.render(<ValueChangerWidget />, document.getElementsByTagName('main')[0]);
});

}());
