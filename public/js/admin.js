"use strict";
$(document).ready(function(){
	var data;
	$.ajax({
            data: JSON.stringify(data),
            type: 'GET',
            url: '/api/admin',
            success: function(data){
                // respnse IP, Country, City, Date
                for (var i = 1; i<data.length; i++) {
                    $('.table tbody').append('<tr class ="addressTable"><td>' + i +'</td><td>'
                        + data[i].ip +' </td><td> ' 
                        + data[i].country + ' </td><td> ' + data[i].city + ' </td><td> ' + data[i].date+ '</td></tr>');
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