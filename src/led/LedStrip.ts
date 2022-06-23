import {BlinkStick, BlinkStickInfo, RGBColor} from "../types/blinkstick";
import {forAll} from "../animations";

export type LedStrip = {
  size: number
  setColor: (color: RGBColor) => Promise<void>
  morph: (color: RGBColor) => Promise<void>
  off: () => Promise<void>
  getInfo: () => Promise<BlinkStickInfo>
}

export const fromBlinkStick: (b: BlinkStick, s: number) => LedStrip =
  (blink, size) => {
    const strip: LedStrip = {
      size,
      setColor: (color: RGBColor) =>
        Promise.all(forAll(size, i => blink.setColor(color, i))).then(() => {}),
      morph: (color: RGBColor) =>
        Promise.all(forAll(size, i => blink.morph(color, i))).then(() => {}),
      off: () =>
        Promise.all(forAll(size, i => blink.off(i))).then(() => {}),
      getInfo: () =>
        blink.getInfo()

    }
    return strip
  }