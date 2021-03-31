import numeral from "numeral";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "./LineGraph.css";

import { baseURL } from "../../utils";

const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: "index",
		intersect: false,
		callbacks: {
			label: function (tooltipItem, data) {
				return numeral(tooltipItem.value).format("+0,0");
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: "time",
				time: {
					parser: "MM/DD/YY",
					tooltipFormat: "ll",
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					// includes a dollar sign in the ticks
					callback: function (value, index, values) {
						return numeral(value).format("0a");
					},
				},
			},
		],
	},
};

const buildChartData = (data, casesType = "cases") => {
	const chartData = [];
	let lastDataPoint;
	for (let date in data.cases) {
		if (lastDataPoint) {
			const newDataPoint = {
				x: date,
				y: data[casesType][date] - lastDataPoint,
			};
			chartData.push(newDataPoint);
		}
		lastDataPoint = data[casesType][date];
	}
	return chartData;
};

const LineGraph = ({ casesType, ...props }) => {
	const [data, setData] = useState({});

	useEffect(() => {
		const getChartData = async () => {
			try {
				const res = await fetch(`${baseURL}/historical/all?lastdays=120`);
				const data = await res.json();
				let chartData = buildChartData(data, casesType);
				setData(chartData);
			} catch (err) {
				console.log(err);
			}
		};
		console.log("getChartData");
		getChartData();
	}, [casesType]);

	return (
		<div className={props.className}>
			{data?.length > 0 && (
				<Line
					data={{
						datasets: [
							{
								backgroundColor: "rgba(204, 16, 52, 0.5)",
								borderColor: "#CC1034",
								data: data,
							},
						],
					}}
					options={options}
				/>
			)}
		</div>
	);
};

export default LineGraph;
