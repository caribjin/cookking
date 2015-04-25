RecipesController = RouteController.extend({
	condition: function() {
		var result = {};
		var filter = Session.get(App.sessions.recipesCurrentFilter);

		if (filter !== 'all') result.filter = filter;
		if (!App.helpers.isAdmin()) {
			result.$or = [{
				public: true
			}, {
				'writer.id': Meteor.userId()
			}];
		}

		return result;
	},

	option: function() {
		var option = {
			sort: {
				highlighted: -1
			},
			limit: !this.condition().filter ? Session.get(App.sessions.recipesLimit) + 1 : Session.get(App.sessions.recipesLimit),
			fields: {
				title: 1,
				imageId: 1,
				filter: 1,
				public: 1,
				'writer.id': 1,
				highlighted: 1,
				favoritesCount: 1,
				commentsCount: 1,
				bookmarkedCount: 1,
				createdAt: 1
			}
		};

		switch(Session.get(App.sessions.recipesCurrentSort)) {
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

	waitOn: function() {
		Session.setDefault(App.sessions.recipesLimit, Meteor.settings.public.defaultRecipesListLimit);
		Session.setDefault(App.sessions.recipesCurrentSort, Meteor.settings.public.defaultRecipesSort);
		Session.setDefault(App.sessions.recipesCurrentFilter, Meteor.settings.public.defaultRecipesListFilter);

		// 데이터 구독과 총 개수 정보를 별도로 구독하는 것에 주의. 데이터 구독시에 개수도 함께 가져올 수 있지만,
		// SubsManager의 캐쉬관련 동작의 특성 상, 항상 같은 총 개수를 리턴하는 오작동으로 인해, 데이터와 개수를
		// 별도의 구독으로 분리했다.
		this.recipesSubscribe = sm.subscribe('recipes', this.condition(), this.option());
		Meteor.subscribe('recipesCount', this.condition(), this.option());
	},

	data: function() {
		var self = this;

		return {
			recipes: function () {
				return Recipes.find(self.condition(), self.option());
			},
			condition: self.condition,
			option: self.option,
			ready: this.recipesSubscribe.ready
		}
	}
});