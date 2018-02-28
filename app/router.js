import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('start-list', { path: '/:location/:date'});
  this.route('ktrax', { path: '/ktrax/:location/:date'});
  this.route('check-in', { path: '/check-in/:call_sign'});
  this.route('pilots');
  this.route('aircraft');
  this.route('loading');
  this.route('invalid-url', { path: '/*path'});
  this.route('logged-off');
});

export default Router;
