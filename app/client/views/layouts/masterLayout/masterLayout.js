Session.setDefault(App.sessions.ignoreConnectionIssue, true);
Session.setDefault(App.sessions.menuOpen, false);

var nextInitiator = null, initiator = null;
Tracker.autorun(function() {
	Router.current();

	initiator = nextInitiator;
	nextInitiator = null;
});

var Notifications = new Meteor.Collection(null);

Template.MasterLayout.addNotification = function(notification, duration) {
	var id = Notifications.insert(notification);

	if (duration === 0 || duration === 'infinite') {
		duration = 3600 * 1000;
	} else if (!duration) {
		duration = Meteor.settings.public.defaultNotificationTime;
	}

	Meteor.setTimeout(function() {
		Notifications.remove(id);
	}, duration);
};

Template.MasterLayout.removeAllNotifications = function() {
	Notifications.remove({});
};

Template.MasterLayout.events({
	'click .js-menu': function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		Session.set(App.sessions.menuOpen, ! Session.get(App.sessions.menuOpen));
	},

	'click .js-back': function(event) {
		nextInitiator = 'back';

		history.back();
		event.stopImmediatePropagation();
		event.preventDefault();
	},

	'click a.js-open': function(event) {
		// Cordova 환경 내에서, 링크를 앱 내장 브라우저보다 좀 더 나은 시스템 브라우저로 연다.
		if (Meteor.isCordova) {
			event.preventDefault();
			window.open(event.target.href, '_system');
		}
	},

	'click .content-overlay': function(event) {
		Session.set(App.sessions.menuOpen, false);
		event.preventDefault();
	},

	'click #menu a': function(event) {
		nextInitiator = 'menu';
		Session.set(App.sessions.menuOpen, false);
	},

	'click .js-notification-action': function() {
		if (_.isFunction(this.callback)) {
			this.callback();
			Notifications.remove(this._id);
		}
	},

	'click .title-notification': function() {
		Notifications.remove(this._id);
	}
});

Template.MasterLayout.helpers({
	menuOpen: function() {
		return Session.get(App.sessions.menuOpen) && 'menu-open';
	},

	overlayOpen: function() {
		return Overlay.isOpen() ? 'overlay-open' : '';
	},

	connected: function() {
		return Session.get(App.sessions.ignoreConnectionIssue) || Meteor.status().connected;
	},

	notifications: function() {
		return Notifications.find();
	}
});

Template.MasterLayout.onRendered(function () {
	//this.find("#content-container")._uihooks = {
	//	insertElement: function(newNode, next) {
	//		if (initiator === 'menu')
	//			return $(newNode).insertBefore(next);
	//
	//		var start = (initiator === 'back') ? '-100%' : '100%';
	//
	//		$.Velocity.hook(newNode, 'translateX', start);
	//		$(newNode)
	//			.insertBefore(next)
	//			.velocity({translateX: [0, start]}, {
	//				duration: Meteor.settings.public.defaultAnimationDuration,
	//				easing: 'ease-in-out',
	//				queue: false,
	//				mobileHA: true
	//			});
	//	},
	//	removeElement: function(oldNode) {
	//		if (initiator === 'menu')
	//			return $(oldNode).remove();
	//
	//		var end = (initiator === 'back') ? '100%' : '-100%';
	//
	//		$(oldNode)
	//			.velocity({translateX: end}, {
	//				duration: Meteor.settings.public.defaultAnimationDuration,
	//				easing: 'ease-in-out',
	//				queue: false,
	//				mobileHA: true,
	//				complete: function() {
	//					$(oldNode).remove();
	//				}
	//			});
	//	}
	//};

	this.find(".notifications")._uihooks = {
		insertElement: function(node, next) {
			$(node)
				.insertBefore(next)
				.velocity("slideDown", {
					duration: Meteor.settings.public.defaultAnimationDuration,
					easing: [0.175, 0.885, 0.335, 1.05]
				});
		},
		removeElement: function(node) {
			$(node)
				.velocity("fadeOut", {
					duration: Meteor.settings.public.defaultAnimationDuration,
					complete: function() {
						$(node).remove();
					}
				});
		}
	};
});
