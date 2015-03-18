RecipeController = RouteController.extend({
	waitOn: function() {
		if (!Meteor.user()) {
			Router.go('signin');
			return;
		}

		return [
			Meteor.subscribe('recipe', this.params._id),
			Meteor.subscribe('feedsForRecipe', this.params._id),
			Meteor.subscribe('images'),
			Meteor.subscribe('bookmarks', Meteor.userId())
		];
	},

	data: function() {
		return Recipes.findOne(this.params._id);
	}
});