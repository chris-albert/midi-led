import {BlinkStick, ofRGB} from "./types/blinkstick";
const colorsys = require('colorsys')

export const sleep: (ms: number) => Promise<void> =
  ms => new Promise<void>(res => {
    setTimeout(res, ms)
  })

const forAllDegrees: <A>(f: (i: number) => A) => Array<A> =
  eachFunc => {
    const arr = Array(360)
    for (let i = 0; i < 360; i++) {
      arr[i] = eachFunc(i)
    }
    return arr
  }

const hslArr = forAllDegrees(i => {
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