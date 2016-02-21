// NOT USED
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {enum: ['open', 'closed'], type: String},
  date:     {type: Date, default: Date.now},
  tags:     [{type: String}],
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

pageSchema.virtual('route').get(function () {
  return '/wiki/' + this.urlTitle;
});

var Page = mongoose.model('Page', pageSchema);
module.exports.Page = Page;
