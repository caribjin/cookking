Template.Bookmarks.helpers({
	recipeCount: function() {
		return App.helpers.pluralize(this.length, 'recipe');
	}
});