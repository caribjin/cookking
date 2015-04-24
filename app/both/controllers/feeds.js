FeedsController = RouteController.extend({
	option: function() {
		return {
			sort: {
				createdAt: -1
			},
			limit: 10
		};
	},

	subscriptions: function() {
		this.feedsSubscribe = Meteor.subscribe('feeds', this.option());
	},

	data: function() {
		return {
			feeds: function() {
				return Feeds.find();
			},
			ready: this.feedsSubscribe.ready
		}
	},

	fastRender: true
});