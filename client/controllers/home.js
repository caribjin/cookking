HomeController = RouteController.extend({
	option: function(kind) {
		var limit;

		switch (kind) {
			case 'news':
				limit = 1;
				break;
			case 'feeds':
				limit = 2;
				break;
			default:
				limit = 4;
				break;
		}
		return {
			sort: {
				createdAt: -1
			},
			limit: limit
		};
	},

	waitOn: function() {
		return [
			Meteor.subscribe('news', this.option('news')),
			Meteor.subscribe('feeds', this.option('feeds')),
			Meteor.subscribe('recipes', this.option('recipes'), function() {
				dataReadyHold.release();
			})
		];
	},

	data: function() {
		return {
			lastNews: function() {
				return News.find();
			},
			lastFeeds: function() {
				return Feeds.find({}, {sort: {createdAt: -1}});
			},
			lastRecipes: function() {
				return Recipes.find();
			}
		}
	}
});