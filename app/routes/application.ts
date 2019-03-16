import BaseRoute from "./baseRoute";
import RSVP from 'rsvp';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class extends BaseRoute {

  socket: any;

  @service websockets: any;
  @service intl: any;

  init() {
    super.init();
    this.messageBus.subscribe('loggedIn', this, this.loggedIn);
    this.messageBus.subscribe('loggedOff', this, this.loggedOut);
    this.intl.setLocale(navigator.languages[0]);
  }

  loggedIn() {
    RSVP.hash({
      locations: this.store.findAll('location'),
      aircraft: this.store.findAll('aircraft'),
      pilots: this.store.findAll('pilot'),
      pilotRoles: this.store.findAll('pilotRole'),
      costSharings: this.store.findAll('costSharing')
    }).then(() => {
      this.messageBus.publish('storeInitialized');
      if (!this.socket) {
        let socket = this.websockets.socketFor('wss://' + location.host + '/api/v1/ws/updates', [ this.session.authorization!.substring(7), 'Yaasl' ]);
        socket.on('open', this.updateChannelOpened, this);
        socket.on('message', this.updateMessage, this);
        socket.on('close', this.updateChannelClosed, this);
        this.socket = socket;
      }
    });
  }

  loggedOut() {
    this.session.clearAuthorization();
    if (this.socket) {
      this.socket.close();
    }
    this.transitionTo('logged-off');
  }

  beforeModel(transition: any) {
    return this.checkAuthenticated(transition).then(() => {
      if (transition.intent.url == '/') {
        let today = new Date();
        this.replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
      }
    },
    () => {
      this.transitionTo('login');
    });
  }

  updateChannelOpened() {
    console.log(`Infochannel opened at: ${new Date().toJSON()}`);
  }

  updateMessage(message: any) {
    let update = JSON.parse(message.data);
    if (update.action == "set session id") {
      this.session.set('originatorID', update.payload.data.attributes.originatorID);
    }
    else if (update.action == 'add' || update.action == 'update') {
      this.store.pushPayload(update.payload);
      if (update.action == 'add') {
        let object = this.store.peekRecord(update.payload.data.type, update.payload.data.id);
        this.messageBus.publish('add', object);
      }
    }
    else if (update.action == 'delete') {
      let object = this.store.peekRecord(update.payload.data.type, update.payload.data.id);
      if (object) {
        if (!object.isDeleted) {
          object.unloadRecord();
          this.messageBus.publish('delete', object);
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
  }

  updateChannelClosed() {
    this.socket = null;
    console.log(`Infochannel closed at: ${new Date().toJSON()}`);
  }

  @action
  error(error: any) {
    return !this.handleAuthenticationError(error);
  }

}
