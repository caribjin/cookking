Meteor.publish('feeds', function(options) {
	//check(options, {
	//	sort: {
	//		createdAt: Number
	//	},
	//	limit: Number
	//});

	var self = this;
	var feedHandle = null, imageHandles = [];

	feedHandle = Feeds.find({}, options).observeChanges({
		added: function(id, feed) {
			var imageId = feed.imageId;
			var imageCursor = Images.find(imageId);
			imageHandles[id] = Meteor.Collection._publishCursor(imageCursor, self, 'images');
		},
		changed: function(id, fields) {
			var imageId = feed.imageId;
			var imageCursor = Images.find(imageId);
			imageHandles[id] = Meteor.Collection._publishCursor(imageCursor, self, 'images');
		},
		remove: function(id) {
			imageHandles[id] && imageHandles[id].stop();
		}
	});

	self.ready();
	self.onStop(function() {
		feedHandle.stop();
	});
});

Meteor.publish('feed', function(id) {
	return Feeds.find(id);
});

