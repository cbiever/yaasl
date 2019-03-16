import BaseRoute from "./baseRoute";
import RSVP from 'rsvp';

export default class extends BaseRoute {

  beforeModel(transition: any) {
    return this.checkAuthenticated(transition).then(
      () => {
        console.info('logged in start list');
        // remove all flights, unloadAll('flight') is asynchronous and can unfortunately not be used here
        let flights = this.store.peekAll('flight').toArray();
        for (let i = 0; i < flights.length; i++) {
          flights.get(i).unloadRecord();
        }
      },
      () => {
        this.transitionTo('login');
      });
  }

  model(parameters: any) {
    return RSVP.hash({
      location: this.store.query('location', {
        filter: {
          location: parameters.location
        }
      }).then(locations => {
        return locations.firstObject;
      }),
      date: new Date(parameters.date),
      aircraft: this.store.peekAll('aircraft'),
      locations: this.store.peekAll('location'),
      pilots: this.store.peekAll('pilot'),
      pilotRoles: this.store.peekAll('pilotRole'),
      flights: this.store.query('flight', {
        filter: {
          location: parameters.location,
          date: parameters.date
        }
      }).then(flights => {
        return flights.toArray();
      }),
      costSharings: this.store.peekAll('costSharing')
    });
  }

  afterModel(model: any) {
    this.messageBus.publish('location', model.location);
    this.messageBus.publish('date', model.date);
  }

}
