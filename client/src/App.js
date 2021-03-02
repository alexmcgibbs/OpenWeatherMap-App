import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import api from './api'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import ListboxComponent from './ListboxComponent'
import Button from '@material-ui/core/Button';
import ButtonAppBar from './ButtonAppBar.js'
import SimpleCard from './SimpleCard.js'


function App(props) {
  const [countriesLoading, setCountriesLoading] = useState(props.countriesLoading)
  const [citiesLoading, setCitiesLoading] = useState(props.citiesLoading)

  const [countries, setCountries] = useState(props.countries)
  const [selectedCountry, setSelectedCountry] = useState(props.selectedCountry)
  const [cities, setCities] = useState(props.cities)
  const [selectedCity, setSelectedCity] = useState(props.selectedCity)

  const [wind, setWind] = useState()
  const [main, setMain] = useState()
  const [humidity, setHumidity] = useState()
  const [visibility, setVisibility] = useState()
  const [temp, setTemp] = useState()
  const [minTemp, setMinTemp] = useState()
  const [maxTemp, setMaxTemp] = useState()
  const [feels, setFeels] = useState()
  const [pressure, setPressure] = useState()

  function listCountries() {
      setCountriesLoading(true)
      api.listCountries().then((res) => {
        console.log("res", res?.data?.data)
        setCountries(res?.data?.data)
        setCountriesLoading(false)
      })
  }

  function listCities(country) {
      if (country) {
        var countryParam = country
      } else {
        var countryParam = selectedCountry
      }

      setCitiesLoading(true)
      api.listCities({"country": countryParam }).then((res) => {
        console.log("res", res?.data?.data)
        setCities(res?.data?.data)
        setCitiesLoading(false)
      })
  }

  function queryCity(city) {
      if (city) {
        var cityParam = city
      } else {
        var cityParam = selectedCity
      }

      api.queryCity({"city": cityParam}).then((res) => {
        console.log("res", res.data.data)
        var json = res.data.data
        setMain(json?.weather?.[0]?.description)
        setTemp(json?.main?.temp)
        setMinTemp(json?.main?.temp_min)
        setMaxTemp(json?.main?.temp_max)
        setFeels(json?.main?.feels_like)
        setHumidity(json?.main?.humidity)
        setVisibility(json?.visibility)
        setWind(json?.wind?.speed)
        setPressure(json?.main?.pressure)
    })
  }

  const handleCountryChange = (e,v) => {
    setSelectedCountry(v)
    if (!v) { return setSelectedCity('') }
    console.log(v)
    listCities(v)
  }

  const handleCityChange = (e,v) => {
    setSelectedCity(v)
    if (!v) { return }
    console.log(v)
    queryCity(v)
  }

  useEffect(() => {
      listCountries()
      listCities()
      if (selectedCity) {queryCity()}
  }, [])

  return (
    <div className="App">
      <ButtonAppBar/>
      <header className="App-header">
        <div style={{display:"flex", marginTop:"3%"}}>
          <Autocomplete
            id="weather-autocomplete-country"
            value={selectedCountry}
            onChange={handleCountryChange}
            onInputChange={props.test ? handleCountryChange : undefined}
            disabled={countriesLoading}
            options={countriesLoading ? ["loading..."] : countries }
            style={{ width: 100 }}
            renderInput={(params) => 
              <TextField {...params}
                label={countriesLoading ? "Loading..." : "Country"} 
                variant="outlined" />
            }
          />
          <Autocomplete
            id="weather-autocomplete-city"
            value={selectedCity}
            onChange={handleCityChange}
            onInputChange={props.test ? handleCityChange : undefined}
            disabled={citiesLoading || !selectedCountry}
            options={citiesLoading ? ["loading..."] : cities}
            ListboxComponent={ListboxComponent}
            style={{ width: 300 }}
            renderInput={(params) => 
              <TextField {...params}
                label={citiesLoading ? "Loading..." : "Pick a city"} 
                variant="outlined" />
            }
          />
        </div>
        {selectedCity && temp && main &&
          <>
            <div id="cards" style={{display:"flex", marginTop:"3%"}}>
              <div style={{marginLeft: "1%", marginRight: "1%",}}> 
                <SimpleCard
                text1={"humidity: " + humidity +"%"}
                text2={temp + "°F"}
                text3={"feels like: " + feels +"°F"}
                text4={"min: " + minTemp + "°F max: " + maxTemp +"°F"}
                />
              </div>
              <div style={{marginLeft: "1%", marginRight: "1%",}}> 
                <SimpleCard
                text1={"visibility: " + visibility +"m"}
                text2={main}
                text3={"wind: " + wind + "mph"}
                text4={"pressure: " + pressure+"hPa"}
                />
              </div>
            </div>
          </>
        }
      </header>
    </div>
  );
}

export default App;
