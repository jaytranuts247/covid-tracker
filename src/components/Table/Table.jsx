import React from "react";
import numeral from "numeral";

import "./Table.css";

const Table = ({ countries }) => {
	return (
		<div className="table">
			<table>
				{countries.map(({ country, cases }) => (
					<tr key={country}>
						<td>{country}</td>
						<td>
							<strong>{numeral(cases).format("0,0")}</strong>
						</td>
					</tr>
				))}
			</table>
		</div>
	);
};

export default Table;
