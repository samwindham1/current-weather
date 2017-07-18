var colors= ['#eeeeee', '#95b4bf', '#c4fcff', '#cecece', '#364256'];
var color = 0;

var latitude;
var longitude;

var temperature;

var C_or_F = true;

function getWeather() {
  // wait for variables set
  if(typeof longitude !== 'undefined' && typeof longitude !== 'undefined'){
    $.ajax({
      method: 'GET',
      url: 'https://fcc-weather-api.glitch.me/api/current?lat=' + latitude + '&lon=' + longitude,
      success: function(r) {
        if (typeof r === 'string') {
          r = JSON.parse(r);
        }
        // handle weather conditions here:
        // console.log(r);
        temperature = r.main.temp.toFixed(1);
        changeTemp();

        var weatherDesc = r.weather[0].description;
        $('.condition .cond-2').html( weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1) );

        // change background based on conditions
        setBackground(weatherDesc, r.weather[0].id);
      }
    });
  }
  else{
    // wait for variables to exist, run again after wait-time
    setTimeout(getWeather, 10);
  }
}

function setCity(lat, long) {
  var result='';
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key=AIzaSyBR-HtEyoZhJcS5YeSttu05kE2i4JqivbE',
    success: function(r) {
      if (typeof r === 'string') {
        r = JSON.parse(r);
      }
      // get city, state values
      var city;
      var state;
      var arrAddress = r.results[0].address_components;
      $.each(arrAddress, function (i, address_component) {
        if (address_component.types[0] == 'locality') {// locality type
          city = address_component.long_name;
          if(state) return false;;
        }
        if (address_component.types[0] == 'administrative_area_level_1') {
          state = address_component.long_name;
          if(city) return false;
        }
      });
      // set location element
      $('.location .text').html(city + ', ' + state);
    }
  });
}

function setBackground(desc, id) {
  // console.log(id);
  switch(id) {
    case 500:
      $('html body').css('background-color', colors[1]);
      break;
    case 802:
      $('html body').css('background-color', colors[3]);
      break;
    case 201:
    case 200:
      $('html body').css('background-color', colors[4]);
      $('html body').css('color', '#eee');
      $('.footer .link').css('color', '#eee');
      break;
    default:
      $('html body').css('background-color', colors[0]);
      break;
           }
}

function changeTemp () {
  if(C_or_F){
    temperature = ( temperature * 9.0/5.0 + 32 ).toFixed(1);
  } else {
    temperature = ((temperature - 32) * 5.0/9.0).toFixed(1);
  }
  C_or_F = !C_or_F;
  $('.condition .cond-1').html(temperature + '&deg ' + (C_or_F ? 'C' : 'F'));
}
function changeLocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  // latitude = 19.0760;
  // longitude = 72.8777;
  setCity(latitude, longitude);
}
function failedServices() {
  alert('Oops, location services unavailable.');
  $('.location').html("Browser location services are disabled.")
}
// Start page
function init() {
  window.navigator.geolocation.getCurrentPosition(changeLocation, failedServices);
  getWeather();
}

$(document).ready(function() {
  init();
  $('.temp-toggle').click(function() {
    changeTemp();
  });
});