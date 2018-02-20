"use strict";
	$(document).ready(function(){
		const gander = 'http://www.gander.tech/address/';
		var data;
		var price;
		var dataPrice;

		
		function drawChart(block,url,symbol){ 
			//setInterval(function(){
				$.getJSON(url,function(data){ 
					var newdata = data.slice(-20);
				  	var chart = Highcharts.chart(block, {
					chart: {
						type: 'line',
						backgroundColor: null
					},
			    	tooltip: {
			    		textAlign: 'center',
					    formatter: function() {
					        return  calcDate(this.x) + ' <br class="price"> Price was ' + this.y + symbol;
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
				 		series: {
				 			animation: false
				 		}

				    },
				    series: [{
				    	data: newdata,
				        name: ' ',
				        type: 'spline',
				      	color: '#DC5100'
				    	}]
					});
			
				});
			//},350000);
		} 


			// defaulf: display USD chart
			//$("#containerBTC").css({"display":"none"});
			drawChart('containerUSD','/api/pricesUSD','$');

		    $('div.bottonUSD').click(function(){
		    	drawChart('containerUSD','/api/pricesUSD','$');
		        $(this).addClass("active"); 
		        $(".bottonBTC").removeClass("active");
		        $("#containerUSD").css({"display":"block"});
		        $("#containerBTC").css({"display":"none"});

		    });
		    $(".bottonBTC").click(function(){
		        $(this).addClass("active");
		        $(".bottonUSD").removeClass("active");
		        drawChart('containerBTC','/api/pricesBTC',' BTC');
		        $("#containerBTC").css({"display":"block"});
		        $("#containerUSD").css({"display":"none"});
		    });

		//setInterval(function(){ 
		$.getJSON('/api',function(data){ 
			
				price = Number(data[0].priceUSD).toFixed(2);
				$('.priceUSD').html('<span>EXP / USD</span><h3>$' + Number(data[0].priceUSD).toFixed(2) + '</h3>');
				$('.priceBTC').html('<span>EXP / BTC</span><h3>' + Number(data[0].priceBTC).toFixed(7) + '</h3>');
				$('.marketcap').html('<span>MarcketCap</span><h3>$' + new Intl.NumberFormat('us-US').format(parseInt(data[0].marketcap)) + '</h3>');
				$('.supply').html('<span>Total Supply</span><h3>' + new Intl.NumberFormat('us-US').format(parseInt(data[0].supply)) + '</h3>');
				$('.volume').html('<span>Volume</span><h3>$' + new Intl.NumberFormat('us-US').format(parseInt(data[0].volume)) + '</h3>');
			}
		)//},350000);



  	  	// Для Динамического графика

		  $.ajax({
				type: 'GET',
				data: JSON.stringify(data),
				url: "/api/table",
				success: function(data){
					for(var i = 0; i<data.length;i++){
						$('.table tbody.richlist').append('<tr class ="addressTable"><td><a href = ' + gander +  data[i].name + ' target="_blank">' + data[i].name +'</a></td><td>' + Intl.NumberFormat('us-US').format(Number(data[i].balance)) +
						 '</td><td>'+ Intl.NumberFormat('us-US').format(Number(data[i].balance) * price) + '$</td></tr>')
					}
				}
			})

		  $.ajax({
				type: 'GET',
				data: JSON.stringify(data),
				url: "/api/reddit",
				success: function(data){
					for(var i = 0; i<data.length;i++){
						$('.table.reddit').append("<tbody class ='reddit'><tr><td class = 'score'> Score: " 
							+ data[i].score + "</td><td colspan='4'class = 'redditTitle'>" 
							+ data[i].title + "</td></tr><tr><td colspan='5' rowspan='3'>" 
							+ data[i].text + "</td></tr><tr></tr><tr></tr><tr class = 'bottomborder'><td colspan = '2'>" 
							+ data[i].time + "</td><td colspan='3' class = 'redditAuthor' style='color:white'>"
							+ data[i].author +"</td></tr></tbody>")
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
});
