import Ember from 'ember';
import Controller from '@ember/controller';

export default Controller.extend({
  feedback: Ember.computed(function() {
    let feedback = this.get('model');
    feedback.forEach(function(feedback) {
      if (feedback.get('feedback') == 'positive') {
        feedback.icon = 'thumb up'
      }
      else if (feedback.get('feedback') == 'negative') {
        feedback.icon = 'thumb down'
      }
      else {
        feedback.icon = 'thumbs up down'
      }
    });
    return feedback;
  }),
});
