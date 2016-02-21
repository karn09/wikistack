module.exports = function(swig) {
  var pageLink = function (page) {
    return '<a href="' + page.route + '">' + page.title + '</a>';
  }
  var join = function(tags) {
    return tags.join(' ');
  }

  pageLink.safe = true;
  join.safe = true;
  swig.setFilter('join', join);
  swig.setFilter('pageLink', pageLink);

}
