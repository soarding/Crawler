var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require("./models/movie");
var Blog = require("./models/blog");
var port = process.PORT || 3000;
var app = express();

mongoose.connect("mongodb://localhost/ding");

app.set('views', './views/pages');
app.set('view engine', 'jade');

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'bower_components')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.locals.moment = require('moment');

app.listen(port);

console.log('demo1 started on port ' + port);

//index page
app.get('/', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('index', {
      title: ' 首页 ',
      movies: movies
    });
  });
});

//detail page
app.get('/movie/:id', function(req, res) {
  var id = req.params.id;
  Movie.findById(id, function(err, movie) {
    res.render('detail', {
      title: '作者详情页',
      id: id,
      movie: movie
    });
  })
});

app.get('/blog/:id', function(req, res) {
  var id = req.params.id;
  Blog.findById(id, function(err, blog) {
    res.render('detail1', {
      title: '博文详情页',
      id: id,
      blog: blog
    });
  })
});

//admin page
app.get('/admin/movie', function(req, res) {
  res.render('admin', {
    title: '作者信息 后台录入页',
    movie: {
      _id: '',
      name: '',
      age:'',
      fans: '',
      focus: ''
    }
  });
});


app.get('/admin/blog', function(req, res) {
  res.render('admin1', {
    title: '文章信息 后台录入页',
    blog: {
      _id: '',
      title: '',
      currentBlogApp:'',
      requestId: '',
      author: ''
    }
  });
});

//admin update movie
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id;
  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: '作者信息 后台更新页',
        movie: movie
      });
    });
  }
});

app.get('/admin/update1/:id', function(req, res) {
  var id = req.params.id;
  if (id) {
    Blog.findById(id, function(err, blog) {
      res.render('admin1', {
        title: '文章信息 后台更新页',
        blog: blog
      });
    });
  }
});

//admin delete movie
app.delete('/admin/list',function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
               console.log(err);
            }else{
                res.json({success:1});
            }
        });
    }

})

app.delete('/admin/list1',function(req,res){
  var id = req.query.id;
  if(id){
    Blog.remove({_id:id},function(err,blog){
      if(err){
        console.log(err);
      }else{
        res.json({success:1});
      }
    });
  }

})

//select
app.post('/movie/name',function(req, res){
  var name=req.body.movie.name;
  var regex = new RegExp(name , 'i');
  Movie.find({name:regex},function(err, movies) {
    if (err) {
      console.log(err);
    }
    console.log(movies);
    res.render('list', {
      title: '作者 列表页',
      movies: movies
    });
  });
});

app.post('/blog/title',function(req, res){
  var title1=req.body.blog.title;
  console.log(title1);
  var regex = new RegExp(title1 , 'i');
  Blog.find({title:regex},function(err, blogs) {
    if (err) {
      console.log(err);
    }
    console.log(blogs);
    res.render('list1', {
      title: '博文 列表页',
      blogs: blogs
    });
  });
});

app.post('/blog/author',function(req, res){
  var title1=req.body.blog.author;
  console.log(title1);
  var regex = new RegExp(title1 , 'i');
  Blog.find({author:regex},function(err, blogs) {
    if (err) {
      console.log(err);
    }
    console.log(blogs);
    res.render('list1', {
      title: '作者博文 列表页',
      blogs: blogs
    });
  });
});
//admin post movie
app.post('/admin/movie/new', function(req, res) {
  console.log(req.body);
  console.log(req.body.movie);
  var id = req.headers['referer'].split('/')[5];
  var movieObj = req.body.movie;
  var _movie;
  if (id !== undefined) {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' + movie._id);
      });
    });
  } else {
    _movie = new Movie({
      name: movieObj.name,
      age: movieObj.age,
      fans: movieObj.fans,
      focus: movieObj.focus
    });
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err);
      }
      res.redirect('/movie/' + movie._id);
    });
  }
});


app.post('/admin/blog/new', function(req, res) {
  console.log(req.body);
  console.log(req.body.blog);
  var id = req.headers['referer'].split('/')[5];
  var movieObj = req.body.blog;
  var _movie;
  if (id !== undefined) {
    Blog.findById(id, function(err, blog) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(blog, movieObj);
      _movie.save(function(err, blog) {
        if (err) {
          console.log(err);
        }
        res.redirect('/blog/' + blog._id);
      });
    });
  } else {
    _movie = new Blog({
      title: movieObj.title,
      currentBlogApp: movieObj.currentBlogApp,
      requestId: movieObj.requestId,
      author: movieObj.author
    });
    _movie.save(function(err, blog) {
      if (err) {
        console.log(err);
      }
      res.redirect('/blog/' + blog._id);
    });
  }
});


//list page
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: '作者 列表页',
      movies: movies
    });
  });
});

app.get('/admin/list1', function(req, res) {
  Blog.fetch(function(err, blogs) {
    if (err) {
      console.log(err);
    }
    res.render('list1', {
      title: '博文 列表页',
      blogs: blogs
    });
  });
});


