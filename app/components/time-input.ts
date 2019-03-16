import Component from '@ember/component';
import { action, observes } from '@ember-decorators/object';

export default class TimeInput extends Component {

  timeRegexp = /(\d{1,2}):{0,1}(\d{2})/
  time?: Date;
  editBuffer: string = '';
  onValid: any;
  errors: any;
  invalid: any;

  init() {
    super.init();
    this.updateEditBuffer();
  }

  @observes('time')
  updateEditBuffer() {
    if (this.time) {
      this.set('editBuffer', this.time.getHours() + ':' + (this.time.getMinutes() < 10 ? '0' + this.time.getMinutes() : this.time.getMinutes()));
    }
  }

  @action
  updateTime() {
    let hoursAndMinutes = this.timeRegexp.exec(this.editBuffer);
    if (hoursAndMinutes) {
      let hours = parseInt(hoursAndMinutes[1]);
      let minutes = parseInt(hoursAndMinutes[2]);
      if (0 <= hours && hours <= 24 && 0 <= minutes && minutes <= 60) {
        this.set('errors', null);
        let time = this.time;
        if (!time) {
          time = new Date();
        }
        time.setHours(hours, minutes);
        this.set('time', time);
        this.updateEditBuffer();
        this.onValid(time);
      }
    }
    else {
      this.set('errors', [ { message: this.invalid } ]);
    }
  }

}
