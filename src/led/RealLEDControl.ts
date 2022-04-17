import {LEDControl} from "./LedControl";
const pixel = require("node-pixel");
const five = require("johnny-five");

const opts = {}

export const RealEDControl: () => Promise<LEDControl> = () => {

  return new Promise((resolve, reject) => {
    try {

      const board = new five.Board(opts)
      board.on('ready', () => {

        const strip = new pixel.Strip({
          board: board,
          controller: "I2CBACKPACK",
          strips: [4, 6, 8]
        });

        strip.on("ready", () => {
          resolve(({
            show() {
              strip.show()
            },
            color([red, green, blue]) {
              strip.color([red, green, blue])
            }
          }))
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}