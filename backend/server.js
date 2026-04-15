require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount." });
        }

        const unitAmount = Math.round(amount * 1000);
        const orderId = `order_${Date.now()}`;

        const response = await axios.post(
            `${process.env.THAWANI_API_URL}/checkout/session`,
            {
                client_reference_id: orderId,
                mode: "payment",
                products:[{
                    name: "Payment to Tarek Yassine (طارق ياسين)",
                    quantity: 1,
                    unit_amount: unitAmount,
                }],
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'thawani-api-key': process.env.THAWANI_SECRET_KEY
                }
            }
        );

        if (response.data.success) {
            const sessionId = response.data.data.session_id;
            const redirectUrl = `https://checkout.thawani.om/pay/${sessionId}?key=${process.env.THAWANI_PUBLIC_KEY}`;
            res.json({ redirectUrl, sessionId });
        } else {
            res.status(400).json({ error: "Failed to create Thawani session" });
        }
    } catch (error) {
        console.error("Thawani API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal Server Error while creating session." });
    }
});

app.post('/webhook', (req, res) => {
    const event = req.body;
    console.log("Webhook received:", event.type, event.data);
    res.status(200).send("Webhook received");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));