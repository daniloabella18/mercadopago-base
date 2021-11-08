import React from "react";
import ReactDOM from "react-dom";
import MercadoPagoForm from "./components/MercadoPago/MercadoPagoForm";
import MarketPlace from "./components/MarketPlace/MarketPlace";

import './main.css'

ReactDOM.render(
    <React.StrictMode>
        <MercadoPagoForm />
        <MarketPlace/>
    </React.StrictMode>,
    document.getElementById("root")
);
