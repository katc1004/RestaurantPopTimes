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

export default class MapContainer extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
		    address: '',
		    radius: '',
		    busy: 0,
  		};
  		this.handleChange = this.handleChange.bind(this);
  		this.getResults = this.getResults.bind(this);
  	}

  	handleChange(event) {
  		this.setState({
  			[event.target.id]: event.target.value
  		});
  	}

  	getResults() {
        let parameters = "address=" + this.state.address + "&radius=" + this.state.radius + "&busy=" + this.state.busy;
        $.get(window.location.href + 'search?' + parameters, (data) => {
            console.log(data);
            console.log(parameters);
            {/*this.personaliseGreeting(data);*/}
        });
    }

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
						value={this.state.address}
						onChange={this.handleChange}
						margin="normal"
						style= {{width: 200}}
					/>
					<br></br>
					<TextField
						id="radius"
						label="In Meters. Max is 50000."
						type="number"
						inputProps={{ min: "0", max: "50000", step: "1" }}
						value={this.state.radius}
						onChange={this.handleChange}
						margin="normal"
						style= {{width: 200}}
					/>
					<br></br>
					
					<Typography gutterBottom variant="subheading">
						How busy?
					</Typography>
					<Radio
					checked={this.state.busy == 0}
					onChange={this.handleChange}
					value={0}
					id="busy"
					/>Not busy
					<Radio
					checked={this.state.busy == 1}
					onChange={this.handleChange}
					value={1}
					id="busy"
					/>Not too busy
					<Radio
					checked={this.state.busy == 2}
					onChange={this.handleChange}
					value={2}
					id="busy"
					/>Busy
					<Radio
					checked={this.state.busy == 3}
					onChange={this.handleChange}
					value={3}
					id="busy"
					/>As busy as it gets

					{/*}
					<TextField
						id="busy"
						label="How Busy?"
						select
						onChange={this.handleChange}
						value={this.state.busy}
						margin="normal"
						style= {{width: 200}}
						>
						<MenuItem value={0} primaryText="Not busy" />
						<MenuItem value={1} primaryText="Not too busy" />
						<MenuItem value={2} primaryText="Busy" />
						<MenuItem value={3} primaryText="As busy as it gets" />
					</TextField>*/}
					<br></br><br></br>
					<Button variant="outlined" size="large" onClick={this.getResults}>Submit</Button>
				</form>
			</div>
		)
	}
}