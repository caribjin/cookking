RecipeController = RouteController.extend({
	waitOn: function() {
		return [
			Meteor.subscribe('recipe', this.params._id),
			Meteor.subscribe('feeds', {recipeId: this.params._id}),
			Meteor.subscribe('bookmarks', Meteor.userId())
		];
	},

	data: function() {
		return Recipes.findOne(this.params._id);
	}
});