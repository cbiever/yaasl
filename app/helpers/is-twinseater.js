import { helper } from '@ember/component/helper';

export function isTwinseater(aircraft) {
  return aircraft[0] && aircraft[0].numberOfSeats == 2;
}

export default helper(isTwinseater);
