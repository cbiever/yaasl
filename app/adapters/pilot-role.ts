import ApplicationAdapter from './application';

export default class PilotRole extends ApplicationAdapter {

  buildURL(): string {
     return '/api/v1/rs/pilots/roles';
   }

}
