"use strict";
const Sequelize = require('sequelize');

const sequelize = new Sequelize('dinc', 'dyrk', 'dyrk', {
	host: 'localhost',
	pool: {
	    max: 5,
	    min: 0,
	    idle: 10000
	  },
	dialect: 'postgres',
	// disable logging in console
	logging: false

});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// const Admin = sequelize.define('admin', {
//   ip: {
//     type: Sequelize.STRING
//   },
//   date: {
//     type: Sequelize.STRING
//   }
// });
// Admin.sync({force : true}).then(() => {
// 	return Admin.create({
// 		ip: '123',
// 		country: 'Lol',
// 		city: 'Kek',
// 		date: Date.now()
// 	})
// })


// // force: true will drop the table if it already exists
// Price.sync({force: true}).then(() => {
//   // Table created
//   return Price.create({
//     price: 3.01,
//     date: Date.now()
//   });
// });

module.exports = sequelize;	

