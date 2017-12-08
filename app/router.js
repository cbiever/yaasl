import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('start-list', { path: '/:location_id/:date_id'});
  this.route('pilots');
  this.route('aircraft');
  this.route('ktrax', { path: '/ktrax/:location_id/:date_id'});
});

export default Router;
