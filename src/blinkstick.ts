import {BlinkStick, findFirst, ofRGB} from './types/blinkstick'
import {rainbow} from "./animations";

const program: () => void = async () => {
  const led = await findFirst()
  await ledProgram(led)

  console.log("Bye Bye!!")
}

const ledProgram = async (led: BlinkStick) => {
  await led.off(0)
  await led.off(1)
  await rainbow(led)
}

program()
