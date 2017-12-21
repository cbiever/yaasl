import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('start-list', { path: '/:location/:date'});
  this.route('ktrax', { path: '/ktrax/:location/:date'});
  this.route('checkin', { path: '/checkin/:call_sign'});
  this.route('pilots');
  this.route('aircraft');
  this.route('invalid-url', { path: '/*path'});
});

export default Router;
