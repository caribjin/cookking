Template.Breadcrumb.filtersOpen = function() {
	$('.breadcrumb').velocity({backgroundColor: '#ffffff', backgroundColorAlpha: 1, color: '#555555'}, {duration: Meteor.settings.public.defaultAnimationDuration});
	$('.filters').velocity({zIndex: 3},{duration: Meteor.settings.public.defaultAnimationDuration});
	$('.filters').velocity('transition.slideDownIn',{duration: Meteor.settings.public.defaultAnimationDuration});
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
		return Session.equals(App.sessions.recipesCurrentSort, name);
	},

	isActiveFilter: function(name) {
		return Session.equals(App.sessions.recipesCurrentFilter, name);
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
		var key = Session.get(App.sessions.recipesCurrentFilter);
		var result = '';

		if (key === 'all') result = '전체 레시피';
		else result = Categories.findOne({key: key}).value;

		return result;
	},

	totalCount: function() {
		return Template.Recipes.totalCount();
	},

	currentCount: function() {
		return Template.Recipes.currentCount();
	}
});

Template.Breadcrumb.events({
	'click .created': function(e, tmpl) {
		$(e.target).velocity('pulse', function() {
			Session.set(App.sessions.recipesCurrentSort, 'created');
		});
	},

	'click .favorited': function(e, tmpl) {
		$(e.target).velocity('pulse', function() {
			Session.set(App.sessions.recipesCurrentSort, 'favorited');
		});
	},

	'click .bookmarked': function(e, tmpl) {
		$(e.target).velocity('pulse', function() {
			Session.set(App.sessions.recipesCurrentSort, 'bookmarked');
		});
	},

	'click .js-filter': function(e, tmpl) {
		Session.set(App.sessions.recipesCurrentFilter, $(e.target).data('key'));
		Session.set(App.sessions.recipesLimit, Meteor.settings.public.defaultRecipesListLimit);

		Template.Breadcrumb.setFiltersOpenStatus(false);
	},

	'click .js-open-filters': function(e, tmpl) {
		Template.Breadcrumb.toggleFiltersOpenStatus();
	}
});
