import React from "react";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';

require('../css/SearchForm.css');
var $ = require('jquery');

// Search form: consists of address field, radius field, busy percentage field and submit button
export default class SearchForm extends React.Component {
	render() {
		return (
			<div className="search-form-container">
				<Typography gutterBottom variant="headline">
					Nearby Restaurants by Popularity
				</Typography>
				<form noValidate autoComplete="off">
					<TextField
						id="address"
						label="Enter address query here"
						value={this.props.address}
						onChange={this.props.handleChange}
						margin="normal"
						style= {{width: 200}}
					/>
					<br></br>
					<TextField
						id="radius"
						label="In Meters. Max is 50000."
						type="number"
						inputProps={{ min: 0, max: 50000, step: 1 }}
						value={this.props.radius}
						onChange={this.props.handleChange}
						margin="normal"
						style= {{width: 200}}
					/>
					<br></br>
					
					<Typography gutterBottom variant="subheading">
						How busy?
					</Typography>
					<Radio
					checked={this.props.busy == 0}
					onChange={this.props.handleChange}
					value={0}
					id="busy"
					/>Not busy
					<Radio
					checked={this.props.busy == 1}
					onChange={this.props.handleChange}
					value={1}
					id="busy"
					/>Not too busy
					<Radio
					checked={this.props.busy == 2}
					onChange={this.props.handleChange}
					value={2}
					id="busy"
					/>Busy
					<Radio
					checked={this.props.busy == 3}
					onChange={this.props.handleChange}
					value={3}
					id="busy"
					/>As busy as it gets
					<br></br><br></br>
					<Button variant="outlined" size="large" onClick={this.props.onSubmit}>Submit</Button>
					<br></br><br></br>
					{this.props.renderLoadingText}
					<br></br>
					{this.props.renderLoading}
					<br></br>
					{this.props.renderInvalidText}
				</form>
			</div>
		)
	}
}