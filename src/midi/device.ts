import midi from "easymidi";
import _ from "lodash";
const promptSync = require('prompt-sync')();

const newDeviceName = 'Chris Midi Device'

export const getDevice: (b: boolean) => midi.Input = useNew => {

  return useNew ? getNewDevice() : getExistingDevice()
}

const getNewDevice: () => midi.Input = () => {

  console.log(`Creating a new MIDI device [${newDeviceName}]`)

  const input = new midi.Input(newDeviceName, true);

  console.log(`Created a new MIDI device [${newDeviceName}]`)

  return input
}

const getExistingDevice: () => midi.Input = () => {

  const midiDevices: Array<string> = midi.getInputs()

  console.log("Midi devices:")

  _.forEach(midiDevices, (device: string, index: any) => {
    console.log(` - [${index}] - ${device}`)
  })
  console.log()

  const midiIndex = promptSync('Which MIDI input would you like to use? ');

  const device = midiDevices[midiIndex]

  console.log()
  console.log(`Connecting to MIDI device [${device}]`)

  const input = new midi.Input(device);

  console.log(`Connected to MIDI device [${device}]`)

  return input
}
