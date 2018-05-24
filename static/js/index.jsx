import React from "react";
import ReactDOM from "react-dom";
import MapContainer from "./MapContainer";
import SearchForm from "./SearchForm";

require('../css/index.css');

ReactDOM.render(<div className="index"><SearchForm /><MapContainer /></div>, document.getElementById("content"));