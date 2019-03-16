import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import fetch from 'fetch';
import DS from 'ember-data';
import Location from '../models/location';
import Session from '../services/session';

export default class StartListHeader extends Component {

  date?: Date;
  showDatepicker: boolean = false;
  locations?: Location[];
  location?: Location;

  @service session?: Session;
  @service store?: DS.Store;
  @service router: any;
  @service messageBus: any;
  @service intl: any;

  init() {
    super.init();
    this.messageBus.subscribe('storeInitialized', this, this.updateListener);
    this.messageBus.subscribe('location', this, this.updateLocationListener);
    this.messageBus.subscribe('date', this, this.updateDateListener);
  }

  updateListener() {
    let locations = this.store!.peekAll('location');
    this.set('locations', locations);
  }

  updateLocationListener(location: Location) {
    this.set('location', location);
  }

  updateDateListener(date: Date) {
    this.set('date', date);
  }

  navigate(location: any, date?: Date, route?: any) {
    if (!route) {
      route = this.router.currentRouteName;
    }
    this.router.transitionTo(route, location ? location.icao : 'LSZB', date ? this.formatDate(date) : this.formatDate(new Date()));
  }

  download(mimeType: string) {
    this.translations((translations: any) => {
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
      if (this.session) {
        fetch(encodeURI(url), {
          headers: { 'Authorization': this.session.authorization }
        })
        .then((response: Response) => {
console.log('response: ', response, ' filename: ', filename);
          if (mimeType == 'application/pdf') {
//            response.text().then((text: string) => window.saveAs(new Blob([base64js.toByteArray(text)]), filename));
          }
          else {
//            response.text().then((text: string) => { window.saveAs(new Blob([text], { encoding: 'UTF-8' }), filename)});
          }
        });
      }
    });
  }

  formatDate(date: Date, separator: string = '-') {
    return date.getFullYear() + separator + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + separator + (date.getDate() < 10 ? '0' : '') + date.getDate();
  }

  downloadFilename(filenameExtension: string) {
    let filename = 'flights';
    if (this.date) {
      filename = this.formatDate(this.date, '');
    }
    if (this.location) {
      filename = (this.date ? filename + ' ' : '') + this.location.icao;
    }
    return filename + '.' + filenameExtension;
  }

  translations(f: any) {
console.log('f: ', f);
    let intl = this.intl;
    let translations = new Map<string, string>();
    translations.set('location', intl.t('location').string);
    translations.set('date', intl.t('date').string);
    translations.set('call.sign', intl.t('flight.call.sign.placeholder').string);
    translations.set('start.location', intl.t('flight.start.location.placeholder').string);
    translations.set('start.time', intl.t('flight.start.time.placeholder').string);
    translations.set('landing.location', intl.t('flight.landing.location.placeholder').string);
    translations.set('landing.time', intl.t('flight.landing.time.placeholder').string);
    translations.set('pilot.1', intl.t('flight.pilot.1').string);
    translations.set('pilot.2', intl.t('flight.pilot.2').string);
    translations.set('pilot.role', intl.t('flight.pilot.role').string);
    translations.set('pilot.role.fi', intl.t('pilot.role.fi').string);
    translations.set('pilot.role.pilot', intl.t('pilot.role.pilot').string);
    translations.set('pilot.role.student', intl.t('pilot.role.student').string);
    translations.set('pilot.role.passenger', intl.t('pilot.role.passenger').string);
    translations.set('call.sign.tow.plane', intl.t('flight.call.sign.tow.plane').string);
    translations.set('tow.pilot', intl.t('flight.tow.pilot').string);
    translations.set('cost.sharing', intl.t('flight.cost.sharing.placeholder').string);
    translations.set('cost.sharing.student', intl.t('cost.sharing.student').string);
    translations.set('cost.sharing.fifty.fifty', intl.t('cost.sharing.fifty.fifty').string);
    let reader = new FileReader();
    reader.onload = function(event: any) {
console.log('event: ', event);
//      f(base64js.fromByteArray(new Uint8Array(event.target.result)));
    };
    reader.readAsArrayBuffer(new Blob([JSON.stringify(translations)]));
  }

  @action
  setLocale(locale: string) {
    this.intl.setLocale(locale);
  }

  @action
  setLocation(location: Location) {
    this.navigate(location, this.date);
  }

  @action
  setDate(date: Date) {
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
    this.session!.clearAuthorization();
    this.messageBus.publish('loggedOff');
    fetch('/api/v1/rs/authorizations/logoff', {
      method: 'post',
      headers: { 'Authorization': this.session!.authorization }
    }).then(() => console.log('logged off'))
      .catch((error: any) => console.error('Error logging off: ', error));
  }

}
