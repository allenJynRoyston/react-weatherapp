//---------------------------------------------------------//
//*********************************************************//
var WeatherComponent = React.createClass({

  //--- SET INITIAL STATES
  getInitialState: function () {
    return {
      temp: null,
      wind: null,
      defaultSearch: "Edinburgh",
      search: "",
      finalSearch: null,
      typeSelected: 0,
      tempTypes: [
        {id: 0, label: "Imperial",  degrees: "F",   speed: "f/s"},
        {id: 1, label: "Metric",    degrees: "C",   speed: "m/s"}
      ],
      description: [],
      currentDate: null
    }
  },
  //-------------------

  //-------------------  INIT
  componentWillMount: function () {
    var t = this;

    // fetch default search from local storage - if it doesn't exist, load default
    var ds = localStorage.getItem("citySearch");
    if(ds === null){
      t.fetchWeatherAPI(t.state.defaultSearch)
    }
    else{
      t.setState({defaultSearch: ds})
      t.fetchWeatherAPI(ds)
    }
  },
  //-------------------

  //-------------------
  fetchWeatherAPI:function(query){

    // normally I would not place an API key in the public facing javascript (since unsecure and can be stolen), but since I'm on a timer here...
    var t = this,
        appKey = "661e80346d232c78158726c9b7b62524",
        url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&mode=json&appid=" + appKey;
        if(query.length > 2){
          t.setState({ finalSearch: query.replace(/\b\w/g, l => l.toUpperCase()) })
          localStorage.setItem("citySearch", query);
          // simple GET request
          $.get(url, function( data ) {
            t.setState({ data: data })
            t.setState({ description: data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase())})
            t.convertToMetrics(t.state.typeSelected);
          });

        }

  },
  //-------------------

  //-------------------
  convertToMetrics:function(id){
    var t = this,
        tempInKelvin = t.state.data.main.temp,
        windInMetric = t.state.data.wind.speed,
        resultTemp = null,
        resultWind = null;

        switch(id) {
            // to imperial
            case 0:
              resultTemp = (( tempInKelvin - 273.15) * 9/5) + 32
              resultWind = windInMetric * 2.237
              break;
            // to metric
            case 1:
              resultTemp = (tempInKelvin - 273.15)
              resultWind = windInMetric
              break;
        }


    t.setState({ temp: resultTemp.toFixed(2)})
    t.setState({ wind: resultWind.toFixed(2)})
  },
  //-------------------

  //-------------------
  updateTempType:function(id){
    var t = this;
    t.setState({ typeSelected: id })
    t.convertToMetrics(id);
  },
  //-------------------

  //-------------------
  updateQuery:function(e){
    var t = this;
        t.setState({ search: e.target.value})
  },
  //-------------------

  //-------------------
  updateSearch:function(){
    var t = this;
    t.fetchWeatherAPI(t.state.search)
  },
  //-------------------

  //-------------------
  inputKeyPress: function(e) {
    if (e.key === 'Enter') {
      this.updateSearch();
    }
  },

  change: function(e){
    var t = this;
    t.updateTempType(parseInt(e.target.value))
  },

  //--- RENDER
  render: function () {
    var t = this;

    return (
      <div>
        <h1><i className="globe icon"></i> Weather</h1>
        <hr />

        <div className='ui icon input'>
          <input defaultValue={t.state.defaultSearch} onChange={ t.updateQuery} onKeyPress={t.inputKeyPress} placeholder='Enter a city name'/>
          <i className='inverted circular search link icon' onClick={() => t.updateSearch(t.search)}/>
        </div>
        &nbsp;&nbsp;
        <select className="ui dropdown" onChange={t.change}>
          {
            t.state.tempTypes.map(function(temp) {
              return <option value={temp.id}>{temp.label} &nbsp;&nbsp;</option>
            }, this)
          }
        </select>

        <div className="ui raised card">
          <div className="content">
            <div className="header">{t.state.finalSearch} &nbsp;&nbsp; <i className="building icon"></i></div>
            <br />
            <div className="description">
              <p><strong>Temperature: </strong>{t.state.temp} &deg;{t.state.tempTypes[t.state.typeSelected].degrees}</p>
              <p><strong>Description: </strong>{t.state.description} </p>
              <p><strong>Wind: </strong>{t.state.wind} {t.state.tempTypes[t.state.typeSelected].speed}</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
});














//---------------------------------------------------------//
//*********************************************************//
var SunriseAndSetComponent = React.createClass({

  //--- SET INITIAL STATES
  getInitialState: function () {
    return {
      data: null,
      currentDate: null,
      defaultSearch: "Edinburgh",
      search: "",
      finalSearch: null,
      time:{
        sunrise: null,
        sunset: null
      }
    }
  },
  //-------------------

  //-------------------  INIT
  componentWillMount: function () {
    var t = this;

    var ds = localStorage.getItem("citySearch");
    if(ds === null){
      t.fetchWeatherAPI(t.state.defaultSearch)
    }
    else{
      t.setState({defaultSearch: ds})
      t.fetchWeatherAPI(ds)
    }

  },
  //-------------------

  //-------------------
  fetchWeatherAPI:function(query){

    // normally I would not place an API key in the public facing javascript (since unsecure and can be stolen), but since I'm on a timer here...
    var t = this,
        appKey = "661e80346d232c78158726c9b7b62524",
        url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&mode=json&appid=" + appKey;
        if(query.length > 2){
          t.setState({ finalSearch: query.replace(/\b\w/g, l => l.toUpperCase()) })
          localStorage.setItem("citySearch", query);

          // simple jquery GET request
          $.get(url, function( data ) {
            t.setState({ data: data })
            t.setState({ time: {sunrise:  t.convertMilisecondsToHours(data.sys.sunrise), sunset:  t.convertMilisecondsToHours(data.sys.sunset)} })
          });
        }

  },
  //-------------------

  //-------------------
  convertMilisecondsToHours:function(ms){
    var date = new Date(ms * 1000);
    return date.toLocaleTimeString();
  },
  //-------------------

  //-------------------
  updateQuery:function(e){
    var t = this;
        t.setState({ search: e.target.value})
  },
  //-------------------

  //-------------------
  updateSearch:function(){
    var t = this;
    t.fetchWeatherAPI(t.state.search)
  },
  //-------------------

  //-------------------
  inputKeyPress: function(e) {
    if (e.key === 'Enter') {
      this.updateSearch();
    }
  },

  change: function(e){
    var t = this;
    t.updateTempType(parseInt(e.target.value))
  },

  //--- RENDER
  render: function () {
    var t = this;

    return (
      <div>
        <h1><i className="sun icon"></i> Sunrise / Set</h1>
        <hr />

        <div className='ui icon input'>
          <input defaultValue={t.state.defaultSearch} onChange={ t.updateQuery} onKeyPress={t.inputKeyPress} placeholder='Enter a city name'/>
          <i className='inverted circular search link icon' onClick={() => t.updateSearch(t.search)}/>
        </div>

        <div className="ui raised card">
          <div className="content">
            <div className="description">
                <p><strong>Sunrise: </strong>{t.state.time.sunrise}</p>
                <p><strong>Sunset: </strong>{t.state.time.sunset}</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
});















//---------------------------------------------------------//
//*********************************************************//
var MyHeader = React.createClass({

  //--- SET INITIAL STATES
  getInitialState: function () {
    return {
      showDefault: true,
      hash: null,
      currentDate: null,
      allowedRoutes: [
        {link: "weather",      name: "Weather"},
        {link: "sunrise_set",  name: "Sunrise/Set"}
      ]
    }
  },
  //-------------------


  //-------------------  INIT
  componentWillMount: function () {
    var t = this;

    // grab/set initial hash();
    t.getInitialHashState();

    // get current day and update every X second
    t.getCurrentDateTime();
    setInterval(function(){
      t.getCurrentDateTime();
    }, 1000)

    // catch future hash change events
    $(window).bind( 'hashchange', function(e) {
      t.updateFromUrl(t.getCurrentHash());
    });

  },
  //-------------------
  

  //------------------- GRAB INITIAL HASH
  getInitialHashState: function(){
    var t = this,
        hash = t.getCurrentHash();
    t.updateFromUrl(hash);
  },
  //-------------------


  //------------------- ENSURE ROUTE IS VALID
  checkValidRoute: function(hash){
    var t = this,
        check = false;
    // check for allowed routes
    for(var i = 0; i < t.state.allowedRoutes.length; i++){
      if(t.state.allowedRoutes[i].link == hash){
        check = true;
      }
    }

    return check;
  },
  //-------------------


  //-------------------  GRAB HASH FROM URL
  getCurrentHash: function(){
    var hashfull = window.location.hash.substr(1),
        hash = hashfull.split("&")[0];
        return hash;
  },
  //-------------------


  //------------------- UPDATE HASH
  updateFromUrl: function(new_hash){
    var t = this;

    // if routes doesn't exists, assign first as default
    if(!t.checkValidRoute(new_hash)){
      window.location.hash = t.state.allowedRoutes[0].link
    }

    t.setState({ hash: t.getCurrentHash() })
  },
  //-------------------

  //-------------------
  updateHashViaLink: function(hash) {
    window.location.hash = hash;
  },
  //-------------------

  //-------------------
  getCurrentDateTime: function(){
    var t = this,
        today = new Date(),
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
        time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
        dateTime = date+' '+time;
    t.setState({ currentDate: dateTime })
  },
  //-------------------

  //------------------- RENDER
  render: function () {
    var t = this,
        view = null;
    var names = t.state.allowedRoutes;

    // conditionally render states
    if (t.state.hash == t.state.allowedRoutes[0].link) {
      view = < WeatherComponent />;
    }
    if (t.state.hash == t.state.allowedRoutes[1].link) {
      view = < SunriseAndSetComponent />;
    }

    // render to DOM
    return (
      <div>
        <div className="ui fixed inverted menu">
            <div className="ui container">
              <a className="header item" onClick={() => t.updateHashViaLink(t.state.allowedRoutes[0].link)}>
                <img className="logo" src="assets/images/logo.svg" />
                &nbsp;&nbsp;Weather App Prototype
              </a>
              {
                t.state.allowedRoutes.map(function(route) {
                  return <a className='item' onClick={() => t.updateHashViaLink(route.link)}>{route.name} &nbsp;&nbsp;</a>
                }, this)
              }
              <a className="header item right" >{t.state.currentDate}</a>
            </div>
        </div>
        <div className='ui main text container'>
          <br />
          <br />
          <br />
          {view}
        </div>
      </div>
    );
  }
});


ReactDOM.render(<MyHeader/>, document.getElementById('app'));
