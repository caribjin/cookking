RecipeController = RouteController.extend({
	condition: function() {
		return {
			id: this.params._id,
			admin: App.helpers.isAdmin()
		}
	},

	waitOn: function() {
		if (!Meteor.user()) {
			Router.go('signin');
			return;
		}

		return [
			Meteor.subscribe('recipe', this.condition()),
			Meteor.subscribe('feedsForRecipe', this.params._id),
			Meteor.subscribe('bookmarks', Meteor.userId()),
			Meteor.subscribe('favorites', Meteor.userId())
		];
	},

	data: function() {
		return Recipes.findOne(this.params._id);
	}
});