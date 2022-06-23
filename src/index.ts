import {
  ChannelToControl,
  defaultMidiMappings,
  getMidiStream, ledMidiControl,
  midiStreamDispatcher
} from "./midi/MidiListener";
import {findFirst} from "./types/blinkstick";
import {fromBlinkStick} from "./led/LedStrip";
import {getDevice} from "./midi/device";

const printTransform: <A>(a: A) => A =
  <A>(a: A) => {
    console.log(a)
    return a
  }

const streamProgram: () => void = async () => {

  const led = await findFirst()
  await led.getInfo().then(i => console.log(`Connected to led`, i))
  const strip = fromBlinkStick(led, 16)
  const midiStream = getMidiStream(getDevice(true))
  const channelStripMapping: ChannelToControl = {
    0: ledMidiControl(strip)
  }

  await midiStream
    .map(printTransform)
    .forEach(midiStreamDispatcher(channelStripMapping, defaultMidiMappings))
}

streamProgram()