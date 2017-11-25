import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  aircraft: attr(),
  pilot1: attr(),
  pilot2: attr(),
  startTime: attr('date'),
  landingTime: attr('date')
});
