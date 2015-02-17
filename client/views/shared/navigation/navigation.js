Template.Navigation.helpers({
	back: function() {
		return this.back && !(history.state && history.state.initial);
	}
});

Template.Navigation.rendered = function() {
	var $nav = this.$('nav');
	$nav.siblings('.content-scrollable:not(.static-nav)').children().first().waypoint(function(direction) {
		$nav.toggleClass('scrolled', direction === 'down');
	}, {
		context: '.content-scrollable',
		offset: -200
	});
};