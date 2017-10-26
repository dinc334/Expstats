"use strict";
const request = require('request');

const MARKETCAP = 'https://api.coinmarketcap.com/v1/ticker/';
var data = [];

function getCoinMarcData(){
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
					  data = data.push({
						priceUSD  : marketcapInfo['price_usd'],
						priceBTC  : marketcapInfo['price_btc'],
						volume    : marketcapInfo['24h_volume_usd'],
						marketcap : marketcapInfo['market_cap_usd'],
						supply    : marketcapInfo['available_supply']
					});
				}
			}
			
	});
    console.log(data)
}
setTimeout(getCoinMarcData,1000);


