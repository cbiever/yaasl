import ApplicationAdapter from './application';

export default class extends ApplicationAdapter {

  buildURL() {
     return '/api/v1/rs/flights/costSharings';
   }

}
