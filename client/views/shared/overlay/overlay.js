var TEMPLATE_KEY = 'overlayTemplate';
var DATA_KEY = 'overlayData';

Session.setDefault(TEMPLATE_KEY, null);

Overlay = {
	open: function(template, data) {
		Session.set(TEMPLATE_KEY, template);
		Session.set(DATA_KEY, data);
	},

	close: function() {
		Session.set(TEMPLATE_KEY, null);
		Session.set(DATA_KEY, null);
	},

	isOpen: function() {
		return !Session.equals(TEMPLATE_KEY, null);
	},

	template: function () {
		return Session.get(TEMPLATE_KEY);
	},

	data: function () {
		return Session.get(DATA_KEY);
	}
};

Template.Overlay.onRendered(function() {
	this.find('#overlay-hook')._uihooks = {
		insertElement: function(node, next, done) {
			var $node = $(node);

			$node
				.hide()
				.insertBefore(next)
				.velocity('slideDown', {
					duration: App.settings.defaultAnimationDuration
				});
		},
		removeElement: function(node, done) {
			var $node = $(node);

			$node
				.velocity("slideUp", {
					duration: App.settings.defaultAnimationDuration,
					complete: function() {
						$node.remove();
					}
				});
		}
	}
});

Template.Overlay.helpers({
	template: function() {
		return Overlay.template();
	},

	data: function() {
		return Overlay.data();
	}
});

Template.Overlay.events({
	'click .js-close-overlay': function(event) {
		event.preventDefault();
		Overlay.close()
	}
});