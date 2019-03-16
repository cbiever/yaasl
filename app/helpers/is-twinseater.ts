import Helper from "@ember/component/helper";
import Aircraft from "../models/aircraft";

export default class IsTwinseater extends Helper {

  compute(aircraft: Aircraft[]): boolean {
    return aircraft[0].get('numberOfSeats') == 2 && !aircraft[0].get('canTow');
  }

}