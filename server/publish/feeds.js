Meteor.publish('feeds', function(options) {
	check(options, {
		sort: {
			createdAt: Number
		},
		limit: Number
	});

	return Feeds.find({}, options);
});

Meteor.publish('feedsForRecipe', function(recipeId) {
	check(recipeId, String);

	var self = this;
	var feedHandle = null, feedHandles = [], imageHandles = [];

	feedHandle = Feeds.find({recipeId: recipeId}).observeChanges({
		added: function(id, feed) {
			var feedCursor = Feeds.find(id);
			feedHandles[id] = Meteor.Collection._publishCursor(feedCursor, self, 'feeds');

			var imageCursor = Images.find(feed.imageId);
			imageHandles[id] = Meteor.Collection._publishCursor(imageCursor, self, 'images');
		},
		changed: function(id, fields) {
			var feedCursor = Feeds.find(id);
			feedHandles[id] = Meteor.Collection._publishCursor(feedCursor, self, 'feeds');

			var imageCursor = Images.find(fields.imageId);
			imageHandles[id] = Meteor.Collection._publishCursor(imageCursor, self, 'images');
		},
		removed: function(id) {
			feedHandles[id] && feedHandles[id].stop();
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

