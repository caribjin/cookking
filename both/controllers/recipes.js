var RECIPES_LIMIT = 'recipesLimitCount';
var RECIPES_SUB_COMPLETED = 'recipesSubCompleted';
var RECIPES_CURRENT_SORT = 'recipesCurrentSort';
var RECIPES_CURRENT_FILTER = 'recipesCurrentFilter';
var RECIPES_CURRENT_COUNT = 'recipesCurrentCount';

RecipesController = RouteController.extend({
	filter: function() {
		return Session.get(RECIPES_CURRENT_FILTER) || App.settings.defaultRecipesListFilter;
	},

	option: function() {
		Session.setDefault(RECIPES_LIMIT, App.settings.defaultRecipesListLimit);
		Session.setDefault(RECIPES_CURRENT_SORT, App.settings.defaultRecipesSort);

		var option = {
			sort: {
				highlighted: -1
			},
			limit: this.filter() === 'all' ? Session.get(RECIPES_LIMIT) + 1 : Session.get(RECIPES_LIMIT),
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

		switch(Session.get(RECIPES_CURRENT_SORT)) {
			case 'created':
				_.extend(option.sort, {createdAt: -1});
				break;
			case 'favorited':
				_.extend(option.sort, {favoritesCount: -1, createdAt: -1});
				break;
			case 'bookmarked':
				_.extend(option.sort, {bookmarkedCount: -1, createdAt: -1});
				break;
			default:
				_.extend(option.sort, {createdAt: -1});
				break;
		}

		return option;
	},

	subscriptions: function() {
		this.recipesSubscribe = Meteor.subscribe('recipes', this.filter(), this.option());
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
		if (this.recipesSubscribe.ready()) {
			Session.set(RECIPES_SUB_COMPLETED, true);
			Session.set(RECIPES_CURRENT_COUNT, this.data().recipes().count());
		}

		this.render();
	}
});