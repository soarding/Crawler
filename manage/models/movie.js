var mongoose=require('mongoose');
var MovieSchema=require('../schemas/movie');
var Movie=mongoose.model('Movie',MovieSchema,'tb'); //连接collection

module.exports=Movie;
