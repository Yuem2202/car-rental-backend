const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const carsFile = path.join(__dirname, '../data/cars.json');
const ordersFile = path.join(__dirname, '../data/orders.json');

const carsAdapter = new JSONFile(carsFile);
const ordersAdapter = new JSONFile(ordersFile);

// ✅ Tell LowDB what shape to expect by setting defaultData
const carsDB = new Low(carsAdapter, { cars: [] });
const ordersDB = new Low(ordersAdapter, { orders: [] });

async function initDBs() {
  await carsDB.read();
  await ordersDB.read();

  // Just ensure fallback
  carsDB.data ||= { cars: [] };
  ordersDB.data ||= { orders: [] };

  await carsDB.write();
  await ordersDB.write();
}

module.exports = {
  carsDB,
  ordersDB,
  initDBs
};
