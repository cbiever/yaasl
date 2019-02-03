import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  messageBus: service(),
  store: service(),
  init() {
    this._super(...arguments);
    this.get('messageBus').subscribe('showFeedbackDialog', this, this.showFeedbackDialog);
  },
  showFeedbackDialog() {
    this.set('feedbackComment', '');
    this.set('show', true);
  },
  actions: {
    closeFeedbackDialog(action) {
      this.set('show', false);
      if (action == 'ok') {
        let feedback = this.get('store').createRecord('feedback', { 'feedback': this.get('feedback'), 'comment': this.get('feedbackComment') });
        feedback.save();
      }
    }
  }
});
