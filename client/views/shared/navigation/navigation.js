Template.Navigation.helpers({
	isTransparent: function() {
		return this.transparent ? this.transparent : false;
	},

	back: function() {
		return this.back && !(history.state && history.state.initial);
	}
});

Template.Navigation.onRendered(function() {
	//new Waypoint({
	//	element: $('.content-scrollable').children().first(),
	//	handler: function(direction) {
	//		$('nav').toggleClass('scrolled', direction === 'down');
	//	},
	//	context: $('.content-scrollable'),
	//	offset: -100
	//});

	$('.content-scrollable').waypoint(function(direction) {
		$('nav').toggleClass('scrolled', direction === 'down');
	}, {
		context: $('.content-scrollable'),
		offset: -100
	});
});