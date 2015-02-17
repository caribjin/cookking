Meteor.publish('news', function(options) {
	return News.find({}, options);
});
