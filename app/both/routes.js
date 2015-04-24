dataReadyHold = null;

Router.configure({
	layoutTemplate: 'MasterLayout',
	loadingTemplate: 'Loading',
	notFoundTemplate: 'NotFound',
	progressSpinner: false,
	waitOn: function() {
		return [
			Meteor.subscribe('user')
		];
	}
});

if (Meteor.isClient) {
	dataReadyHold = LaunchScreen.hold();
}

Router.map(function() {
	this.route('home',          {path: '/', controller: 'RecipesController', template: 'Recipes'});
	this.route('recipes',       {path: '/recipes'});
	this.route('recipe.write',  {path: '/recipe/write', template: 'RecipeWrite'});
	this.route('recipe',        {path: '/recipe/:_id'});
	this.route('feeds',         {path: '/feeds'});
	this.route('bookmarks',     {path: '/bookmarks'});
	this.route('settings',      {path: '/settings'});
	this.route('profile',       {path: '/profile'});
	this.route('profile.edit',  {path: '/profile/edit', template: 'ProfileEdit'});
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

	// examples
	this.route('examples.checkbox', {
		path: '/examples/checkbox',
		template: 'Examples_Checkbox'
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