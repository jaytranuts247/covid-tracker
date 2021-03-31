import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./InfoBox.css";

const InfoBox = ({ title, cases, total, active, isRed, isGrey, ...props }) => {
	return (
		<Card
			onClick={props.onClick}
			className={`infoBox ${active && "infoBox--selected"} ${
				isRed && "infoBox--red"
			} ${isGrey && "infoBox--grey"}`}
		>
			<CardContent>
				<Typography className="infoBox__title" color="textSecondary">
					{title}
				</Typography>

				<h2
					className={`infoBox__cases ${!isRed && "infoBox__cases--green"} ${
						isGrey && "infoBox__cases--grey"
					}`}
				>
					<span id="case-number">{cases}</span>
				</h2>
				<Typography className="infoBox__total">Total: {total}</Typography>
			</CardContent>
		</Card>
	);
};

export default InfoBox;
