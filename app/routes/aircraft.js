import Route from '@ember/routing/route';

export default Route.extend({
  store: Ember.inject.service(),
  model() {
    return this.get('store').findAll('aircraft');
  }
});
