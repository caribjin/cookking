BookmarksController = RouteController.extend({
	waitOn: function() {
		if (Meteor.user()) {
			Meteor.subscribe('bookmarkedRecipes', Meteor.userId());
		}
	},

	data: function() {
		if (Meteor.user() && this.ready()) {
			return Recipes.find();
		}
	}
});