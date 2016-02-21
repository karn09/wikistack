var router = require('express').Router();
var User = require('../models').User;
var Page = require('../models').Page;
// var User = require('../models/user')
// var Page = require('../models/page')
module.exports = router;

router.get('/', function(req, res, next) {
  var pages = Page.find();
  pages.then(function(pages) {
    res.render('index', {
      pages: pages
    });
  })
});

router.post('/', function(req, res, next) {

  var user = User.findOrCreate({
    email: req.body.email,
    name: req.body.name
  });

  user.then(function(user_record) {
      new Page({
          title: req.body.title,
          content: req.body.content,
          tags: req.body.tags.split(' '),
          author: user_record._id
        })
        .save()
        .then(function(form) {
          res.redirect(form.route)
        })
    })
    .catch(function(error) {
      res.render('error', {
        message: error.message,
        error: error
      })
    });

  // Cleaned up version below
  // var page = new Page({
  //   title: req.body.title,
  //   content: req.body.content
  // });
  // User.findOrCreate(req.body).then(function(user) {
  //   page.author = user._id;
  //   return page.save();
  // }).then(function(savedPage) {
  //   res.redirect(savedPage.route);
  // }).catch(next);

});

router.get('/users/:id', function(req, res) {
  var user = User.findById(req.params.id);
  var pages = Page.find({
    author: req.params.id
  });

  user.then(function(user) {
    pages.then(function(pages) {
      console.log(pages)
      res.render('user', {
        name: user.name,
        email: user.email,
        pages: pages
      });
    })
  })
});

router.get('/users', function(req, res) {
  var users = User.find();
  users.then(function(users) {
    res.render('users', {
      users: users
    });
  })
});



router.get('/search', function(req, res) {
  var results = Page.findByTag(req.query.tags);
  results.then(function(result) {
      res.render('tags', {
        results: result
      })
    })
    .catch(function(nothing) {
      res.render('tags', {
        results: 'Start a search'
      })
    })

});

router.get('/add', function(req, res, next) {
  res.render('addPage')
});

router.get('/:urlTitle/similar', function(req, res) {
  var pageFound = Page.findOne({
    urlTitle: req.params.urlTitle
  });

  pageFound.then(function(page) {
    page.findSimilar(function(err, pages) {
        // res.json(pages)
        res.render('index', {
          pages: pages
        })
      })
      .catch(function(err) {
        res.render('error', {
          message: error.message,
          error: error
        });
      })
  })
});

router.get('/:urlTitle', function(req, res) {
  var pageFound = Page.findOne({
    urlTitle: req.params.urlTitle
  })
  pageFound
    .populate('author')
    .then(function(page) {
      res.render('wikipage', page)
    })
    .catch(function(err) {
      res.render('error', {
        message: err.message,
        error: err
      })
    })
});
