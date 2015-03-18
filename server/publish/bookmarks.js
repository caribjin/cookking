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
			var recipeCursor = Recipes.find({_id: {$in: bookmark.recipeIds}});
			recipeHandles[id] = Meteor.Collection._publishCursor(recipeCursor, self, 'recipes');
		},
		changed: function(id, fields) {
			var recipeCursor = Recipes.find({_id: {$in: fields.recipeIds}});
			recipeHandles[id] = Meteor.Collection._publishCursor(recipeCursor, self, 'recipes');
		},
		removed: function(id) {
			recipeHandles[id] && recipeHandles[id].stop();
		}
	});

	self.ready();
	self.onStop(function() {
		bookmarkHandle.stop();
	});
});