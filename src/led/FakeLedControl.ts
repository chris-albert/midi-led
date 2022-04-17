import {LEDControl} from "./LedControl";

export const FakeLEDControl: () => Promise<LEDControl> = () =>
  Promise.resolve(({
    show() {
      console.log("FakeLEDControl.show")
    },
    color([red, green, blue]) {
      console.log(`FakeLEDControl.color RGB[${red}, ${green}, ${blue}]`)
    }
  }))