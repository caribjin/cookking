Meteor.publish('bookmarks', function(userId) {
	check(userId, String);

	return Bookmarks.find({userId: userId});
});

Meteor.publish('bookmarkedRecipes', function(userId, options) {
	check(userId, String);
	check(options, {
		fields: Object
	});

	var self = this;
	var handles = {};
	var imageOptions = {
		fields: {
			"uploadedAt": 1,
			"copies.thumbs.key": 1,
			"copies.images.key": 1
		}
	};

	sm.reset();

	handles['bookmark'] = Bookmarks.find({userId: userId}).observe({
		added: function(bookmark) {
			handles['bookmarkedRecipes'] = Recipes.find({_id: {$in: bookmark.recipeIds}, deleted: {$exists: false}}, options).observe({
				added: function(recipe) {
					self.added('bookmarkedRecipes', recipe._id, recipe);

					handles['images'] = Images.find(recipe.imageId, imageOptions).observe({
						added: function(image) {
							self.added('recipesImage', image._id, image);
						},
						changed: function(image, oldImage) {
							self.changed('recipesImage', image._id, image);
						},
						removed: function(image) {
							self.removed('recipesImage', image._id);
						}
					});
				},
				changed: function(recipe, oldRecipe) {
					self.changed('bookmarkedRecipes', recipe._id, recipe);

					handles['images'] = Images.find(recipe.imageId, imageOptions).observe({
						added: function(image) {
							self.added('recipesImage', image._id, image);
						},
						changed: function(image, oldImage) {
							self.changed('recipesImage', image._id, image);
						},
						removed: function(image) {
							self.removed('recipesImage', image._id);
						}
					});
				},
				removed: function(recipe) {
					self.remove('bookmarkedRecipes', recipe);

					handles['images'] && handles['images'].stop();
				}
			});
		},
		removed: function(bookmark) {
			handles['bookmarkedRecipes'] && handles['bookmarkedRecipes'].stop();
		}
	});

	self.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	self.ready();
});