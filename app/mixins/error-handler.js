import Mixin from '@ember/object/mixin';

export default Mixin.create({
  handleError(error) {
    if (error.errors && error.errors.length > 0) {
      this.set('errorMessage', 'status: ' + error.errors[0].status + ' message: ' + error.errors[0].title);
    }
    else if (error.message) {
      this.set('errorMessage', error.message);
    }
    else {
      this.set('errorMessage', 'error saving flight');
    }
    this.set('showError', true);
  }
});
