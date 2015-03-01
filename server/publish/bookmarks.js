Meteor.publish('bookmarks', function(userId) {
	check(userId, String);

	return Bookmarks.find({userId: userId}, {sort: {createdAt: -1}});
});

Meteor.publish('bookmarkedRecipes', function(userId) {
	check(userId, String);

	var self = this;
	var bookmarkHandle = null, recipeHandles = [];

	bookmarkHandle = Bookmarks.find({userId: userId}).observeChanges({
		added: function(id, bookmark) {
			var recipeIds = bookmark.recipeIds;
			var recipeCursor = Recipes.find({_id: {$in: recipeIds}});
			recipeHandles[id] = Meteor.Collection._publishCursor(recipeCursor, self, 'recipes');
		},
		changed: function(id, fields) {
			var recipeIds = fields.recipeIds;
			var recipeCursor = Recipes.find({_id: {$in: recipeIds}});
			recipeHandles[id] = Meteor.Collection._publishCursor(recipeCursor, self, 'recipes');
		},
		removed: function(id) {
			recipeHandles[id] && recipeHandles[i].stop();
		}
	});

	self.ready();
	self.onStop(function() {
		bookmarkHandle.stop();
	});
});