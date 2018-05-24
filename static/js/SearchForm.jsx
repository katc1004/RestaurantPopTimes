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
import CircularProgress from '@material-ui/core/CircularProgress';
import MapContainer from "./MapContainer"; 

require('../css/SearchForm.css');
var $ = require('jquery');

export default class SearchForm extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
		    address: '',
		    radius: '',
		    busy: 0,
		    loading: false,
		    invalidSearch: false
  		};
  		this.key = "AIzaSyCeIk2kOl-d3ENbo7AC855RxAjJug-hOwY";
  		this.onSubmit = this.onSubmit.bind(this);
  		this.handleChange = this.handleChange.bind(this);
  		this.getResults = this.getResults.bind(this);
  		this.handleLoading = this.handleLoading.bind(this);
  		this.handleNotLoading = this.handleNotLoading.bind(this);
  		this.renderLoadingText = this.renderLoadingText.bind(this);
  		this.renderInvalidText = this.renderLoadingText.bind(this);
  		this.renderLoading = this.renderLoading.bind(this);
  		this.renderMap = this.renderMap.bind(this);
  	}

  	onSubmit(event) {
  		this.handleLoading();
  		this.getResults();
  	}

  	handleChange(event) {
  		this.setState({
  			[event.target.id]: event.target.value
  		});
  	}

  	handleLoading() {
  		this.setState({
  			loading: true
  		});
  	}

  	handleNotLoading() {
  		this.setState({
  			loading: false
  		});
  	}

  	renderLoadingText() {
	    if(this.state.loading === true) {
			return (
				<Typography gutterBottom variant="title">
				Loading...
				</Typography>
			);
		}
	}

	renderInvalidText() {
	    if(this.state.loading === false && this.state.invalidSearch === true) {
			return (
				<Typography gutterBottom variant="title">
				INVALID SEARCH PLEASE TRY AGAIN!
				</Typography>
			);
		}
	}

	renderLoading() {
	    if(this.state.loading === true) {
			return (
				<CircularProgress size={50} />
			);
		}
	}

	renderMap(data) {
		return (
			<MapContainer lat={this.state.lat} lng={this.state.lng} data={data}/>
		);
	}

  	getResults() {
  		$.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.address.replace(" ", "+") + "&key=" + this.key, (data) => {
  			this.setState({
  				addresslat: data.results[0].geometry.location.lat,
  				addresslng: data.results[0].geometry.location.lng
  			});
  		});
        let parameters = "address=" + this.state.address + "&radius=" + this.state.radius + "&busy=" + this.state.busy;
        $.get(window.location.href + 'search?' + parameters, (data) => {
        	var received = $.parseJSON(data);
            console.log(received);
            console.log(parameters);
            this.renderMap(received)
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
					<br></br><br></br>
					<Button variant="outlined" size="large" onClick={this.onSubmit}>Submit</Button>
					<br></br><br></br>
					{this.renderLoadingText()}
					<br></br>
					{this.renderLoading()}
				</form>
			</div>
		)
	}
}