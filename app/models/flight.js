import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  startTime: attr('date'),
  startLocation: belongsTo('location'),
  landingTime: attr('date'),
  landingLocation: belongsTo('location'),
  aircraft: belongsTo('aircraft'),
  pilot1: belongsTo('pilot'),
  pilot1Role: belongsTo('pilotRole'),
  pilot2: belongsTo('pilot'),
  pilot2Role: belongsTo('pilotRole'),
  towPlane: belongsTo('aircraft'),
  towPilot: belongsTo('pilot'),
  towPlaneLandingTime: attr('date'),
  costSharing: belongsTo('costSharing'),
  comment: attr('string'),
  locked: attr('boolean')
});
