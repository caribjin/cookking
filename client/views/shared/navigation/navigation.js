Template.Navigation.helpers({
	isTransparent: function() {
		return this.transparent ? this.transparent : false;
	},

	back: function() {
		return this.back && !(history.state && history.state.initial);
	}
});

Template.Navigation.onRendered(function() {
	$('.content-scrollable').waypoint(function(direction) {
		$('nav').toggleClass('scrolled', direction === 'down');
	}, {
		context: $('.content-scrollable'),
		offset: -100
	});
});