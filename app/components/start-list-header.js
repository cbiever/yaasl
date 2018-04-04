import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
  session: Ember.inject.service(),
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),
  router: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  init() {
    this._super(...arguments);
    this.get('messageBus').subscribe('storeInitialized', this, this.update);
    this.get('messageBus').subscribe('location', this, this.updateLocation);
    this.get('messageBus').subscribe('date', this, this.updateDate);
  },
  update() {
    let locations = this.get('store').peekAll('location');
    this.set('locations', locations);
  },
  updateLocation(location) {
    this.set('location', location);
  },
  updateDate(date) {
    this.set('date', date);
  },
  navigate: function(location, date, route) {
    if (!route) {
      route = this.get('router').get('currentRouteName');
    }
    this.get('router').transitionTo(route, location ? location.get('name') : 'LSZB', date ? this.formatDate(date) : this.formatDate(new Date()));
  },
  download: function(mimeType) {
    this.translations(translations => {
      let filenameExtension = mimeType.split('/')[1];
      let filename = this.downloadFilename(filenameExtension);
      let url = '/api/v1/rs/flights?format=' + filenameExtension;
      if (this.get('location')) {
        url += '&filter[location]=' + this.get('location').get('name');
      }
      if (this.get('date')) {
        url += '&filter[date]=' + this.formatDate(this.get('date'));
      }
      url += '&i18n=' + translations;
      Ember.$.get({
        url: url,
        beforeSend: (xhr) => {
          xhr.setRequestHeader('Authorization', this.get('session').get('authorization'));
        }
      })
      .then(function(data) {
        if (mimeType == 'application/pdf') {
          data = base64js.toByteArray(data);
        }
        window.saveAs(new Blob([data], { type: mimeType }), filename);
      });
    });
  },
  formatDate(date, separator = '-') {
    return date.getFullYear() + separator + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + separator + (date.getDate() < 10 ? '0' : '') + date.getDate();
  },
  downloadFilename(filenameExtension) {
    let filename = 'flights';
    if (this.get('date')) {
      filename = this.formatDate(this.get('date'), '');
    }
    if (this.get('location')) {
      filename = (this.get('date') ? filename + ' ' : '') + this.get('location').get('name');
    }
    return filename + '.' + filenameExtension;
  },
  translations(f) {
    let i18n = this.get('i18n');
    let translations = {};
    translations['location'] = i18n.t('location').string;
    translations['date'] = i18n.t('date').string;
    translations['call.sign'] = i18n.t('flight.call.sign.placeholder').string;
    translations['start.location'] = i18n.t('flight.start.location.placeholder').string;
    translations['start.time'] = i18n.t('flight.start.time.placeholder').string;
    translations['landing.location'] = i18n.t('flight.landing.location.placeholder').string;
    translations['landing.time'] = i18n.t('flight.landing.time.placeholder').string;
    translations['pilot.1'] = i18n.t('flight.pilot.1').string;
    translations['pilot.2'] = i18n.t('flight.pilot.2').string;
    translations['pilot.role'] = i18n.t('flight.pilot.role').string;
    translations['pilot.role.fi'] = i18n.t('pilot.role.fi').string;
    translations['pilot.role.pilot'] = i18n.t('pilot.role.pilot').string;
    translations['pilot.role.student'] = i18n.t('pilot.role.student').string;
    translations['pilot.role.passenger'] = i18n.t('pilot.role.passenger').string;
    translations['call.sign.tow.plane'] = i18n.t('flight.call.sign.tow.plane').string;
    translations['tow.pilot'] = i18n.t('flight.tow.pilot').string;
    translations['cost.sharing'] = i18n.t('flight.cost.sharing.placeholder').string;
    translations['cost.sharing.student'] = i18n.t('cost.sharing.student').string;
    translations['cost.sharing.fifty.fifty'] = i18n.t('cost.sharing.fifty.fifty').string;
    let reader = new FileReader();
    reader.onload = function(event) {
      f(base64js.fromByteArray(new Uint8Array(event.target.result)));
    };
    reader.readAsArrayBuffer(new Blob([JSON.stringify(translations)]));
  },
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
    showFeedbackDialog() {
      this.set('feedbackComment', '');
      this.set('showFeedbackDialog', true);
    },
    closeFeedbackDialog(action) {
      this.set('showFeedbackDialog', false);
      let feedback = this.get('store').createRecord('feedback', { 'feedback': this.get('feedback'), 'comment': this.get('feedbackComment') });
      feedback.save();
    },
    downloadPDF() {
      this.download('application/pdf');
    },
    downloadCSV() {
      this.download('text/csv');
    },
    logoff() {
      this.get('session').clearAuthorization();
      this.get('messageBus').publish('loggedOff');
    }
  }
});
