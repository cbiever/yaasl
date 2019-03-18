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

  @service session!: Session;
  @service store!: DS.Store;
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
    let locations = this.store.peekAll('location');
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
          if (mimeType == 'application/pdf') {
            response.blob().then((blob: any) => saveAs(blob, filename));
          }
          else {
            response.text().then((text: string) => saveAs(new Blob([text]), filename));
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
    let translations = new Map<string, string>();
    translations.set('location', this.intl.t('location'));
    translations.set('date', this.intl.t('date'));
    translations.set('call.sign', this.intl.t('flight.call.sign.placeholder'));
    translations.set('start.location', this.intl.t('flight.start.location.placeholder'));
    translations.set('start.time', this.intl.t('flight.start.time.placeholder'));
    translations.set('landing.location', this.intl.t('flight.landing.location.placeholder'));
    translations.set('landing.time', this.intl.t('flight.landing.time.placeholder'));
    translations.set('pilot.1', this.intl.t('flight.pilot.1'));
    translations.set('pilot.2', this.intl.t('flight.pilot.2'));
    translations.set('pilot.role', this.intl.t('flight.pilot.role'));
    translations.set('pilot.role.fi', this.intl.t('pilot.role.fi'));
    translations.set('pilot.role.pilot', this.intl.t('pilot.role.pilot'));
    translations.set('pilot.role.student', this.intl.t('pilot.role.student'));
    translations.set('pilot.role.passenger', this.intl.t('pilot.role.passenger'));
    translations.set('call.sign.tow.plane', this.intl.t('flight.call.sign.tow.plane'));
    translations.set('tow.pilot', this.intl.t('flight.tow.pilot'));
    translations.set('cost.sharing', this.intl.t('flight.cost.sharing.placeholder'));
    translations.set('cost.sharing.student', this.intl.t('cost.sharing.student'));
    translations.set('cost.sharing.fifty.fifty', this.intl.t('cost.sharing.fifty.fifty'));
    f(JSON.stringify([...translations].reduce((acc: any, val: any) => { acc[val[0]] = val[1]; return acc; }, {})));
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
    this.session.clearAuthorization();
    this.messageBus.publish('loggedOff');
    fetch('/api/v1/rs/authorizations/logoff', {
      method: 'post',
      headers: { 'Authorization': this.session.authorization }
    }).then(() => console.log('logged off'))
      .catch((error: any) => console.error('Error logging off: ', error));
  }

}
