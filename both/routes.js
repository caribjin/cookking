dataReadyHold = null;

Router.configure({
	layoutTemplate: 'MasterLayout',
	loadingTemplate: 'Loading',
	notFoundTemplate: 'NotFound',
	waitOn: function() {
		return Meteor.subscribe('user');
	}
});

if (Meteor.isClient) {
	dataReadyHold = LaunchScreen.hold();
}

Router.map(function() {
	this.route('home',          {path: '/'});
	this.route('recipes',       {path: '/recipes'});
	this.route('recipe',        {path: '/recipes/:_id'});
	this.route('news',          {path: '/news'});
	this.route('feeds',         {path: '/feeds'});
	this.route('bookmarks',     {path: '/bookmarks'});
	this.route('about',         {path: '/about'});
	this.route('signin',        function() {
		Router.go('home');
		Overlay.open('SignIn');
	});
	this.route('signup',        function() {
		Router.go('home');
		Overlay.open('SignUp');
	});
	this.route('signout',       function() {
		Router.go('home');
		Meteor.logout();
	});
});

var requireLogin = function() {
	if (!Meteor.user()) {
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			Router.go('signin');
		}
	} else {
		this.next();
	}
};

Router.onBeforeAction('dataNotFound', {only: 'recipe'});
Router.onBeforeAction(requireLogin, {except: ['home', 'about', 'signup', 'signin', 'signout']});
