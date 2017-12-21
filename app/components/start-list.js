import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  towplanes: Ember.computed(function() {
    return this.get('aircraft').filterBy('canTow', true);
  }),
  sortedFlights: Ember.computed.sort('flights', function(flight1, flight2) {
    let startTime1 = flight1.get('startTime');
    let startTime2 = flight2.get('startTime');
    if (startTime1 && !startTime2) {
      return -1;
    }
    else if (startTime2 && !startTime1) {
      return 1;
    }
    else {
      if (startTime1 < startTime2) {
        return -1;
      }
      else if (startTime1 > startTime2) {
        return 1;
      }
      else {
        return 0;
      }
    }
  }),
  didUpdateAttrs() {
    this._super(...arguments);
    this.redraw(this);
  },
  actions: {
    updateFlight(propertyName, flight, propertyValue) {
      let self = this;
      flight.set(propertyName, propertyValue);
      flight.save().then(function() {
        self.notifyPropertyChange('flights');
        self.redraw(self);
      });
    },
    addFlight() {
      let self = this;
      let flight = this.get('store').createRecord('flight', {});
      flight.set('startLocation', this.get('location'));
      flight.save().then(function() {
        self.set('flights', self.get('store').peekAll('flight'));
        self.redraw(self);
      });
    },
    deleteFlight(flight) {
      let self = this;
      flight.destroyRecord().then(function(flight) {
        self.redraw(self);
      });
    }
  },
  rowHeight: '50px',
  redraw(self) {
    Ember.run.later(function() {
      self.set('rowHeight', '51px');
      self.set('rowHeight', '50px');
    });
  }
});
