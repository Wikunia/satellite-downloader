var $ = require('jquery'),
    dsv = require('./dsv'),
    csvParser = dsv(','),
    preview = require('./preview'),
    jsZip = require('jszip'),
    fileSaver = require('./fileSaver'),
    imageToBase64 = require('./image2base64'),
    api = require('./static-api');

var $form = $('form#editor-form'),
    $title = $('#title'),
    $csv = $('#csv'),
    $zoom = $('input#zoom'),
    $height = $('input#height'),
    $width = $('input#width'),
    $error = $('.error'),
    $example = $('.example');

var data = {};

function updateForm() {
  data.title = $title.val() || 'Satellite_Images';
  data.csv = parseCsv($csv.val());
  data.type = $('input[name=maptype]:checked').val();
  data.zoom = $zoom.val();
  data.height = $height.val();
  data.width = $width.val();
  data.center = typeof data.csv[0] !== 'undefined' ? data.csv[0].search || data.csv[0].latitude + ',' + data.csv[0].longitude : 'Berlin';
  preview.update(data);
}

function submitForm(evt) {
  updateForm();
  evt.preventDefault();

  if(!validateCsvObj(data.csv)) {showCsvError(); return false;}

  var zip = new jsZip();

  var i = 0;

  var interval = setInterval(function() {
    var d = data.csv[i];
    var center = typeof d.search == 'undefined' ?  d.latitude + ',' + d.longitude : d.search;
    data.center = center;
    
    imageToBase64(api.getImageUrl(data), function(imgName,base64) {
      base64 = base64.split(',')[1];
      zip.file(imgName + '.png', base64, {base64: true});
      if(i == data.csv.length-1) {
        var content = zip.generate({type: 'blob'});
        fileSaver.saveAs(content, data.title + '.zip');
      }
    }.bind(i, d.name));

    if(i == data.csv.length - 1) {
      clearInterval(interval);
    }
    i++;
  }, 100);
}

function showCsvError() {
  $error.fadeIn();
  window.setTimeout(function() {$error.fadeOut()}, 2000);
}

function parseCsv(csv) {
  var csvObj = csvParser.parse(csv);
  return csvObj;
}

function validateCsvObj(c) {
  var isEmpty = c.length <= 0
  c = c[0];
  return !isEmpty && (('latitude' in c && 'longitude' in c) || 'search' in c);
}

function loadExample() {
  $.ajax({
    dataType: 'text',
    url: 'data/example.csv'
  }).done(function(data) {
    console.log(data);
    $csv.val(data.toString());
  });
}

$form.on('input change', updateForm);
$form.on('submit', submitForm);
$example.on('click', loadExample);

updateForm();