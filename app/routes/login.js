import Route from '@ember/routing/route';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Route.extend(AuthenticationChecker, {
  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(
      () => {
        let today = new Date();
        this.replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
      },
      () => { console.log('no existing authorization found') });
  }
});
