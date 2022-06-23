import {BlinkStick, ofRGB, RGBColor, Color} from "./types/blinkstick";
const colorsys = require('colorsys')

export const sleep: (ms: number) => Promise<void> =
  ms => new Promise<void>(res => {
    setTimeout(res, ms)
  })

export const forAll: <A>(num: number, f: (i: number) => A) => Array<A> =
  (num, eachFunc) => {
    const arr = Array(num)
    for (let i = 0; i < num; i++) {
      arr[i] = eachFunc(i)
    }
    return arr
  }

const forAllDegrees: <A>(f: (i: number) => A) => Array<A> =
  eachFunc => forAll(360, eachFunc)

export const hslArr = forAllDegrees(i => {
  const {r, g, b} = colorsys.hslToRgb(i, 100, 50)
  return ofRGB(r, g, b)
})

const forEver: <A>(arr: Array<A>, f: (a: A) => Promise<void>) => Promise<void> = (arr, func) => {
  const len = arr.length
  const loop: (i: number) => Promise<void> =
    index => {
      if(index >= len) {
        return loop(0)
      } else {
        return func(arr[index]).then(() => loop(index + 1))
      }
    }

  return loop(0)
}

export const rainbow: (led: BlinkStick) => Promise<void> =
  led => {
    return forEver(hslArr, rgb =>
      led.setColor(rgb, 1)
        .then(() => sleep(1))
    )
  }

export const allColor: (led: BlinkStick, rgb: RGBColor, num: number) => Promise<void> =
  (led, rgb, num) => Promise.all(forAll(num, i => led.setColor(rgb, i))).then(idk => {})

export const blinkAll: (led: BlinkStick, color: RGBColor, ms: number) => Promise<void> =
  (led, color, ms) => forEver([color, Color.Black], rgb => allColor(led, rgb, 16)
    .then(() => sleep(ms)))