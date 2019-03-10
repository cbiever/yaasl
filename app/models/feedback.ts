import DS from 'ember-data';
import attr from 'ember-data/attr';

export default class Feedback extends DS.Model.extend({
  feedback: attr('string'),
  comment: attr('string')
}) { }

declare module "ember-data" {
  interface ModelRegistry {
    feedback: Feedback;
  }
}