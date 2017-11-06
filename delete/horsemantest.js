
var Horseman = require("node-horseman");
var horseman = new Horseman();

horseman
  .open('http://lite.yelp.com/search?find_desc=pizza&find_loc=94040&find_submit=Search')
  .text('address')
  .then(function(address){
  	console.log(address);
  	horseman.close();
  });
