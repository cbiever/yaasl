import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  callSign: attr(),
  competitionNumber: attr(),
  canTow: attr(),
  needsTowing: attr(),
  numberOfSeats: attr()
});
