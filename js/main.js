var theme = 'Night';

function buildWeatherTile(period) {
  var tile;

  tile = '<div class=\'weatherTile '+theme+'\'>';
  tile +='<div class=\'weatherTileContent '+theme+'\' id=\'period_' + period['number'] + '\'>';
  tile += '<h2 class=\'weatherTitle '+theme+'\'>' + period['name'] + '</h2>';

  var image = period['icon'];
  var image = period['icon'].replace('?size=medium', '?size=small');
  tile += '<img class=\'weatherImage '+theme+'\' src=\'' + image + '\'/>';

  var high = (-1 == period['name'].search('Night')) && (-1 == period['name'].search('night'));
  tile += '<h3 class=\'weatherTemp '+theme+'\'>' + ((high)?'High ':'Low ') + period['temperature'] + ' &#176;F</h3>';

  tile += '<h3 class=\'weatherWind '+theme+'\'>Wind ' + period['windDirection'] + ' ' + period['windSpeed'] + '</h3>';
  tile += '<h3 class=\'weatherDetail '+theme+'\'>' + period['detailedForecast'] + '</h3>';
  tile += '</div>';
  tile += '</div>';

  return tile;
}

let weather

navigator.geolocation.getCurrentPosition(location => {
  var lat = location.coords.latitude;
  var lon = location.coords.longitude;
  var currentTemp = 0;
  var feelsLike = 0;

  console.log(lat, lon);

  var rise = new Date().sunrise(lat, lon);
  var set = new Date().sunset(lat, lon);
  var now = new Date();

  if (set < rise && rise < now) {
    theme = 'Day';
  }
  else {
    theme = 'Night';
  }

  weather = new Weather(lat, lon);
  weather.initialize()
  .then(() => {

    document.getElementById('cityName').innerHTML = '<h1 class=\''+theme+'\'>' + weather.city + ', ' + weather.state + '</h1>';

    for (div of document.getElementsByClassName('theme')){
      div.className = theme;
    }

    currentTemp = Math.round(weather.current['properties']['temperature']['value'] * 1.8 + 32);
    if (null == weather.current['properties']['windChill']['value']) {
      feelsLike = Math.round(weather.current['properties']['heatIndex']['value'] * 1.8 + 32);
    } else {
      feelsLike = Math.round(weather.current['properties']['windChill']['value'] * 1.8 + 32);
    }

    document.getElementById('current').innerHTML  = '<h3>Temp ' + currentTemp + ' &#176;F</h3>';
    document.getElementById('current').innerHTML += '<h3>Like ' + feelsLike + ' &#176;F</h3>';

    console.log(document.getElementById('weatherCarrage').innerHtml);

    var index = 0;
    document.getElementById('weatherCarrage').innerHTML = '';
    for (var period of weather.forecast['properties']['periods']) {
      document.getElementById('weatherCarrage').innerHTML += buildWeatherTile(period);
      if (4 == ++index) break;
    }

  })
  .catch(err => {
    document.getElementById('cityName').innerHTML = '<h1 class=\''+theme+'\'>Error Loading Page</h1>';
    console.error(err);
  });
});

