dataReadyHold = null;

Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
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
	this.route('about',         {path: '/about'})
});

Router.onBeforeAction('dataNotFound', {only: 'recipe'});
