BookmarksController = RouteController.extend({
	option: function() {
		return {
			fields: {
				title: 1,
				imageId: 1,
				highlighted: 1,
				favoritesCount: 1,
				commentsCount: 1,
				bookmarkedCount: 1,
				createdAt: 1
			}
		};
	},

	waitOn: function() {
		if (Meteor.user()) {
			return Meteor.subscribe('bookmarkedRecipes', Meteor.userId(), this.option());
		}
	},

	data: function() {
		if (Meteor.user() && this.ready()) {
			return BookmarkedRecipes.find();
		}
	},

	fastRender: true
});