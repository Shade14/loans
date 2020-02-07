import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
import 'popper.js';
import 'bootstrap';
import * as L from 'leaflet';
import country from 'country-list-js';

var minUsd = 22.5;
var maxUsd = 500;
var minEur, maxEur, minCad, maxCad;
var euroExRate = 0.91;
var cadExRate = 1.32;

var exchange = {
  exToEuro: function(val) {
    return val * euroExRate;
  },
  exToCad: function(val) {
    return val * cadExRate;
  }
};

var change = {
  usd: function() {
    // e.preventDefault();
    $('.minLoan').text(minUsd);
    $('.maxLoan').text(maxUsd);
    $('.sign').text('$');
  },
  cad: function() {
    // e.preventDefault();
    minCad = exchange.exToCad(minUsd);
    maxCad = exchange.exToCad(maxUsd);
    $('.minLoan').text(minCad.toFixed(2));
    $('.maxLoan').text(maxCad.toFixed(2));
    $('.sign').text('CA$');
  },
  eur: function() {
    // e.preventDefault();
    minEur = exchange.exToEuro(minUsd);
    maxEur = exchange.exToEuro(maxUsd);
    $('.minLoan').text(minEur.toFixed(2));
    $('.maxLoan').text(maxEur.toFixed(2));
    $('.sign').text('€');
  }
};


$(document).ready(function(e) {

  var map = L.map('mymap').setView([0, 0], 1);
  var url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

  L.tileLayer( url, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1Ijoic2hhZGUxNCIsImEiOiJjazY5aGNqcGYwMnd3M2Rxbnd4d21iM21tIn0.-p8k19uzIo0IXbmsb-8wdA'
  }).addTo(map);

  map.locate({
    setView: true,
    maxZoom: 16
  });

  var location = {
    onLocationFound: function(e) {
      var latitude = e.latlng.lat;
      var longitude = e.latlng.lng;
      $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ latitude +'&lon=' + longitude, function(data) {
        var found = country.findByName(data.address.country);
        // console.log(found);
        if (found.name === 'Canada') {
          change.cad();
        }
        else if (found.continent === 'Europe') {
          change.eur();
        }
        else {
          change.usd();
        }
      });
    },
    onLocationError: function(e) {
      alert(e.message);
      change.usd();
    }
  };

  map.on('locationfound', location.onLocationFound);
  map.on('locationerror', location.onLocationError);

  //dropdown-----------------
  //change to euro
  $('.eur').on('click', change.eur);

  //change to cad
  $('.cad').on('click', change.cad);

  //change to usd
  $('.usd').on('click', change.usd);

});
