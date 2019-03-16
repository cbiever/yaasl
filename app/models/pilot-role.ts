import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default class PilotRole extends Model.extend({
    description: attr('string'),
    i18n: attr('string')
}) { }
