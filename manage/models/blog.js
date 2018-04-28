var mongoose=require('mongoose');

var BlogSchema=require('../schemas/blog');
var Blog=mongoose.model('Blog',BlogSchema,'tb1');

module.exports=Blog;