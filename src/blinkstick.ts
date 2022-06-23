import {BlinkStick, findFirst, ofRGB} from './types/blinkstick'
import {sleep} from "./animations";
import {fromBlinkStick} from "./led/LedStrip";

const program: () => void = async () => {
  const led = await findFirst()
  await ledProgram(led)

  console.log("Bye Bye!!")
}

const ledProgram = async (led: BlinkStick) => {
  const strip = fromBlinkStick(led, 16)
  await strip.setColor(ofRGB(255, 0, 0))
  await sleep(2000)
  await strip.setColor(ofRGB(0, 255, 0))
  await sleep(2000)
  await strip.setColor(ofRGB(0, 0, 255))
  await sleep(2000)
  await strip.setColor(ofRGB(255, 255, 255))
  await sleep(2000)
  await strip.off()
}

program()
