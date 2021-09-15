import React, { useEffect, useState } from 'react';
import { MenuItem,FormControl, Select, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import InfoAccodion from './InfoAccodion';
import Table from './Table';
import Map from './Map';
import LineGraph from './LineGraph';
import './App.css';
import numeral from "numeral";
import { sortData,prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
 

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data)=>{
      setCountryInfo(data);
    })
  },[])

  useEffect(() => {
    //the code **ONLY** runs once when app/component loads, if a variable is put in [] it runs once when app loads and once that variable changes
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data)=> {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
        
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      })
    };
    getCountriesData();
  }, [countries]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = 
      countryCode === "worldwide" 
      ? 'https://disease.sh/v3/covid-19/all' : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  return (
    <div className="app">
      <div className="app-left">

            <div className = "app_header">
              {/*Title + selector*/}
              <h1>COVID-19 TRACKER</h1>
              <FormControl className="app_dropdown">
                <Select varient = "outlined" onChange={onCountryChange} value = {country}>
                      <MenuItem value="worldwide">Worldwide</MenuItem>
                      {
                        countries.map(country => (
                          <MenuItem value = {country.value}>{country.name}</MenuItem>
                        ))
                      }
                </Select>
              </FormControl>
            </div>

            <div className="app_stats">
                <InfoBox
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus Cases"
                isRed
                active={casesType === "cases"}
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                active={casesType === "recovered"}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
              />
              <InfoBox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                isRed
                active={casesType === "deaths"}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
            </div>

            <div className="app_stats2">
              <InfoAccodion title="Active" sub_title="Currently active cases" total={countryInfo.active}
                            left_heading="in Mild Condition" 
                            right_heading="Serious or Critical" right_total={countryInfo.critical}></InfoAccodion>
              <InfoAccodion title="Closed" sub_title="Cases with an outcome" total={countryInfo.recovered}
                            left_heading="Recovered/Discharged"
                            right_heading="Deaths" right_total={countryInfo.deaths}
                            ></InfoAccodion>
            </div>

            

            {/*Map*/}
            <Map 
              casesType = {casesType}
              countries={mapCountries}
              center={mapCenter}
              zoom = {mapZoom}
            />
        

      </div>

      <Card className="app_right">
        <CardContent>

          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>

    </div>
      
  );
}

export default App;
