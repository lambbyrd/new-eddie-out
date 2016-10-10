//webscraper

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){
  
  var url = 'https://usage.smud.org/UARP/sitetag/Stream/4'
  
  request(url, function(err, response, html){
    
    if(!err){
      
      var $ = cheerio.load(html);
      
      var currFlow;
      var json = {currentFlow : ''};
      
      $('tr > td[align]')[3].filter(function(){
        var data = $(this);
        
        currFlow = data.text();
        
        json.currentFlow = currFlow;
        
      })
    }
    
  });
  
  
});

app.listen(process.env.PORT || 8080);