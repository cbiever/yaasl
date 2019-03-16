import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default class Pilot extends Model.extend({
  name: attr('string'),
  standardRole: belongsTo('pilotRole'),
  canTow: attr('boolean')
}) { }