NewsController = RouteController.extend({
	option: function() {
		return {
			sort: {
				createdAt: -1
			},
			limit: 5
		}
	},

	waitOn: function() {
		return Meteor.subscribe('news', this.option());
	},

	data: function() {
		return {
			lastNews: function() {
				return News.find();
			}
		}
	}
});