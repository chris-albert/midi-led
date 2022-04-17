import {FakeLEDControl} from "./FakeLedControl";
import {RealEDControl} from "./RealLEDControl";

export interface LEDControl {
  show(): void,
  color(arr: [number, number, number]): void
}

export const getLEDControl: (useFake: boolean) => Promise<LEDControl> = (useFake) => {

  if(useFake) {
    return FakeLEDControl()
  } else {
    return RealEDControl()
  }

}