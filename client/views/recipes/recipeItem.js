Template.RecipeItem.helpers({
	path: function () {
		return Router.path('recipe', this.recipe);
	},

	highlightedClass: function () {
		if (this.size === 'large')
			return 'highlighted';
	},

	isBookmarked: function() {
		return this.bookmarkedCount > 0;
	},

	favoritesCount: function() {
		//return Math.round(Math.random() * 1000);
		return 0;
	},

	commentsCount: function() {
		//return Math.round(Math.random() * 100);
		return 0;
	},

	sharedCount: function() {
		//return Math.round(Math.random() * 200);
		return 0;
	},

	image: function(id) {
		return new FS.File(RecipesImage.findOne(id));
	}
});
