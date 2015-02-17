Meteor.publish('bookmarks', function(userEmail) {
	return Bookmarks.find({userEmail: userEmail}, {sort: {createdAt: -1}});
});

Meteor.publish('bookmarkedRecipes', function(userEmail) {
	var self = this;
	var bookmarkHandle = null, recipeHandles = [];

	bookmarkHandle = Bookmarks.find({userEmail: userEmail}).observeChanges({
		added: function(id, bookmark) {
			var recipeIds = bookmark.recipeIds;
			var recipeCursor = Recipes.find({_id: {$in: recipeIds}});
			recipeHandles[id] = Meteor.Collection._publishCursor(recipeCursor, self, 'recipes');

			console.log('bookmark added: ' + id);
		},
		changed: function(id, fields) {
			var recipeIds = fields.recipeIds;
			var recipeCursor = Recipes.find({_id: {$in: recipeIds}});
			recipeHandles[id] = Meteor.Collection._publishCursor(recipeCursor, self, 'recipes');

			console.log('bookmark changed: ' + id);
		},
		removed: function(id) {
			recipeHandles[id] && recipeHandles[i].stop();

			console.log('bookmark removed');
		}
	});

	self.ready();
	self.onStop(function() {
		bookmarkHandle.stop();
	});
});