import React from "react";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import MapContainer from "./MapContainer";
import SearchForm from "./SearchForm";

require('../css/App.css');
var $ = require('jquery');

// parent component of search form and map container
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            radius: undefined,
            busy: undefined,
            loading: false,
            invalidSearch: false,
            addresslat: -34.397,
            addresslng: 150.644,
            data: undefined
        };
        this.key = "AIzaSyCeIk2kOl-d3ENbo7AC855RxAjJug-hOwY";
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getResults = this.getResults.bind(this);
        this.handleLoading = this.handleLoading.bind(this);
        this.handleLocationUpdate = this.handleLocationUpdate.bind(this);
        this.renderLoadingText = this.renderLoadingText.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.renderInvalid = this.renderInvalid.bind(this);
    }
    
    onSubmit(event) {
        // first check if fields are entered correctly
        if (this.state.address.length == 0 || this.state.address == undefined || 
            this.state.radius.length == 0 || this.state.radius == undefined ||
            this.state.busy == undefined) {
            this.setState({
                invalidSearch: true,
                loading: false
            });
        }
        else {
            // flag loading
            this.handleLoading();
            // update address query's location
            this.handleLocationUpdate();
            // GET request for data
            this.getResults();
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    // flag loading to true
    handleLoading() {
        this.setState({
            loading: true
        });
    }

    // renders invalid text
    renderInvalid() {
        if(this.state.loading === false && this.state.invalidSearch === true) {
            return (
                <p>Invalid Search. Try Again.</p>
            );
        }
    }

    // renders the loading text
    renderLoadingText() {
        if(this.state.loading === true) {
            return (
                <Typography gutterBottom variant="title">
                Loading...
                </Typography>
            );
        }
    }

    // renders the loading wheel
    renderLoading() {
        if(this.state.loading === true) {
            return (
                <CircularProgress size={50} />
            );
        }
    }

    // finds the address query's geo location
    handleLocationUpdate() {
        $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.address.replace(" ", "+") + "&key=" + this.key, (data) => {
            this.setState({
                addresslat: data.results[0].geometry.location.lat,
                addresslng: data.results[0].geometry.location.lng
            });
        });
    }

    // GET request and evaluates data
    getResults() {
        let parameters = "address=" + this.state.address + "&radius=" + this.state.radius + "&busy=" + this.state.busy;
        console.log(parameters)

        $.get(window.location.href + 'search?' + parameters, (data) => {
            if (data == "GET request failed") {
               this.setState({
                    invalidSearch: true,
                    loading: false
                });
               return
            }
            var received = $.parseJSON(data)
            if ($.isEmptyObject(received)) {
                this.setState({
                    invalidSearch: true,
                    loading: false
                });
            }
            else {
                console.log(received);

                this.setState({
                    data: received,
                    loading: false,
                    invalidSearch: false
                });
            }
        });
        
    }

    render () {
        return (
            <div className="index">
                <SearchForm 
                address={this.state.address} 
                handleChange={this.handleChange} 
                radius={this.state.radius} 
                busy={this.state.busy}
                onSubmit={this.onSubmit}
                renderLoadingText={this.renderLoadingText()}
                renderLoading={this.renderLoading()}
                renderInvalidText={this.renderInvalid()}
                />
                <MapContainer 
                addresslat={this.state.addresslat}
                addresslng={this.state.addresslng}
                data={this.state.data}
                reload={this.state.loading}
                />
            </div>
        );
    }
}