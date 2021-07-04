class Weather {
  constructor (lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.cwa;
    this.gridX;
    this.gridY;
    this.city;
    this.state;
    this.station;
    this.forecast;
    this.current;
  }

  initialize () {
    let self = this;
    return new Promise (function(resolve, reject) {
      self.getGridpoints(self)
        .then(res => {
          self.cwa = res['properties']['cwa'];
          self.gridX = res['properties']['gridX'];
          self.gridY = res['properties']['gridY'];
          self.city = res['properties']['relativeLocation']['properties']['city'];
          self.state = res['properties']['relativeLocation']['properties']['state'];
          self.station = res['properties']['radarStation'];

          return self.getForecast(self);
        })
        .then(res => {
          self.forecast = res;
          return self.getCurrentWeather(self);
        })
        .then(res => {
          self.current = res;
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }

  getGridpoints (self) {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise(function(resolve, reject) {
      fetch('https://api.weather.gov/points/'+self.lat+','+self.lon, requestOptions)
        .then(response => response.text())
        .then(result => resolve(JSON.parse(result)))
        .catch(error => reject(error));
    });
  }

  getForecast (self) {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise(function(resolve, reject) {
      fetch('https://api.weather.gov/gridpoints/'+self.cwa+'/'+self.gridX+','+self.gridY+'/forecast', requestOptions)
        .then(response => response.text())
        .then(result => resolve(JSON.parse(result)))
        .catch(error => reject(error));
    });
  }

  getCurrentWeather (self) {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    return new Promise(function(resolve, reject) {
      fetch('https://api.weather.gov/stations/'+self.station+'/observations/latest', requestOptions)
        .then(response => response.text())
        .then(result => resolve(JSON.parse(result)))
        .catch(error => reject(error));
    });
  }
}