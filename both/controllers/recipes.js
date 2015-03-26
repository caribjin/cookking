var RECIPES_LIMIT = 'recipesLimitCount';
var SUBSCRIPTION_COMPLETED = 'subscriptionCompleted';

RecipesController = RouteController.extend({
	option: function() {
		Session.setDefault(RECIPES_LIMIT, App.settings.defaultRecipesListLimit);

		return {
			sort: {
				highlighted: -1,
				createdAt: -1
			},
			limit: Session.get(RECIPES_LIMIT)
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
	},

	action: function() {
		if (this.data().ready()) {
			Session.set(SUBSCRIPTION_COMPLETED, true);
		}
		this.render();
	}
});