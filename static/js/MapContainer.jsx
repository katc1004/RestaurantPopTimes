import React from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';

require('../css/MapContainer.css');
var $ = require('jquery');

export class MapContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		    showingInfoWindow: false,
		    activeMarker: {},
		    selectedPlace: {},
		}

		this.onMarkerClick = this.onMarkerClick.bind(this);
		this.onMapClicked = this.onMapClicked.bind(this);
	}

	onMarkerClick(props, marker, e) {
	    this.setState({
	    	selectedPlace: props,
	    	activeMarker: marker,
	      	showingInfoWindow: true
	    });
	}

	onMapClicked(props) {
	    if (this.state.showingInfoWindow) {
	      this.setState({
	        showingInfoWindow: false,
	        activeMarker: null
	      });
	    }
	}
	render() {
		if (!this.props.loaded) {
			return <div>Loading...</div>
		}
		return (
		<div className="map-style">
			<Map className="map-style" google={this.props.google} zoom={14} onClick={this.onMapClicked}>
			  <Marker
			    title={'The marker`s title will appear as a tooltip.'}
			    name={'SOMA'}
			    address={'Address'}
			    waittime={'Status: Not so busy'}
			    position={{lat: 37.778519, lng: -122.405640}} 
			    onClick={this.onMarkerClick}/>
			  <Marker
			    name={'Dolores park'}
			    address={'Address'}
			    waittime={'Status: Not so busy'}
			    position={{lat: 37.759703, lng: -122.428093}} 
			    onClick={this.onMarkerClick}/>
				<InfoWindow
		          marker={this.state.activeMarker}
		          visible={this.state.showingInfoWindow}>
		            <div>
		            	<center>
							<span className="map-info">{this.state.selectedPlace.name}</span>
							{this.state.selectedPlace.address} <br />
							{this.state.selectedPlace.waittime}
		            	</center>
		            </div>
		        </InfoWindow>
			</Map>
		</div>
		)
	}
}

export default GoogleApiWrapper({
	apiKey: "AIzaSyCeIk2kOl-d3ENbo7AC855RxAjJug-hOwY"
})(MapContainer)