import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
import 'popper.js';
import 'bootstrap';
import * as L from 'leaflet';
import country from 'country-list-js';
import * as Cookies from 'js-cookie';

var allNum = [];
var euroExRate = 0.91;
var cadExRate = 1.32;

var inputs = $('.curNum');
// console.log(inputs);

for (var i = 0; i < inputs.length; i++) {
  allNum.push(Number(inputs[i].innerText));
}

var exchange = {
  exToEur: function(val) {
    return val * euroExRate;
  },
  exToCad: function(val) {
    return val * cadExRate;
  },
  exToUsd: function(val) {
    return val;
  }
};

var change = {
  usd: function() {
    // e.preventDefault();
    $.each(allNum, function(index, value) {
      var numUsd = exchange.exToUsd(value);
      inputs[index].innerText = numUsd;
    });
    $('.curSign').text('$');
    // Cookies.remove('currency');
    Cookies.set('currency', 'usd', { expires: 365 });
  },
  cad: function() {
    // e.preventDefault();
    $.each(allNum, function(index, value) {
      var numCad = exchange.exToCad(value);
      inputs[index].innerText = numCad.toFixed(2);
    });
    $('.curSign').text('CA$');
    // Cookies.remove('currency');
    Cookies.set('currency', 'cad', { expires: 365 });
  },
  eur: function() {
    // e.preventDefault();
    $.each(allNum, function(index, value) {
      var numEur = exchange.exToEur(value);
      inputs[index].innerText = numEur.toFixed(2);
    });
    $('.curSign').text('€');
    // Cookies.remove('currency');
    Cookies.set('currency', 'eur', { expires: 365 });
  }
};


$(document).ready(function(e) {

  // e.preventDefault();
  if (!Cookies.get('currency')) {
    change.usd();
  }
  else if (Cookies.get('currency') === 'usd') {
    change.usd();
  }
  else if (Cookies.get('currency') === 'cad') {
    change.cad();
  }
  else if (Cookies.get('currency') === 'eur') {
    change.eur();
  }

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
      // e.preventDefault();
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
      // e.preventDefault();
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
