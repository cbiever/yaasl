import Controller from '@ember/controller';
import { computed } from '@ember-decorators/object';

export default class extends Controller {

  @computed
  get feedback() {
    let feedback = this.model;
    feedback.forEach(feedback => {
      if (feedback.feedback == 'positive') {
        feedback.icon = 'thumb up'
      }
      else if (feedback.feedback == 'negative') {
        feedback.icon = 'thumb down'
      }
      else {
        feedback.icon = 'thumbs up down'
      }
    });
    return feedback;
  }

}
