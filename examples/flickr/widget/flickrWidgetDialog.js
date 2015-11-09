'use strict';
(function () {

require('./flickr.css');
var cfApi;
var React = require('react');
var flickr = require('./flickr');
var debounce = require('lodash/function/debounce');


var Entry = React.createClass({
  getInitialState(){
    this.debouncedSearch = debounce(this.flickrSearch, 200);

    return {
      content: '',
      photos: []
    };
  },

  handleChange(ev) {
    var searchTerm = React.findDOMNode(this.refs.searchTerm).value;
    this.flickrSearch(searchTerm);
  },

  flickrSearch: function (searchTerm) {
    flickr.req('get', 'flickr.photos.search', {text: searchTerm})
    .then(response => {
      console.log(response.photos);
      this.setState({
        photos: response.photos.photo.slice(0,7)
      });
    });
  },

  render() {
    var photos = this.state.photos.map(photo => {
      return <img src={flickr.imgUrl(photo)} alt={photo.title} />;
    });
    return (
      <div className="flickrwidget">
        <div className="inline-form">
          <input type="text" ref="searchTerm" placeholder="What are you looking for?" />
          <button onClick={this.handleChange}>Search</button>
        </div>
        <FlickrPhotos photos={this.state.photos} />
      </div>
    );
  }
});

var FlickrPhotos = React.createClass({
  getInitialState() {
    return {
      selected: null
    };
  },

  selectChild(id) {
    this.setState({
      selected: id
    });
  },

  isSelected(id){
    return this.state.selected === id;
  },

  render() {
    var photos = this.props.photos.map(photo => {
      return <Photo key={photo.id} selected={this.isSelected(photo.id)} photo={photo} selectChild={this.selectChild} />;
    });
    return (
      <div className="photolist">{photos}</div>
    );
  }
});

var Photo = React.createClass({
  selectPhoto(){
    this.props.selectChild(this.props.photo.id);
    cfApi.dialog.setState(this.props.photo);
  },

  getClassName(){
    var classes = 'photo ';
    classes += this.props.selected ? 'selected' : '';
    return classes;
  },

  render() {
    var photo = this.props.photo;
    return (
      <button onClick={this.selectPhoto} className={this.getClassName()}>
        <img src={flickr.imgUrl(photo)} alt={photo.title} />
      </button>
    )
  }
});

window.addEventListener('cfWidgetReady', function (ev) {
  cfApi = ev.detail;
  cfApi.window.setupAutoResizer();
  React.render(<Entry />, document.getElementsByTagName('main')[0]);
});


}());
