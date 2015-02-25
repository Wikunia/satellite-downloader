var $ = require('jquery'),
    dsv = require('./dsv'),
    csvParser = dsv(','),
    hogan = require('hogan'),
    api = require('./static-api');

var $form = $('form#editor-form'),
    $title = $('#title'),
    $subtitle = $('#subtitle'),
    $csv = $('#csv'),
    $zoom = $('input#zoom'),
    $height = $('input#height'),
    $width = $('input#width'),
    $error = $('.error'),
    $example = $('.example'),
    $key = $('input#api-key'),
    $progress = $('div.progress-bar'),
    $loadingOverlay = $('div#loading-overlay'),
    $previewContainer = $('#sd-preview'),
    $tab = $('.nav-tabs').find('li'),
    $tabContent = $('.tab-content'),
    $embedCode = $('#embed-code')[0];

// template stuff
var embedTemplate = $('#embed-template').html(),
  template = hogan.compile(embedTemplate);

var data = {};

window.prog = $progress;

function updateForm() {
  data.title = $title.val() || 'Satellite_Images';
  data.subtitle = $subtitle.val();
  data.csv = parseCsv($csv.val());
  data.type = $('input[name=maptype]:checked').val();
  data.zoom = $zoom.val();
  data.height = 250;//$height.val();
  data.width = 250; //$width.val();
  data.key = $key.val();
  data.center = typeof data.csv[0] !== 'undefined' ? data.csv[0].search || data.csv[0].latitude + ',' + data.csv[0].longitude : 'Berlin';
}

function submitForm(evt) {
  updateForm();
  evt.preventDefault();

  if(!validateCsvObj(data.csv)) {showCsvError(); return false;}

  createHTML();
}

function createHTML(){

  var templateData = {
    title : data.title,
    subtitle : data.subtitle,
    images : []
  };

  templateData.images = data.csv.map(function(d){
    data.center = typeof d.search == 'undefined' ?  d.latitude + ',' + d.longitude : d.search;
    var imgUrl = api.getImageUrl(data);
    
    return { url : imgUrl };
  });

  var html = template.render(templateData);

  $previewContainer.html(html);

  var highlightedHTML = Prism.highlight(html, Prism.languages.markup)
  $embedCode.innerHTML = highlightedHTML;
}

function setProgress(val, max) {
  var percent = ~~(val / (max / 100));
  $progress.css('width', percent + '%');
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
    $csv.val(data.toString());
  });
}

function changeTab(e){
  e.preventDefault();

  $tab.removeClass('active');
  $tabContent.removeClass('active');

  var $this = $(this), 
    tabType = $this.attr('data-tab');

  $('#sd-' + tabType).addClass('active');
  $this.addClass('active');
}

$form.on('input change', updateForm);
$form.on('submit', submitForm);
$example.on('click', loadExample);
$tab.on('click', changeTab);

updateForm();