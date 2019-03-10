import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class extends Component {

  @service messageBus
  @service store

  init() {
    super.init(...arguments);
    this.messageBus.subscribe('showFeedbackDialog', this, this.showFeedbackDialogListener);
  }

  showFeedbackDialogListener() {
    this.set('feedbackComment', '');
    this.set('show', true);
  }

  @action
  closeFeedbackDialog(action) {
    this.set('show', false);
    if (action == 'ok') {
      let feedback = this.store.createRecord('feedback', { 'feedback': this.feedback, 'comment': this.feedbackComment });
      feedback.save();
    }
  }

}
