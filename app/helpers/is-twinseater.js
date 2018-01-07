import { helper } from '@ember/component/helper';

export function isTwinseater(aircraft) {
  return aircraft[0] && aircraft[0].get('numberOfSeats') == 2 && !aircraft[0].get('canTow');
}

export default helper(isTwinseater);
