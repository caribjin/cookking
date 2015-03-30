var RECIPES_LIMIT = 'recipesLimitCount';
var RECIPES_CURRENT_SORT = 'recipesCurrentSort';
var RECIPES_CURRENT_FILTER = 'recipesCurrentFilter';

Template.Breadcrumb.filtersOpen = function() {
	$('.breadcrumb').velocity({backgroundColor: '#ffffff', backgroundColorAlpha: 1, color: '#555555'}, {duration: App.settings.defaultAnimationDurationSlow})
	$('.filters').velocity({zIndex: 3},{duration: App.settings.defaultAnimationDurationSlow});
	$('.filters').velocity('transition.slideDownIn',{duration: App.settings.defaultAnimationDurationSlow});
};

Template.Breadcrumb.filtersClose = function() {
	$('.filters').velocity('reverse', {duration: 200});
	$('.filters').velocity({zIndex: 0},{duration: 0});
	$('.breadcrumb').velocity('reverse', {duration: 600});
};

Template.Breadcrumb.setFiltersOpenStatus = function(status) {
	Template.instance().filtersOpenStatus.set(status);
};

Template.Breadcrumb.toggleFiltersOpenStatus = function() {
	var status = Template.instance().filtersOpenStatus.get();
	Template.Breadcrumb.setFiltersOpenStatus(!status);
};

Template.Breadcrumb.onCreated(function() {
	Session.setDefault(RECIPES_CURRENT_SORT, App.settings.defaultRecipesSort);
	Session.setDefault(RECIPES_CURRENT_FILTER, 'all');

	this.filtersOpenStatus = new ReactiveVar(false);

	var self = this;
	Tracker.autorun(function() {
		if (self.filtersOpenStatus.get()) {
			Template.Breadcrumb.filtersOpen();
		} else {
			Template.Breadcrumb.filtersClose();
		}
	});
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

		var all = [{key: 'all', value: '전체'}];
		categories = all.concat(categories);

		categories = _.groupBy(categories, function(el, index) {
			return Math.floor(index / 3);
		});

		return _.toArray(categories);
	},

	currentFilterName: function() {
		var key = Session.get(RECIPES_CURRENT_FILTER);
		var result = '';

		if (key === 'all') result = '전체 레시피';
		else result = Categories.findOne({key: key}).value;

		return result;
	},

	totalCount: function() {
		return Recipes.find().count();
	}
});

Template.Breadcrumb.events({
	'click .created': function(e, tmpl) {
		e.preventDefault();
		Session.set(RECIPES_CURRENT_SORT, 'created');
		$(e.target).velocity('pulse');
	},

	'click .favorited': function(e, tmpl) {
		e.preventDefault();
		Session.set(RECIPES_CURRENT_SORT, 'favorited');
		$(e.target).velocity('pulse');
	},

	'click .bookmarked': function(e, tmpl) {
		e.preventDefault();
		Session.set(RECIPES_CURRENT_SORT, 'bookmarked');
		$(e.target).velocity('pulse');
	},

	'click .js-filter': function(e, tmpl) {
		e.preventDefault();
		Session.set(RECIPES_CURRENT_FILTER, $(e.target).data('key'));
		Session.set(RECIPES_LIMIT, App.settings.defaultRecipesListLimit);

		Template.Breadcrumb.setFiltersOpenStatus(false);
	},

	'click .js-open-filters': function(e, tmpl) {
		e.preventDefault();
		Template.Breadcrumb.toggleFiltersOpenStatus();
	}
});