const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { carsDB, ordersDB, initDBs } = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initDBs().then(() => {
  console.log("Databases initialized.");
});

app.get('/cars', async (req, res) => {
  await carsDB.read();
  res.json(carsDB.data.cars);
});

app.post('/order', async (req, res) => {
  const { vin, name, phone, email, license, startDate, rentalDays } = req.body;

  if (!vin || !name || !phone || !email || !license || !startDate || !rentalDays) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  await carsDB.read();
  await ordersDB.read();

  const car = carsDB.data.cars.find(c => c.vin === vin);

  if (!car || !car.available) {
    return res.status(400).json({ success: false, message: 'Car not available' });
  }

  car.available = false;
  await carsDB.write();

  const newOrder = {
    id: nanoid(),
    vin,
    name,
    phone,
    email,
    license,
    startDate,
    rentalDays
  };
  ordersDB.data.orders.push(newOrder);
  await ordersDB.write();

  res.json({ success: true, message: 'Order placed successfully' });
});

app.listen(PORT, () => {
  console.log(`🚗 Car Rental backend running at http://localhost:${PORT}`);
});
