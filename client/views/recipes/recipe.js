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

	var $ingredient = $('.ingredient-scrollable');
	var $direction = $('.direction-scrollable');
	var $feed = $('.feed-scrollable');

	// 패널이 위로 올라갈 때
	var fromRecipe = (lastTab === 'recipe') && (tab !== 'recipe');
	$ingredient.toggleClass('instant', fromRecipe);
	$direction.toggleClass('instant', fromRecipe);
	$feed.toggleClass('instant', fromRecipe);

	// 패널이 밑으로 내려갈 떄
	var toRecipe = (lastTab !== 'recipe') && (tab === 'recipe');
	$ingredient.toggleClass('delayed', toRecipe);
	$direction.toggleClass('delayed', toRecipe);
	$feed.toggleClass('delayed', toRecipe);
};

Template.Recipe.helpers({
	isActiveTab: function(name) {
		return Session.equals(TAB_KEY, name);
	},

	activeTabClass: function() {
		return Session.get(TAB_KEY);
	},

	bookmarked: function() {
		return Meteor.user() && Bookmarks.find({'recipeIds': this._id}).count() > 0;
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
			'이 레시피를 영구적으로 삭제합니다.',
			'warning', true, function() {
				Meteor.call('deleteRecipe', self._id, function (error, result) {
					if (error) {
						App.helpers.error(error.reason);
					} else {
						if (result) {
							Router.go('/');

							App.helpers.addNotification('삭제되었습니다', '실행취소', function() {
								tx.undo();
							}, 'infinite');

							//App.helpers.alert(
							//	'삭제되었습니다!',
							//	'레시피가 삭제되었습니다',
							//	'success', true, function() {
							//		App.helpers.addNotification('삭제했습니다', '실행취소', function() {
							//			tx.undo();
							//		});
							//	});
						} else {
							App.helpers.error('일치하는 레시피를 찾을 수 없습니다');
						}
					}
				});
			});
	},

	'click .js-share': function() {
		_.extend(this, {
			purpose: 'feed-image'
		});
		Overlay.open('Share', this);
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

