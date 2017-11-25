import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  websockets: Ember.inject.service(),
  i18n: Ember.inject.service(),
  model() {
    let socket = this.get('websockets').socketFor('ws://' + location.host + '/api/v1/ws/updates');
    socket.on('open', this.updateChannelOpened, this);
    socket.on('message', this.updateMessage, this);
    socket.on('close', this.updateChannelClosed, this);
    return RSVP.hash({
        aircraft: this.get('store').findAll('aircraft'),
        pilots: this.get('store').findAll('pilot'),
        flights: this.get('store').findAll('flight')
    });
  },
  updateChannelOpened(event) {
    console.log(`Infochannel opened at: ${new Date().toJSON()}`);
  },
  updateMessage: function(message) {
    let update = JSON.parse(message.data);
    if (update.action == "set session id") {
      let json = '{ "data": { "id": 42, "type": "session", "attributes": { "originator-id": "' + update.payload.data.attributes.originatorID + '"} } }';
      this.get('store').pushPayload(JSON.parse(json));
    }
    else if (update.action == 'add') {
      let object = this.get('store').peekRecord(update.payload.data.type, update.payload.data.id);
      if (!object) {
        this.get('store').pushPayload(update.payload);
      }
    }
    else if (update.action == 'update') {
      this.get('store').pushPayload(update.payload);
    }
    else if (update.action == 'delete') {
      let object = this.get('store').peekRecord(update.payload.data.type, update.payload.data.id);
      if (object) {
        if (!object.get('isDeleted')) {
          object.unloadRecord();
          console.log('unloaded object of type: ' + update.payload.data.type + ' with id: ' + update.payload.data.id);
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
    console.log(`Infochannel closed at: ${new Date().toJSON()}`);
  }
});
