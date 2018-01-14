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
      this.download('application/pdf');
    },
    downloadCSV() {
      this.download('text/csv');
    }
  },
  navigate: function(location, date, route) {
    if (!route) {
      route = this.get('router').get('currentRouteName');
    }
    this.get('router').transitionTo(route, location.get('name'), this.formatDate(date));
  },
  download: function(mimeType) {
    let filenameExtension = mimeType.split('/')[1];
    let filename = this.downloadFilename(filenameExtension);
    let url = '/api/v1/rs/flights?format=' + filenameExtension;
    if (this.get('location')) {
      url += '&filter[location]=' + this.get('location').get('name');
    }
    if (this.get('date')) {
      url += '&filter[date]=' + this.formatDate(this.get('date'));
    }
    Ember.$.get(url).then(function(data) {
      if (mimeType == 'application/pdf') {
        data = base64js.toByteArray(data);
      }
      window.saveAs(new Blob([data], { type: mimeType }), filename);
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
  }
});
