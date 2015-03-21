Meteor.publish('news', function(options) {
	return News.find({deleted: {$exists: false}}, options);
});
