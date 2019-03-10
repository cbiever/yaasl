import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import fetch from 'fetch';

export default class extends Component {

  @service session
  @service store
  @service router
  @service messageBus
  @service intl

  init() {
    super.init(...arguments);
    this.messageBus.subscribe('storeInitialized', this, this.updateListener);
    this.messageBus.subscribe('location', this, this.updateLocationListener);
    this.messageBus.subscribe('date', this, this.updateDateListener);
  }

  updateListener() {
    let locations = this.store.peekAll('location');
    this.set('locations', locations);
  }

  updateLocationListener(location) {
    this.set('location', location);
  }

  updateDateListener(date) {
    this.set('date', date);
  }

  navigate(location, date, route) {
    if (!route) {
      route = this.router.currentRouteName;
    }
    this.router.transitionTo(route, location ? location.icao : 'LSZB', date ? this.formatDate(date) : this.formatDate(new Date()));
  }

  download(mimeType) {
    this.translations(translations => {
      let filenameExtension = mimeType.split('/')[1];
      let filename = this.downloadFilename(filenameExtension);
      let url = '/api/v1/rs/flights?format=' + filenameExtension;
      if (this.location) {
        url += '&filter[location]=' + this.location.icao;
      }
      if (this.date) {
        url += '&filter[date]=' + this.formatDate(this.date);
      }
      url += '&i18n=' + translations;
      fetch(encodeURI(url), {
          headers: { 'Authorization': this.session.authorization }
        })
        .then(response => {
          if (mimeType == 'application/pdf') {
            response.text().then(text => window.saveAs(new Blob([base64js.toByteArray(text)]), filename));
          }
          else {
            response.text().then(text => { window.saveAs(new Blob([text], { encoding: 'UTF-8' }), filename)});
          }
        });
    });
  }

  formatDate(date, separator = '-') {
    return date.getFullYear() + separator + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + separator + (date.getDate() < 10 ? '0' : '') + date.getDate();
  }

  downloadFilename(filenameExtension) {
    let filename = 'flights';
    if (this.date) {
      filename = this.formatDate(this.date, '');
    }
    if (this.location) {
      filename = (this.date ? filename + ' ' : '') + this.location.icao;
    }
    return filename + '.' + filenameExtension;
  }

  translations(f) {
    let intl = this.intl;
    let translations = {};
    translations['location'] = intl.t('location').string;
    translations['date']  = intl.t('date').string;
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
  }

  @action
  setLocale(locale) {
    this.set('intl.locale', locale);
  }

  @action
  setLocation(location) {
    this.navigate(location, this.date);
  }

  @action
  setDate(date) {
    this.set('showDatepicker', false);
    this.navigate(this.location, date);
  }

  @action
  showAircraft() {
    this.router.transitionTo('aircraft');
  }

  @action
  showPilots() {
    this.router.transitionTo('pilots');
  }

  @action
  showStartList() {
    this.navigate(this.location, this.date, 'start-list');
  }

  @action
  showKtrax() {
    this.navigate(this.location, this.date, 'ktrax');
  }

  @action
  showFeedbackDialog() {
    this.messageBus.publish('showFeedbackDialog');
  }

  @action
  downloadPDF() {
    this.download('application/pdf');
  }

  @action
  downloadCSV() {
    this.download('text/csv');
  }

  @action
  logoff() {
    this.session.clearAuthorization();
    this.messageBus.publish('loggedOff');
  }

}
