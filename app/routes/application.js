import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Ember.Route.extend(AuthenticationChecker, {
  store: Ember.inject.service(),
  websockets: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  init() {
    this._super(...arguments);
    this.get('messageBus').subscribe('loggedIn', this, this.loggedIn);
    this.get('messageBus').subscribe('loggedOff', this, this.loggedOut);
  },
  loggedIn() {
    RSVP.hash({
      locations: this.get('store').findAll('location'),
      aircraft: this.get('store').findAll('aircraft'),
      pilots: this.get('store').findAll('pilot'),
      pilotRoles: this.get('store').findAll('pilotRole'),
      costSharings: this.get('store').findAll('costSharing')
    }).then(() => {
      this.get('messageBus').publish('storeInitialized');
      if (!this.get('socket')) {
        let socket = this.get('websockets').socketFor('wss://' + location.host + '/api/v1/ws/updates', [ this.get('session').get('authorization').substring(7), 'Yaasl' ]);
        socket.on('open', this.updateChannelOpened, this);
        socket.on('message', this.updateMessage, this);
        socket.on('close', this.updateChannelClosed, this);
        this.set('socket', socket);
      }
    });
  },
  loggedOut() {
    this.get('session').clearAuthorization();
    if (this.get('socket')) {
      this.get('socket').close();
    }
    this.transitionTo('logged-off');
  },
  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(() => {
      if (transition.intent.url == '/') {
        let today = new Date();
        this.replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
      }
    },
    () => {
      this.transitionTo('login');
    });
  },
  updateChannelOpened() {
    console.log(`Infochannel opened at: ${new Date().toJSON()}`);
  },
  updateMessage: function(message) {
    let update = JSON.parse(message.data);
    if (update.action == "set session id") {
      this.get('session').set('originatorID', update.payload.data.attributes.originatorID);
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
  updateChannelClosed() {
    this.set('socket', null);
    console.log(`Infochannel closed at: ${new Date().toJSON()}`);
  },
  actions: {
    error(error, transition) {
      if (!this.handleAuthenticationError(error)) {
        console.log('error: ', error);
      }
    }
  }
});
