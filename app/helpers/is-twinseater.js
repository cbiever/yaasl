import { helper } from '@ember/component/helper';

export function isTwinseater(aircraft) {
  return aircraft[0] && aircraft[0].get('numberOfSeats') > 1;
}

export default helper(isTwinseater);
