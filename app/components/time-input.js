import Ember from 'ember';

export default Ember.Component.extend({
  time: undefined,
  placeholder: undefined,
  missing: undefined,
  invalid: undefined,
  timeRegexp: /(\d{1,2}):{0,1}(\d{2})/,
  editBuffer: undefined,
  init() {
    this._super(...arguments);
    this.updateEditBuffer();
  },
  onTimeChange: Ember.observer('time', function() {
    this.updateEditBuffer();
  }),
  updateEditBuffer: function() {
    let time = this.get('time');
    if (time) {
      this.set('editBuffer', time.getHours() + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()));
    }
  },
  actions: {
    updateTime() {
      let hoursAndMinutes = this.timeRegexp.exec(this.get('editBuffer'));
      if (hoursAndMinutes) {
        let hours = hoursAndMinutes[1];
        let minutes = hoursAndMinutes[2];
        if (0 <= hours && hours <= 24 && 0 <= minutes && minutes <= 60) {
          this.set('errors', null);
          let time = this.get('time');
          if (time) {
            time.setHours(hours, minutes);
          }
          else {
            let now = new Date();
            now.setHours(hours, minutes);
            this.set('time', now);
            time = this.get('time');
          }
          this.get('onValid')(time);
        }
      }
      else {
        this.set('errors', [ {message: this.get('invalid')} ]);
      }
    }
  }
});
