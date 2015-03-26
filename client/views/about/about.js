Template.About.onRendered(function() {
	//new Waypoint({
	//	element: $('.description-about'),
	//	context: $('.content-scrollable'),
	//	offset: -100,
	//	handler: function(direction) {
	//		console.log(direction);
	//	}
	//});
	new Waypoint({
		element: $('.waypoint'),
		context: $('.content-scrollable'),
		offset: 'bottom-in-view',
		handler: function(direction) {
			console.log(direction);
		}
	});


	//new Waypoint.Infinite({
	//	//element: $('.content-scrollable'),
	//	element: $('.infinite-container'),
	//	//container: $('.content-scrollable'),
	//	items: $('.description-about'),
	//	more: $('.btn-primary'),
	//
	//	onBeforePageLoad: function() {
	//		console.log('done');
	//	}
	//});
});

Template.About.events({
	'click .btn-primary': function(e, tmpl) {
		e.preventDefault();
		console.log('more clicked');
	}
});