import React from "react";
import { Map, Marker, GoogleApiWrapper, InfoWindow, GoogleMapReact } from 'google-maps-react';

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
		this.renderMarkers = this.renderMarkers.bind(this);
	}

	// shows info window when marker is clicked
	onMarkerClick(props, marker, e) {
	    this.setState({
	    	selectedPlace: props,
	    	activeMarker: marker,
	      	showingInfoWindow: true
	    });
	}

	// closes info window when click on map
	onMapClicked(props) {
	    if (this.state.showingInfoWindow) {
	      this.setState({
	        showingInfoWindow: false,
	        activeMarker: null
	      });
	    }
	}

	// renders all markers based on GET request data including the address query's marker
	renderMarkers() {
		if (this.props.data == undefined) {
			return (
				<Marker title={'center'} name={'You are here!'}
				position={{lat: this.props.addresslat, lng: this.props.addresslng }}
				onClick={this.onMarkerClick}/>	
	        );
		}
		else {
			var rows = [];
			rows.push(<Marker title={'center'} name={'You are here!'}
				position={{lat: this.props.addresslat, lng: this.props.addresslng }}
				onClick={this.onMarkerClick}/>)
			Object.entries(this.props.data).map(([index, item]) => {
			    rows.push(<Marker
							name={item.name}
							address={item.address}
							busypercentage={'Status: ' + item.busy + ' (' + item.busypercentage + '% Busy)'}
							position={{lat: item.lat, lng: item.lng}} 
							onClick={this.onMarkerClick} />);
			})
			return rows
		}
	}

	render() {
		// rerender the map when not loading
		if (!this.props.loaded || this.props.reload) {
			return <div>Loading...</div>
		}
		
		return (
			<div className="map-style">
				<Map 
				className="map-style" 
				google={this.props.google} 
				initialCenter={{
				lat: this.props.addresslat,
				lng: this.props.addresslng
				}}
				zoom={15} 
				onClick={this.onMapClicked}>
					{this.renderMarkers()}
					<InfoWindow
					marker={this.state.activeMarker}
					visible={this.state.showingInfoWindow}>
					<div>
						<center>
							<span className="map-info">{this.state.selectedPlace.name}</span>
							{this.state.selectedPlace.address} <br />
							{this.state.selectedPlace.busypercentage}
						</center>
					</div>
					</InfoWindow>
				</Map>
			</div>
		);
	}
		
}

export default GoogleApiWrapper({
	apiKey: "AIzaSyCeIk2kOl-d3ENbo7AC855RxAjJug-hOwY"
})(MapContainer)