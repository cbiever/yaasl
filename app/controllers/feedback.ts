import Controller from '@ember/controller';
import { computed } from '@ember-decorators/object';
import Feedback from "../models/feedback";

export default class extends Controller {

  @computed
  get feedback() {
    let feedback = this.model;
    feedback.forEach((feedback: Feedback) => {
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
  }

}
