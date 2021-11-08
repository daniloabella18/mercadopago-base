const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/process-payment", (req, res) => {
    
    console.log("req.body: ", req.body)
    mercadopago.configurations.setAccessToken(req.body.acces_token);
    const payment_data = {
        transaction_amount: req.body.transaction_amount,
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.paymentMethodId,
        issuer_id: req.body.issuer,
        payer: {
            email: req.body.payer.email,
            identification: {
                type: req.body.payer.docType,
                number: req.body.payer.docNumber,
            },
        },
    };

    mercadopago.payment
        .save(payment_data)
        .then((response) => {
            return res.status(response.status).json({
                status: response.body.status,
                status_detail: response.body.status_detail,
                id: response.body.id,
            });
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});

app.listen(port, () => {
    console.log(`App running in http://localhost:${port}`);
});
