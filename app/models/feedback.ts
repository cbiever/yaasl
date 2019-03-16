import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default class Feedback extends Model.extend({
  feedback: attr('string'),
  comment: attr('string')
}) {

  icon: any;

}