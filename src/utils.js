import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const baseURL = "https://disease.sh/v3/covid-19";

const casesTypeColors = {
	cases: {
		hex: "#CC1034",
		multiplier: 300,
	},
	recovered: {
		hex: "#7DD71D",
		multiplier: 700,
	},
	deaths: {
		hex: "#fd4443",
		multiplier: 1500,
	},
};

export const sortData = (data) => {
	const sortedData = [...data];
	return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const prettyPrintStat = (stat) =>
	stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const normalPrintStat = (stat) =>
	stat ? `+${numeral(stat).format("0,0")}` : "+0";

// Draw circles on the map with interactive tooltips
export const showDataOnMap = (data, casesType = "cases") => {
	return data.map((country) => {
		console.log("casesType", casesType, casesTypeColors[casesType].hex);

		return (
			<Circle
				center={[country.countryInfo.lat, country.countryInfo.long]}
				fillOpacity={0.4}
				// color={casesTypeColors[casesType].hex}
				// fillColor={casesTypeColors[casesType].hex}

				pathOptions={{
					color: casesTypeColors[casesType].hex,
					fillColor: casesTypeColors[casesType].hex,
				}}
				radius={
					Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
				}
			>
				<Popup>
					<div className="info-container">
						<div
							className="info-flag"
							style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
						></div>
						<div className="info-name">{country.country}</div>
						<div className="info-confirmed">
							Cases:{" "}
							<span id="confirmed-cases">
								{numeral(country.cases).format("0,0")}
							</span>
						</div>
						<div className="info-recovered">
							Recovered:{" "}
							<span id="confirmed-recovered">
								{numeral(country.recovered).format("0,0")}
							</span>
						</div>
						<div className="info-deaths">
							Deaths:{" "}
							<span id="confirmed-deaths">
								{numeral(country.deaths).format("0,0")}
							</span>
						</div>
					</div>
				</Popup>
			</Circle>
		);
	});
};
