var api = require('google-maps-image-api-url');

function getImageUrl(data) {

  var configObj = {
    type: 'staticmap',
    center: data.center,
    zoom: data.zoom,
    size: data.width + 'x' + data.height,
    scale: 1,
    format: 'PNG',
    maptype: data.type
  }

  return api(configObj);
}

module.exports = {
  getImageUrl : getImageUrl
}