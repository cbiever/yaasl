import Component from '@ember/component';
import { action, observes } from '@ember-decorators/object';

export default class extends Component {

  timeRegexp = /(\d{1,2}):{0,1}(\d{2})/

  init() {
    super.init(...arguments);
    this.updateEditBuffer();
  }

  @observes('time')
  updateEditBuffer() {
    let time = this.get('time');
    if (time) {
      this.set('editBuffer', time.getHours() + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()));
    }
  }

  @action
  updateTime() {
    let hoursAndMinutes = this.timeRegexp.exec(this.get('editBuffer'));
    if (hoursAndMinutes) {
      let hours = hoursAndMinutes[1];
      let minutes = hoursAndMinutes[2];
      if (0 <= hours && hours <= 24 && 0 <= minutes && minutes <= 60) {
        this.set('errors', null);
        let time = this.get('time');
        if (!time) {
          time = new Date();
        }
        time.setHours(hours, minutes);
        this.set('time', time);
        this.updateEditBuffer();
        this.get('onValid')(time);
      }
    }
    else {
      this.set('errors', [ {message: this.get('invalid')} ]);
    }
  }

}
