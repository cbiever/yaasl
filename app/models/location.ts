import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default class Location extends Model.extend({
  icao: attr('string'),
  name: attr('string')
}) { }
