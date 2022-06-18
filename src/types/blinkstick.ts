const jsBlinkstick = require('blinkstick')

export type RGBColor = {
  red: number
  green: number
  blue: number
}

export const ofRGB: (r: number, g: number, b: number) => RGBColor =
  (red, green, blue) => ({red, green, blue})

export const Color = {
  Black: ofRGB(0, 0, 0)
}

export type BlinkStickInfo = {
  serial: string
  manufacturer: string
  product: string
}

export type BlinkStick = {
  setColor: (color: RGBColor, index: number) => Promise<void>
  getColor: (i: number) => Promise<RGBColor>
  morph: (color: RGBColor, index: number) => Promise<void>
  off: (i: number) => Promise<void>
  getSerial: () => Promise<string>
  getManufacturer: () => Promise<string>
  getProduct: () => Promise<string>
  getInfo: () => Promise<BlinkStickInfo>
}

const ofJS: (a: any) => BlinkStick =
  js => {
    const bs: BlinkStick = {
      setColor: (color: RGBColor, index: number) => {
        return new Promise(res => {
          js.setColor(color.red, color.green, color.blue, { index }, res)
        })
      },
      getColor: (index: number) => new Promise(res =>
        js.getColor(index, (arr: any) => res(ofRGB(arr[0], arr[1], arr[2])))
      ),
      morph: (color: RGBColor, index: number) => {
        return new Promise(res => {
          js.morph(color.red, color.green, color.blue, { index }, res)
        })
      },
      off: (index: number) => bs.setColor(Color.Black, index),
      getSerial: () => new Promise(res =>
        js.getSerial((e: any, s: any) => res(s))
      ),
      getManufacturer: () => new Promise(res =>
        js.getManufacturer((e: any, s: any) => res(s))
      ),
      getProduct: () => new Promise(res =>
        js.getDescription((e: any, s: any) => res(s))
      ),
      getInfo: async () => {
        const serial = await bs.getSerial()
        const manufacturer = await bs.getManufacturer()
        const product = await bs.getProduct()
        return {serial, manufacturer, product}
      }
    }

    return bs
  }

export const findFirst: () => Promise<BlinkStick> = () => {
  const maybeFirst = jsBlinkstick.findFirst()
  if(maybeFirst) {
    return Promise.resolve(ofJS(maybeFirst))
  } else {
    return Promise.reject("No Blinksticks found")
  }
}

