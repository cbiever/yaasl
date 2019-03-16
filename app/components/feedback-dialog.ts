import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import Feedback from "../models/feedback";
import DS from "ember-data";

export default class FeedbackDialog extends Component {

  feedback?: Feedback;
  feedbackComment?: string = '';
  show: boolean = false;

  @service messageBus: any;
  @service store!: DS.Store;

  init() {
    super.init();
    this.messageBus.subscribe('showFeedbackDialog', this, this.showFeedbackDialogListener);
  }

  showFeedbackDialogListener() {
    this.set('feedbackComment', '');
    this.set('show', true);
  }

  @action
  closeFeedbackDialog(dialogAction: string) {
    this.set('show', false);
    if (dialogAction == 'ok') {
      let feedback = this.store.createRecord('feedback', { 'feedback': this.feedback, 'comment': this.feedbackComment });
      feedback.save();
    }
  }

}
