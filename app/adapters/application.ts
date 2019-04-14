import DS from 'ember-data';
import { inject as service } from '@ember-decorators/service';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import Session from "../services/session";

export default class Application extends DS.JSONAPIAdapter.extend(AdapterFetch) {

  @service session!: Session;
  @service store!: DS.Store;

  namespace = 'api/v1/rs'

  get headers(): any {
    return {
      'X-Originator-ID': this.session.originatorID,
      'Authorization': this.session.authorization
    }
  }

}

