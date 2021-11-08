import { useEffect, useState } from "react";
import useScript from "./useScript";
import { formConfig } from "../components/MercadoPago/formConfig.js";
import axios from "axios"

export default function useMercadoPago(code) {
    const [resultPayment, setResultPayment] = useState(undefined);
    const [resultVerification, setResultVerification] = useState(undefined);
    const [sellerCode, setSellerCode] = useState(code);

    console.log("sellerCode: ", sellerCode)

    const { MercadoPago } = useScript(
        "https://sdk.mercadopago.com/js/v2",
        "MercadoPago"
    );

    useEffect(() => {
        console.log("MercadoPago: ", MercadoPago)
        if (MercadoPago) {
            const mp = new MercadoPago(import.meta.env.VITE_PUBLIC_KEY_MP);
            console.log("mp: ", mp)
            const cardForm = mp.cardForm({
                amount: "100.5",
                autoMount: true,
                form: formConfig,
                callbacks: {
                    onFormMounted: (error) => {
                        console.log("onFormMounted: ", error)
                        if (error)
                            return console.warn(
                                "Form Mounted handling error: ",
                                error
                            );
                    },

                    onSubmit: async (event) => {
                        event.preventDefault();

                        console.log("onSubmit: ", event)

                        const {
                            paymentMethodId: payment_method_id,
                            issuerId: issuer_id,
                            cardholderEmail: email,
                            amount,
                            token,
                            installments,
                            identificationNumber,
                            identificationType,
                        } = cardForm.getCardFormData();

                        await axios({
                            method: 'post',
                            url: `https://api.mercadopago.com/oauth/token`,
                            Headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Request-Method":
                                    "GET, POST, DELETE, PUT, OPTIONS",
                            },
                            data: JSON.stringify({
                                client_secret: import.meta.env.VITE_CLIENT_SECRET,
                                client_id: import.meta.env.VITE_CLIENT_ID,
                                redirect_uri: import.meta.env.VITE_REDIRECT_URI,
                                code: sellerCode,
                                grant_type: import.meta.env.VITE_GRANT_TYPE,
                            }),
                        })                        
                        .then((res) => { 
                            
                            console.log("res:", res)
                            fetch(
                                `${
                                    import.meta.env.VITE_URL_PAYMENT_MP
                                }/process-payment`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Access-Control-Allow-Origin": "*",
                                        "Access-Control-Request-Method":
                                            "GET, POST, DELETE, PUT, OPTIONS",
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        access_token: res.data.access_token,
                                        token,
                                        issuer_id,
                                        payment_method_id,
                                        transaction_amount: 1000,
                                        installments: Number(installments),
                                        description: "Descripción del producto",
                                        payer: {
                                            email,
                                            identification: {
                                                type: identificationType,
                                                number: identificationNumber,
                                            },
                                        },
                                    }),
                                }
                            )
                            .then((res) => console.log("res.json():", res.json()))
                            .then((data) => setResultPayment(data))
                            .catch((err) => {
                                setResultPayment(err);
                            });

                        })
                        .catch((err) => {
                            console.error(err);
                        });
                        
                    },
                    onFetching: (resource) => {
                        console.log("resource:", resource)
                        // Animate progress bar
                        const progressBar =
                            document.querySelector(".progress-bar");
                        progressBar.removeAttribute("value");

                        return () => {
                            progressBar.setAttribute("value", "0");
                        };
                    },
                },
            });
        }
    }, [MercadoPago]);

    return resultPayment;
}
