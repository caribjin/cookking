Session.setDefault(OVERLAY_TEMPLATE_KEY, null);

Overlay = {
	open: function(template, data) {
		Session.set(OVERLAY_TEMPLATE_KEY, template);
		Session.set(OVERLAY_DATA_KEY, data);
	},

	close: function() {
		Session.set(OVERLAY_TEMPLATE_KEY, null);
		Session.set(OVERLAY_DATA_KEY, null);
	},

	isOpen: function() {
		return !Session.equals(OVERLAY_TEMPLATE_KEY, null);
	},

	template: function () {
		return Session.get(OVERLAY_TEMPLATE_KEY);
	},

	data: function () {
		return Session.get(OVERLAY_DATA_KEY);
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