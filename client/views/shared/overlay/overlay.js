Session.setDefault(App.sessions.overlayTemplateName, null);

Overlay = {
	open: function(template, data) {
		Session.set(App.sessions.overlayTemplateName, template);
		Session.set(App.sessions.overlayTemplateData, data);
	},

	close: function() {
		Session.set(App.sessions.overlayTemplateName, null);
		Session.set(App.sessions.overlayTemplateData, null);
	},

	isOpen: function() {
		return !Session.equals(App.sessions.overlayTemplateName, null);
	},

	template: function () {
		return Session.get(App.sessions.overlayTemplateName);
	},

	data: function () {
		return Session.get(App.sessions.overlayTemplateData);
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