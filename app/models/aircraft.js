import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  _id: attr(),
  callSign: attr(),
  numberOfSeats: attr()
});
