var $ = require('jquery');
var dsv = require('./dsv');
var csvParser = dsv(',');
var preview = require('./preview');
var jsZip = require('jszip');
var fileSaver = require('./fileSaver');
var imageToBase64 = require('./image2base64');
var api = require('./static-api');

var $form = $('form#editor-form'),
    $title = $('#title'),
    $csv = $('#csv'),
    $zoom = $('input#zoom'),
    $height = $('input#height'),
    $width = $('input#width');

var data = {};

function updateForm() {
  data.title = $title.val();
  data.csv = parseCsv($csv.val());
  data.type = $('input[name=maptype]:checked').val();
  data.zoom = $zoom.val();
  data.height = $height.val();
  data.width = $width.val();
  data.center = 'Berlin';
  preview.update(data);
}

function submitForm(evt) {
  evt.preventDefault();

  var zip = new jsZip();

  data.csv.forEach(function(d,i) {
    var center = typeof d.search == 'undefined' ?  d.latitude + ',' + d.longitude : d.search;
    data.center = center;
    
    imageToBase64(api.getImageUrl(data), function(imgName,base64) {
      base64 = base64.split(',')[1];
      zip.file(imgName, base64, {base64: true});
      if(i == data.csv.length-1) {
        var content = zip.generate({type:"blob"});
        fileSaver.saveAs(content, "example.zip");
      }
    }.bind(i, d.name))
  });
}

function parseCsv(csv) {
  return csvParser.parse(csv);
}

function validateCsvObj(csvObj) {
  return true;
}

$form.on('input change', updateForm);
$form.on('submit', submitForm);

updateForm();