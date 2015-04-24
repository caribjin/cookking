Template.RecipeItem.helpers({
	path: function () {
		return Router.path('recipe', this.recipe);
	},

	highlightedClass: function () {
		if (this.size === 'large')
			return 'highlighted';
	},

	bookmarkedCount: function() {
		return this.bookmarkedCount || 0;
	},

	favoritesCount: function() {
		return this.favoritesCount || 0;
	},

	commentsCount: function() {
		return this.commentsCount || 0;
	},

	//sharedCount: function() {
	//	return this.sharedCount || 0;
	//},

	image: function(id) {
		return new FS.File(RecipesImage.findOne(id));
	}
});


