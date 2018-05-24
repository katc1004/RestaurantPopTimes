import React from "react";
import MapContainer from "./MapContainer";
import SearchForm from "./SearchForm";

require('../css/App.css');
var $ = require('jquery');

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state {
            addresslat: undefined,
            addresslng: undefined,
            data: undefined
        };
    }
    
    handleLocationUpdate() {
        this.setState({
            addresslat: this.state,
            addresslng: lng
        });

        console.log(self.state.addresslat)
        console.log(self.state.addresslng)
    }

    handleDataUpdate() {
        this.setState({
            data:
        });
    }
    render () {
        return (
            <div className="index"><SearchForm /><MapContainer /></div>
        );
    }
}