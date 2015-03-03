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
		return Math.round(Math.random() * 1000);
	},

	commentsCount: function() {
		return Math.round(Math.random() * 100);
	},

	sharedCount: function() {
		return Math.round(Math.random() * 200);
	}
});
