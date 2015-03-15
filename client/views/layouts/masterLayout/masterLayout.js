var ANIMATION_DURATION = 300;
var NOTIFICATION_TIMEOUT = 5000;
var MENU_KEY = 'menuOpen';
var IGNORE_CONNECTION_ISSUE_KEY = 'ignoreConnectionIssue';
var CONNECTION_ISSUE_TIMEOUT = 5000;

Session.setDefault(IGNORE_CONNECTION_ISSUE_KEY, true);
Session.setDefault(MENU_KEY, false);

// XXX: this work around until IR properly supports this
// IR refactor will include Location.back, which will ensure
// that initator is set
var nextInitiator = null, initiator = null;
Tracker.autorun(function() {
	Router.current();

	initiator = nextInitiator;
	nextInitiator = null;
});

var Notifications = new Meteor.Collection(null);

Template.MasterLayout.addNotification = function(notification) {
	var id = Notifications.insert(notification);

	Meteor.setTimeout(function() {
		Notifications.remove(id);
	}, NOTIFICATION_TIMEOUT);
};

Meteor.startup(function () {
	// 왼쪽/오른쪽 스와이프 동작에 대한 핸들러를 설정
	$(document.body).touchwipe({
		wipeLeft: function () {
			Session.set(MENU_KEY, false);
		},
		wipeRight: function () {
			Session.set(MENU_KEY, true);
		},
		preventDefaultEvents: false
	});

	// 앱이 시작한 뒤 5초 이후부터만 connection error 메시지를 출력
	setTimeout(function () {
		// Launch screen handle created in both/router.js
		dataReadyHold.release();

		Session.set(IGNORE_CONNECTION_ISSUE_KEY, false);
	}, CONNECTION_ISSUE_TIMEOUT);
});

Template.MasterLayout.events({
	'click .js-menu': function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		Session.set(MENU_KEY, ! Session.get(MENU_KEY));
	},

	'click .js-back': function(event) {
		nextInitiator = 'back';

		// XXX: set the back transition via Location.back() when IR 1.0 hits
		history.back();
		event.stopImmediatePropagation();
		event.preventDefault();
	},

	'click a.js-open': function(event) {
		// On Cordova, open links in the system browser rather than In-App
		if (Meteor.isCordova) {
			event.preventDefault();
			window.open(event.target.href, '_system');
		}
	},

	'click .content-overlay': function(event) {
		Session.set(MENU_KEY, false);
		event.preventDefault();
	},

	'click #menu a': function(event) {
		nextInitiator = 'menu';
		Session.set(MENU_KEY, false);
	},

	'click .js-notification-action': function() {
		if (_.isFunction(this.callback)) {
			this.callback();
			Notifications.remove(this._id);
		}
	}
});

Template.MasterLayout.helpers({
	menuOpen: function() {
		return Session.get(MENU_KEY) && 'menu-open';
	},

	overlayOpen: function() {
		return Overlay.isOpen() ? 'overlay-open' : '';
	},

	connected: function() {
		return Session.get(IGNORE_CONNECTION_ISSUE_KEY) || Meteor.status().connected;
	},

	notifications: function() {
		return Notifications.find();
	}
});

Template.MasterLayout.rendered = function () {
	//this.find("#content-container")._uihooks = {
	//	insertElement: function(node, next) {
	//		// short-circuit and just do it right away
	//		if (initiator === 'menu')
	//			return $(node).insertBefore(next);
	//
	//		var start = (initiator === 'back') ? '-100%' : '100%';
	//
	//		$.Velocity.hook(node, 'translateX', start);
	//		$(node)
	//			.insertBefore(next)
	//			.velocity({translateX: [0, start]}, {
	//				duration: ANIMATION_DURATION,
	//				easing: 'ease-in-out',
	//				queue: false
	//			});
	//	},
	//	removeElement: function(node) {
	//		if (initiator === 'menu')
	//			return $(node).remove();
	//
	//		var end = (initiator === 'back') ? '100%' : '-100%';
	//
	//		$(node)
	//			.velocity({translateX: end}, {
	//				duration: ANIMATION_DURATION,
	//				easing: 'ease-in-out',
	//				queue: false,
	//				complete: function() {
	//					$(node).remove();
	//				}
	//			});
	//	}
	//};
	//
	//this.find(".Notifications")._uihooks = {
	//	insertElement: function(node, next) {
	//		$(node)
	//			.insertBefore(next)
	//			.velocity("slideDown", {
	//				duration: ANIMATION_DURATION,
	//				easing: [0.175, 0.885, 0.335, 1.05]
	//			});
	//	},
	//	removeElement: function(node) {
	//		$(node)
	//			.velocity("fadeOut", {
	//				duration: ANIMATION_DURATION,
	//				complete: function() {
	//					$(node).remove();
	//				}
	//			});
	//	}
	//};
};
