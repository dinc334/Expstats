"use strict";

const functions = require('./functions');

const express = require('express');
const request = require('request');
const snoowrap = require("snoowrap");
const geoip   = require('geoip-lite');
// for json parser
var data = require('./config.js');
const r = new snoowrap(data);

const router = express.Router();
const Sequelize = require('sequelize');

const MARKETCAP = 'https://api.coinmarketcap.com/v1/ticker/';
const IP = '192.168.2.1';
//-----------------------------------------
const Price = functions.define('price', {
  price: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.STRING
  }
});
const Admin = functions.define('admin', {
  ip: {
    type: Sequelize.STRING
  },
  country: {
  	type: Sequelize.STRING
  },
  city: {
  	type: Sequelize.STRING
  },
  date: {
  	type: Sequelize.STRING
  }
});
//-----------------------------------------
function calcDate(date){
	var data = new Date();
	data.setTime(date*1000);
	var options = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	};
	return data.toLocaleString("en-US", options);
}
//---------------------------------------

router.get('/', (req,res,next) => {
	console.log(req.cookies);
	var ip = req.ip;
	var geo = geoip.lookup(ip);

	res.render('index');
	if(ip != IP){
		Admin.create({
			ip: ip,
			country: geo.country,
			city: geo.city,
			date: Date.now()
		})
	}
})

router.get('/api', async (req,res,next) => {
	let data = [];
	let ip = req.ip;
	request(MARKETCAP + 'Expanse', (error, response, body)=>{
			try{
				var dataCoin = JSON.parse(body);
			} catch (e) {
				console.log("Api Coinmarket Problem" + e);
				return next(e,null);
			}
			for(var i = 0;i<dataCoin.length;i++){
				if(dataCoin[i]['name'] == ['Expanse']){
					var marketcapInfo = dataCoin[i];
					data.push({
						priceUSD  : marketcapInfo['price_usd'],
						priceBTC  : marketcapInfo['price_btc'],
						volume    : marketcapInfo['24h_volume_usd'],
						marketcap : marketcapInfo['market_cap_usd'],
						supply    : marketcapInfo['available_supply']
					});

					// запись в БД каждые 5 минут хотя бы 
					 // if(ip != IP){
						 Price.create({
						    price: Number(marketcapInfo['price_usd']).toFixed(2),
						    date: Date.now()
						 });
					 // }
				}
			}
			res.json(data);
	
		})
});

router.get("/api/reddit", async (req,res)=>{
	var data = [];
	r.getSubreddit('ExpanseOfficial').getHot().then(Listing =>{
		// get latest 10 top posts from subreddit, normally it will be Listing.length
		for(var i = 0; i<10;i++){
			data.push({
				"author": Listing[i].author.name,
				"title": Listing[i].title,
				"time":  calcDate(Listing[i].created),
				"score": Listing[i].score,
				"text": Listing[i].selftext
			});
			
		}
		res.json(data);
	})
})

router.get('/api/prices', async (req,res) => {
	// Достаем Данные с бд и отправляем на гет запрос
	var listPrice = [];
	await Price.findAll({
		attributes : ['price','date'],
		
	}).then(prices => {
		for(var i=0;i<prices.length;i++){
			listPrice.push([Number(prices[i].dataValues.date), Number(prices[i].dataValues.price)])
		}
		// console.log(prices[0].dataValues.price);
		// listPrice.push([prices.price,prices.date])
	});
	res.json(listPrice);
	
})

router.get('/api/table', (req,res) => {
		var data = [];
			request('http://52.168.6.76:8080/addresses?page=1', (err,response,body) => {
				try{
					var dataCoin = JSON.parse(body);
					var moreData = dataCoin.data;
				} catch (e) {
					console.log("Api Gander.tech Problem" + e);
					return next(e,null);
				}
				for(var y = 0; y< moreData.length; y++){
					data.push({
						name 	: moreData[y].name,
						balance : moreData[y].balance
					})
				}
				res.json(data);
			 })
})
// Костыль
router.get('/api/table2', (req,res) => {
		var data = [];
			request('http://52.168.6.76:8080/addresses?page=2', (err,response,body) => {
				try{
					var dataCoin = JSON.parse(body);
					var moreData = dataCoin.data;
				} catch (e) {
					console.log("Api Gander.tech Problem" + e);
					return next(e,null);
				}
				for(var y = 0; y< moreData.length; y++){
					data.push({
						name 	: moreData[y].name,
						balance : moreData[y].balance
					})
				}
				res.json(data);
			 })
})
router.get('/api/admin', async (req,res) => {
	var adminData = [];
	await Admin.findAll({
		attributes: ['ip','date']
	}).then(admins => {		
		for(var i = 0;i<admins.length; i++){
			adminData.push({ 
				ip :admins[i].dataValues.ip, 
				country: admins[i].dataValues.country,
				city: admins[i].dataValues.city,
				date: admins[i].dataValues.date 
			})
		}
	});
	res.json(adminData);
})
router.get('/admin', (req,res)=> {	
	 if(req.cookies.name == 'someSecretApp'){
		res.render('admin', {
			author: false,
			firstName: 'Ivan',
			lastName: 'Ivan'
		});
	 } else {
	 	res.send('NiceTry');
	 }
})
//----------------------
router.get('/test',async (req,res)=>{
	// var temp = new Date(1506336331045);
	// console.log('DATA ' + temp.getDate());
	// await Admin.count({
	// 	where: {
	// 		city: 'Singapore'
	// 	}
	// }).then(result => {
	// 	console.log(result);
	// })
	await Admin.findAll({
   attributes: [Sequelize.fn('COUNT', Sequelize.col('country'))], 
   group: ['Admin.country']
 }).then(function (result) {console.log(result)});
})


//----------------------
router.get('/login', (req,res)=> {
	var logPas = req.query;
	if(logPas.login == 'dinc' && logPas.pass == 'dinc'){
		res.cookie('name','someSecretApp');
		res.redirect('/admin');
		return
	} else {
		console.log('Bad login')
	}
	res.render('login');
})


module.exports = router;