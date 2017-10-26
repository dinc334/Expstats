"use strict";
$(document).ready(function(){
	var data;
	$.ajax({
            data: JSON.stringify(data),
            type: 'GET',
            url: '/api/admin',
            success: function(data){
                for (var i = 0; i<data.length; i++) {
                    $('.adminData').append('<li>' + data[i].ip+ ' : ' + data[i].date + '</li>');
                }         
            }
 	})
 });