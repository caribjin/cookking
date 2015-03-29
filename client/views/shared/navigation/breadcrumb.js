var RECIPES_CURRENT_SORT = 'recipesCurrentSort';
var RECIPES_CURRENT_FILTER = 'recipesCurrentFilter';

Template.Breadcrumb.onCreated(function() {
	Session.setDefault(RECIPES_CURRENT_SORT, App.settings.defaultRecipesSort);
	Session.setDefault(RECIPES_CURRENT_FILTER, 'category-all');
});

Template.Breadcrumb.helpers({
	isActiveSort: function(name) {
		return Session.equals(RECIPES_CURRENT_SORT, name);
	},

	isActiveFilter: function(name) {
		return Session.equals(RECIPES_CURRENT_FILTER, name);
	},

	categories: function() {
		var categories = Categories.find({}, {sort: {key: 1}}).fetch();

		var all = [{key: 'category-all', value: '전체'}];
		categories = all.concat(categories);

		categories = _.groupBy(categories, function(el, index) {
			return Math.floor(index / 3);
		});

		return _.toArray(categories);
	}
});

Template.Breadcrumb.events({
	'click .created': function(e, tmpl) {
		Session.set(RECIPES_CURRENT_SORT, 'created');
		$(e.target).velocity('pulse');
	},

	'click .favorited': function(e, tmpl) {
		Session.set(RECIPES_CURRENT_SORT, 'favorited');
		$(e.target).velocity('pulse');
	},

	'click .bookmarked': function(e, tmpl) {
		Session.set(RECIPES_CURRENT_SORT, 'bookmarked');
		$(e.target).velocity('pulse');
	},

	'click .js-filter': function(e, tmpl) {
		Session.set(RECIPES_CURRENT_FILTER, $(e.target).data('key'));
	}
});