'use strict';
(function () {

var cfApi;
var React = require('react');

var Entry = React.createClass({
  getInitialState(){
    return {
      content: '',
      input: ''
    };
  },

  handleChange(ev) {
    this.setState({
      input: ev.target.value
    });
    cfApi.dialog.setState(ev.target.value);
  },

  render() {
    return (
      <div>
        <p>{this.state.content}</p>
        <p>{this.state.input}</p>
        <input type="text" onChange={this.handleChange} />
      </div>
    );
  }
});


window.addEventListener('cfWidgetReady', function (ev) {
  cfApi = ev.detail;
  React.render(<Entry />, document.getElementsByTagName('main')[0]);
});


}());
