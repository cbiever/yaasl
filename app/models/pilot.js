import DS from 'ember-data';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  name: attr(),
  standardRole: belongsTo('pilotRole'),
  canTow: attr()
});
