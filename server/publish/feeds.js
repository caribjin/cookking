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
	var handles = {};

	handles['feeds'] = Feeds.find({recipeId: recipeId}).observe({
		added: function(feed) {
			self.added('feeds', feed._id, feed);

			handles['images'] = Images.find(feed.imageId).observe({
				added: function(image) {
					self.added('feedsImages', image._id, image);
				},
				changed: function(image, oldImage) {
					self.changed('feedsImages', image._id, image);
				},
				removed: function(image) {
					self.removed('feedsImages', image._id);
				}
			});
		},
		removed: function(feed) {
			self.removed('feeds', feed._id);

			handles['images'] && handles['images'].stop();
		}
	});

	self.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	self.ready();
});

Meteor.publish('feed', function(id) {
	return Feeds.find(id);
});

