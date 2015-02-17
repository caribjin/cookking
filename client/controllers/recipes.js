RecipesController = RouteController.extend({
	option: function() {
		return {
			sort: {
				highlighted: -1,
				createdAt: -1
			},
			limit: 1000
		};
	},

	subscriptions: function() {
		this.recipesSubscribe = Meteor.subscribe('recipes', this.option());
	},

	data: function() {
		var self = this;
		return {
			recipes: function() {
				return Recipes.find({}, self.option());
			},
			ready: this.recipesSubscribe.ready
		}
	}
});