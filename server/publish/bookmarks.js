Meteor.publish('bookmarks', function(userId) {
	check(userId, String);

	return Bookmarks.find({userId: userId}, {sort: {createdAt: -1}});
});

Meteor.publish('bookmarkedRecipes', function(userId) {
	check(userId, String);

	var self = this;
	var handles = {};

	handles['bookmark'] = Bookmarks.find({userId: userId}).observe({
		added: function(bookmark) {
			handles['recipes'] = Recipes.find({_id: {$in: bookmark.recipeIds}}).observe({
				added: function(recipe) {
					self.added('recipes', recipe._id, recipe);
				},
				changed: function(recipe, oldRecipe) {
					self.changed('recipes', recipe._id, recipe);
				},
				removed: function(recipe) {
					self.remove('recipes', recipe);
				}
			});
		},
		removed: function(bookmark) {
			handles['recipes'] && handles['recipes'].stop();
		}
	});

	self.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	self.ready();
});