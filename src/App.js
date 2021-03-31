import React, { useEffect, useState } from "react";

import {
	Card,
	CardContent,
	FormControl,
	MenuItem,
	Select,
} from "@material-ui/core";

import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";

import { sortData, baseURL, prettyPrintStat, normalPrintStat } from "./utils";
import LineGraph from "./components/LineGraph/LineGraph";

import "./App.css";
import "leaflet/dist/leaflet.css";

const App = () => {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [casesType, setCasesType] = useState("cases");
	const [mapCenter, setMapCenter] = useState({ lat: 43.0, lng: -75.0 });
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);

	useEffect(() => {
		const getWorldWideInfo = async () => {
			try {
				const res = await fetch(`${baseURL}/all`);
				const data = await res.json();
				setCountryInfo(data);
			} catch (err) {
				console.log(err);
			}
		};
		getWorldWideInfo();
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			try {
				const res = await fetch(`${baseURL}/countries`);
				const data = await res.json();
				const countries = data.map((country) => ({
					name: country.country,
					value: country.countryInfo.iso2,
				}));
				setTableData(sortData(data));
				setMapCountries(data);
				setCountries(countries);
			} catch (err) {
				console.log(err);
			}
		};
		getCountriesData();
	}, []);

	const handleChange = async (e) => {
		const countryCode = e.target.value;

		const url =
			countryCode === "worldwide"
				? `${baseURL}/all`
				: `${baseURL}/countries/${countryCode}`;

		try {
			const res = await fetch(url);
			const data = await res.json();
			setCountry(countryCode);
			setCountryInfo(data);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1 id="header-title">Covid-19 Tracker</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							value={country}
							defaultValue={country || "worldwide"}
							onChange={handleChange}
						>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country, idx) => (
								<MenuItem key={idx} value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					<InfoBox
						isRed
						active={casesType === "cases"}
						onClick={(e) => setCasesType("cases")}
						title="Coronavirus Cases"
						cases={normalPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
					/>
					<InfoBox
						active={casesType === "recovered"}
						onClick={(e) => setCasesType("recovered")}
						title="Recovered"
						cases={normalPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
					/>
					<InfoBox
						isGrey
						active={casesType === "deaths"}
						onClick={(e) => setCasesType("deaths")}
						title="Deaths"
						cases={normalPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths)}
					/>
				</div>
				<Map
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
					casesType={casesType}
				/>
			</div>
			<Card className="app__right">
				<CardContent>
					<h3>Live cases by Country</h3>
					<Table countries={tableData} />
					<h3 id="new-cases">Worldwide new {casesType}</h3>
					<LineGraph className="app__graph" casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
};

export default App;
