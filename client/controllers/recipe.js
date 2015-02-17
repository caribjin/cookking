RecipeController = RouteController.extend({
	waitOn: function() {
		var userEmail = '';
		if (Meteor.user()) {
			userEmail = Meteor.user().emails[0].address;
		}
		return [
			Meteor.subscribe('recipe', this.params._id),
			Meteor.subscribe('feeds', {recipeId: this.params._id}),
			Meteor.subscribe('bookmarks', userEmail)
		];
	},

	data: function() {
		return Recipes.findOne(this.params._id);
	}
});