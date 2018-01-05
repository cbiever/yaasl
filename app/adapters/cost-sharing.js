import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL: function(modelName, id, snapshot, requestType, query) {
     return '/api/v1/rs/flights/costSharings';
   }
});
