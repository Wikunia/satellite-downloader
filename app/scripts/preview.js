var $ = require('jquery'),
    staticApi = require('./static-api');

var $imgContainer = $('#preview'),
    $img;

function update(data) {
  if(typeof $img == 'undefined') {
    $img = $('<img/>');
    $imgContainer.append($img);
  }
  var url = staticApi.getImageUrl(data);

  $img.attr('src', url);
}

module.exports = {
  update : update
}