import Component from '@ember/component';

export default Component.extend({
  i18n: Ember.inject.service(),
  router: Ember.inject.service(),
  actions: {
    setLocale(locale) {
      this.set('i18n.locale', locale);
    },
    setLocation(location) {
      this.navigate(location, this.get('date'));
    },
    setDate(date) {
      this.set('showDatepicker', false);
      this.navigate(this.get('location'), date);
    },
    showStartList() {
      this.navigate(this.get('location'), this.get('date'), 'start-list');
    },
    showKtrax() {
      this.navigate(this.get('location'), this.get('date'), 'ktrax');
    },
    downloadPDF() {

    },
    downloadCSV() {

    }
  },
  navigate: function(location, date, route) {
    if (!route) {
      route = this.get('router').get('currentRouteName');
    }
    this.get('router').transitionTo(route, location.get('name').toLowerCase(), date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate());
  }
});
