var mongoose = require('mongoose');
var marked = require('marked');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!

mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {enum: ['open', 'closed'], type: String},
  date:     {type: Date, default: Date.now},
  tags:     [{type: String}],
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true}
});

pageSchema.pre('validate', function(next) {
  this.urlTitle = generateUrlTitle(this.title);
  next();
});

pageSchema.virtual('route').get(function () {
  return '/wiki/' + this.urlTitle;
});
pageSchema.virtual('renderedContent').get(function() {
  return marked(this.content);
})

pageSchema.statics.findByTag = function(tag){
    return this.find({ tags: {$elemMatch: { $eq: tag } } }).exec();
};

pageSchema.methods.findSimilar = function(cb) {
  console.log('Searching for similar tags...');
  // this.tags
  return this.model('Page').find(
    {
      tags: {$in: this.tags },
      urlTitle: {$ne: this.urlTitle}
    }, cb); // cb passed as arg for async, otherwise will return a promise
};

userSchema.statics.findOrCreate = function(userObj) {
  var self = this;
  return self.findOne({
    email: userObj.email
  })
  .then(function(user) {
    if (user) return user;
    else return self.create({
      email: userObj.email,
      name: userObj.name
    });
  });
};

pageSchema.statics.deDupeTitle = function(title) {
  var self = this
}

function generateUrlTitle (title) {
  if (!title) {
    return Math.random().toString(36).substring(2, 7);
  }
  return title.replace(/\s+/g, '_').replace(/\W/g, '');
  // str = str.replace(/[\W]/g, '_');
  // str = str.replace(/\d/g, '');
  // return str;
}

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};
