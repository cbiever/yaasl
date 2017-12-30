import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  websockets: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  model() {
    return RSVP.hash({
      locations: this.get('store').findAll('location'),
      aircraft: this.get('store').findAll('aircraft'),
      pilots: this.get('store').findAll('pilot'),
      pilotRoles: this.get('store').findAll('pilotRole'),
      session: this.get('store').peekRecord('session', 42)
    });
  },
  beforeModel(transition) {
    if (!this.get('store').peekRecord('session', 42)) {
      let json = '{ "data": { "id": 42, "type": "session", "attributes": { "originator-id": -1 } } }';
      this.get('store').pushPayload(JSON.parse(json));
    }
    if (!this.get('socket')) {
      let socket = this.get('websockets').socketFor('ws://' + location.host + '/api/v1/ws/updates');
      socket.on('open', this.updateChannelOpened, this);
      socket.on('message', this.updateMessage, this);
      socket.on('close', this.updateChannelClosed, this);
      this.set('socket', socket);
    }
    if (transition.intent.url == '/') {
      let today = new Date();
      this.replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
    }
  },
  updateChannelOpened(event) {
    console.log(`Infochannel opened at: ${new Date().toJSON()}`);
  },
  updateMessage: function(message) {
    let update = JSON.parse(message.data);
    if (update.action == "set session id") {
      let session = this.get('store').peekRecord('session', 42);
      session.set('originatorID', update.payload.data.attributes.originatorID);
    }
    else if (update.action == 'add' || update.action == 'update') {
      this.get('store').pushPayload(update.payload);
      if (update.action == 'add') {
        let object = this.get('store').peekRecord(update.payload.data.type, update.payload.data.id);
        this.get('messageBus').publish('add', object);
      }
    }
    else if (update.action == 'delete') {
      let object = this.get('store').peekRecord(update.payload.data.type, update.payload.data.id);
      if (object) {
        if (!object.get('isDeleted')) {
          object.unloadRecord();
          console.log('unloaded object of type: ' + update.payload.data.type + ' with id: ' + update.payload.data.id);
          this.get('messageBus').publish('delete', object);
        }
        else {
          console.log('object of type: ' + update.payload.data.type + ' with id: ' + update.payload.data.id + ' already deleted');
        }
      }
      else {
        console.log('object of type: ' + update.payload.data.type + ' with id: ' + update.payload.data.id + ' not found in store');
      }
    }
  },
  updateChannelClosed(event) {
    this.set('socket', null);
    console.log(`Infochannel closed at: ${new Date().toJSON()}`);
  }
});
