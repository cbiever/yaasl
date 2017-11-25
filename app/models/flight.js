import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
  aircraft: belongsTo('aircraft'),
  pilot1: belongsTo('pilot'),
  pilot2: belongsTo('pilot'),
  startTime: attr('date'),
  landingTime: attr('date')
});
