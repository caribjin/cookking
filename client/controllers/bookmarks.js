BookmarksController = RouteController.extend({
	waitOn: function() {
		if (Meteor.user()) {
			var userEmail = Meteor.user().emails[0].address;
			Meteor.subscribe('bookmarkedRecipes', userEmail);
		}
	},

	data: function() {
		if (Meteor.user() && this.ready()) {
			return Recipes.find();
		}
	}
});