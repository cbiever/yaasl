import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default Component.extend({
  session: service(),
  store: service(),
  router: service(),
  messageBus: service(),
  intl: service(),
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
    this.get('router').transitionTo(route, location ? location.get('icao') : 'LSZB', date ? this.formatDate(date) : this.formatDate(new Date()));
  },
  download: function(mimeType) {
    this.translations(translations => {
      let filenameExtension = mimeType.split('/')[1];
      let filename = this.downloadFilename(filenameExtension);
      let url = '/api/v1/rs/flights?format=' + filenameExtension;
      if (this.get('location')) {
        url += '&filter[location]=' + this.get('location').get('icao');
      }
      if (this.get('date')) {
        url += '&filter[date]=' + this.formatDate(this.get('date'));
      }
      url += '&i18n=' + translations;
      fetch(encodeURI(url), {
          headers: { 'Authorization': this.get('session').get('authorization') }
        })
        .then(response => {
          if (mimeType == 'application/pdf') {
            response.text().then(text => window.saveAs(new Blob([base64js.toByteArray(text)]), filename));
          }
          else {
            response.text().then(text => { console.log(text, mimeType); window.saveAs(new Blob([text], { encoding: 'UTF-8' }), filename)});
          }
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
      filename = (this.get('date') ? filename + ' ' : '') + this.get('location').get('icao');
    }
    return filename + '.' + filenameExtension;
  },
  translations(f) {
    let intl = this.get('intl');
    let translations = {};
    translations['location'] = intl.t('location').string;
    translations['date'] = intl.t('date').string;
    translations['call.sign'] = intl.t('flight.call.sign.placeholder').string;
    translations['start.location'] = intl.t('flight.start.location.placeholder').string;
    translations['start.time'] = intl.t('flight.start.time.placeholder').string;
    translations['landing.location'] = intl.t('flight.landing.location.placeholder').string;
    translations['landing.time'] = intl.t('flight.landing.time.placeholder').string;
    translations['pilot.1'] = intl.t('flight.pilot.1').string;
    translations['pilot.2'] = intl.t('flight.pilot.2').string;
    translations['pilot.role'] = intl.t('flight.pilot.role').string;
    translations['pilot.role.fi'] = intl.t('pilot.role.fi').string;
    translations['pilot.role.pilot'] = intl.t('pilot.role.pilot').string;
    translations['pilot.role.student'] = intl.t('pilot.role.student').string;
    translations['pilot.role.passenger'] = intl.t('pilot.role.passenger').string;
    translations['call.sign.tow.plane'] = intl.t('flight.call.sign.tow.plane').string;
    translations['tow.pilot'] = intl.t('flight.tow.pilot').string;
    translations['cost.sharing'] = intl.t('flight.cost.sharing.placeholder').string;
    translations['cost.sharing.student'] = intl.t('cost.sharing.student').string;
    translations['cost.sharing.fifty.fifty'] = intl.t('cost.sharing.fifty.fifty').string;
    let reader = new FileReader();
    reader.onload = function(event) {
      f(base64js.fromByteArray(new Uint8Array(event.target.result)));
    };
    reader.readAsArrayBuffer(new Blob([JSON.stringify(translations)]));
  },
  actions: {
    setLocale(locale) {
      this.set('intl.locale', locale);
    },
    setLocation(location) {
      this.navigate(location, this.get('date'));
    },
    setDate(date) {
      this.set('showDatepicker', false);
      this.navigate(this.get('location'), date);
    },
    showAircraft() {
      this.get('router').transitionTo('aircraft');
    },
    showPilots() {
      this.get('router').transitionTo('pilots');
    },
    showStartList() {
      this.navigate(this.get('location'), this.get('date'), 'start-list');
    },
    showKtrax() {
      this.navigate(this.get('location'), this.get('date'), 'ktrax');
    },
    showFeedbackDialog() {
      this.get('messageBus').publish('showFeedbackDialog');
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
