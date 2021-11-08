import React from "react";
import "react-credit-cards/es/styles-compiled.css";

export default function MarketPlace() {

    const redirect = () => {

        const client_id = import.meta.env.VITE_CLIENT_ID_MP
        const vincular = `https://auth.mercadopago.cl/authorization?client_id=${client_id}&response_type=code&platform_id=mp&state=13a2&redirect_uri=http://localhost:3000`
        location.replace(vincular)

    }

    return (
        <div className="container">
            <button onClick={()=>redirect()} > Vincular </button>
        </div>
    );
}
