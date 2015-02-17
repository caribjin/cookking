Meteor.publish('feeds', function(options) {
	return Feeds.find({}, options);
});

Meteor.publish('feed', function(id) {
	return Feeds.find(id);
});