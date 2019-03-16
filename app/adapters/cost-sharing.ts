import ApplicationAdapter from './application';

export default class CostSharing extends ApplicationAdapter {

  buildURL(): string {
     return '/api/v1/rs/flights/costSharings';
   }

}
