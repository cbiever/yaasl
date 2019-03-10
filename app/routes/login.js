import BaseRoute from "./baseRoute";

export default class extends BaseRoute {

  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(
      () => {
        let today = new Date();
        this.replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
      },
      () => { console.log('not logged in') });
  }

}
