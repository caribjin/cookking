Template.RecipeItem.image = function(id) {
	return new FS.File(RecipesImage.findOne(id));
};

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
	},

	generateRecipeImageUrl: function(imageId) {
		var image = Template.RecipeItem.image(imageId);
		var url = image.url({ store: 'thumbs' });

		if (!url) {
			url = '/img/app/cookking-logo.jpg';
		}

		return 'url(' + url + ');';
	}
});


