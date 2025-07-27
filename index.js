const express = require("express");
const cors = require("cors");
const midtransClient = require("midtrans-client");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
});

app.post("/createTransaction", async (req, res) => {
  try {
    const { orderId, amount, courseName } = req.body;
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [{
        price: amount,
        quantity: 1,
        name: courseName,
      }],
    };
    const transaction = await snap.createTransaction(parameter);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});