var TAB_KEY = 'recipeShowTab';

Template.Recipe.onCreated(function() {
	if (Router.current().params.feedId)
		Template.Recipe.setTab('feeds');
	else
		Template.Recipe.setTab('recipe');
});

Template.Recipe.onRendered(function () {
	this.$('.recipe').touchwipe({
		wipeDown: function () {
			if (Session.equals(TAB_KEY, 'recipe'))
				Template.Recipe.setTab('ingredients')
		},
		preventDefaultEvents: false
	});
	this.$('.recipe-information').touchwipe({
		wipeUp: function () {
			if (!Session.equals(TAB_KEY, 'recipe'))
				Template.Recipe.setTab('recipe')
		},
		preventDefaultEvents: false
	});
});

Template.Recipe.setTab = function(tab) {
	var lastTab = Session.get(TAB_KEY);
	Session.set(TAB_KEY, tab);

	// 패널이 위로 올라갈 때
	var fromRecipe = (lastTab === 'recipe') && (tab !== 'recipe');
	$('.ingredient-scrollable').toggleClass('instant', fromRecipe);
	$('.direction-scrollable').toggleClass('instant', fromRecipe);
	$('.feed-scrollable').toggleClass('instant', fromRecipe);

	// 패널이 밑으로 내려갈 떄
	var toRecipe = (lastTab !== 'recipe') && (tab === 'recipe');
	$('.ingredient-scrollable').toggleClass('delayed', toRecipe);
	$('.direction-scrollable').toggleClass('delayed', toRecipe);
	$('.feed-scrollable').toggleClass('delayed', toRecipe);
};

Template.Recipe.helpers({
	isActiveTab: function(name) {
		return Session.equals(TAB_KEY, name);
	},

	activeTabClass: function() {
		return Session.get(TAB_KEY);
	},

	bookmarked: function() {
		var exist = Meteor.user() && Bookmarks.find({'recipeIds': this._id}).count() > 0;
		return exist;
	},

	feeds: function() {
		return Feeds.find({recipeId: this._id}, {sort: {createdAt: -1}});
	},

	favoritesCount: function() {
		return Math.round(Math.random() * 1000);
	},

	commentsCount: function() {
		return Math.round(Math.random() * 100);
	},

	sharedCount: function() {
		return Math.round(Math.random() * 200);
	},

	deletable: function() {
		return true;
	},

	avatarImage: function() {
		return this.writer.avatar || App.settings.emptyAvatarImage;
	}
});

Template.Recipe.events({
	'click .js-add-bookmark': function(event) {
		event.preventDefault();

		if (!Meteor.userId())
			return Overlay.open('authOverlay');

		Meteor.call('bookmarkRecipe', this._id);
	},

	'click .js-remove-bookmark': function(event) {
		event.preventDefault();

		Meteor.call('unbookmarkRecipe', this._id);
	},

	'click .js-delete': function(event) {
		event.preventDefault();

		var self = this;

		App.helpers.confirm(
			'레시피를 삭제하시겠습니까?',
			'한번 삭제된 레시피는 복구할 수 없습니다.',
			'warning', false, function() {
				Meteor.call('deleteRecipe', self._id, function (error, result) {
					if (error) {
						App.helpers.error(error.reason);
					} else {
						if (result > 0) {
							Router.go('/');

							App.helpers.alert(
								'삭제되었습니다!',
								'레시피가 삭제되었습니다',
								'success', true);
						} else {
							App.helpers.error('일치하는 레시피를 찾을 수 없습니다');
						}
					}
				});
			});
	},


	'click .js-share': function() {
		Overlay.open('ShareOverlay', this);
	},

	'click .js-show-ingredients': function(event) {
		event.stopPropagation();
		Template.Recipe.setTab('ingredients');
	},

	'click .js-show-directions': function(event) {
		event.stopPropagation();
		Template.Recipe.setTab('directions')
	},

	'click .js-show-feeds': function(event) {
		event.stopPropagation();
		Template.Recipe.setTab('feeds')
	},

	'click .js-recipe': function() {
		Template.Recipe.setTab('recipe')
	}
});

