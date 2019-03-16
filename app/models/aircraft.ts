import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default class Aircraft extends Model.extend({
  callSign: attr('string'),
  competitionNumber: attr('string'),
  canTow: attr('boolean'),
  needsTowing: attr('boolean'),
  numberOfSeats: attr('number')
}) { }
