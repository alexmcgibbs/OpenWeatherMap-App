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


function App() {
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [citiesLoading, setCitiesLoading] = useState(true)

  const [countries, setCountries] = useState()
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [cities, setCities] = useState()
  const [selectedCity, setSelectedCity] = useState()

  const [wind, setWind] = useState()
  const [main, setMain] = useState()
  const [humidity, setHumidity] = useState()
  const [visibility, setVisibility] = useState()
  const [temp, setTemp] = useState()
  const [minTemp, setMinTemp] = useState()
  const [maxTemp, setMaxTemp] = useState()
  const [feels, setFeels] = useState()
  const [pressure, setPressure] = useState()


  useEffect(() => {

    setCountriesLoading(true)
    api.listCountries().then((res) => {
      console.log("res", res.data.data)
      setCountries(res.data.data)
      setCountriesLoading(false)
    })

    setCitiesLoading(true)
    api.listCities({"country":selectedCountry}).then((res) => {
      console.log("res", res.data.data)
      setCities(res.data.data)
      setCitiesLoading(false)
    })
  }, [])

  return (
    <div className="App">
      <ButtonAppBar/>
      <header className="App-header">
        <div style={{display:"flex", marginTop:"3%"}}>

          <Autocomplete
            id="weather-autocomplete-country"
            defaultValue="US"
            onChange={(e,v) => {
              setSelectedCountry(v)
              if (!v) { return}
              setCountriesLoading(true)
              console.log(v)
              api.listCities({"country": v}).then((res) => {
                console.log("res", res.data.data)
                setCities(res.data.data)
                setCountriesLoading(false)
              })
            }}
            disabled={countriesLoading}
            options={countriesLoading ? [{ name: "loading..."}] : countries }
            style={{ width: 100 }}
            renderInput={(params) => 
              <TextField {...params}
                label={countriesLoading ? "Loading..." : "Country"} 
                variant="outlined" />
            }
          />
          <Autocomplete
            id="weather-autocomplete-city"
            onChange={(e,v) => {
              setSelectedCity(v)
              if (!v) { return }
              setCitiesLoading(true)
              console.log(v)
              api.queryCity({"city": v}).then((res) => {
                console.log("res", res.data.data)
                var json = res.data.data
                setSelectedCity(v)
                setMain(json?.weather?.[0]?.description)
                setTemp(json?.main?.temp)
                setMinTemp(json?.main?.temp_min)
                setMaxTemp(json?.main?.temp_max)
                setFeels(json?.main?.feels_like)
                setHumidity(json?.main?.humidity)
                setVisibility(json?.visibility)
                setWind(json?.wind?.speed)
                setPressure(json?.main?.pressure)
                setCitiesLoading(false)
              })
            }}
            disabled={citiesLoading || !selectedCountry}
            options={citiesLoading ? [{ name: "loading..."}] : cities}
            ListboxComponent={ListboxComponent}
            style={{ width: 300 }}
            renderInput={(params) => 
              <TextField {...params}
                label={citiesLoading ? "Loading..." : "Pick a city"} 
                variant="outlined" />
            }
          />
          </div>
          {selectedCity &&
            <>
              <div style={{display:"flex", marginTop:"3%"}}>
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
