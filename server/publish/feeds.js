Meteor.publish('feeds', function(options) {
	check(options, {
		sort: {
			createdAt: Number
		},
		limit: Number
	});

	return Feeds.find({deleted: {$exists: false}}, options);
});

Meteor.publish('feedsForRecipe', function(recipeId) {
	check(recipeId, String);

	var self = this;
	var handles = {};

	handles['feeds'] = Feeds.find({recipeId: recipeId, deleted: {$exists: false}}).observe({
		added: function(feed) {
			self.added('feeds', feed._id, feed);

			handles['images'] = Images.find(feed.imageId).observe({
				added: function(image) {
					self.added('feedsImage', image._id, image);
				},
				changed: function(image, oldImage) {
					self.changed('feedsImage', image._id, image);
				},
				removed: function(image) {
					self.removed('feedsImage', image._id);
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
	return Feeds.find({_id: id, deleted: {$exists: false}});
});

