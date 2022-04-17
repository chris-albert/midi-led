import {getDevice} from "./device";
import {Channel} from "easymidi";
import {getLEDControl, LEDControl} from "./led/LedControl";

const input = getDevice(false)

const listenChannel: Channel = 0

const redNote   = 0
const greenNote = 1
const blueNote  = 2

const midiToLed: (n: number) => number = n => (2 * n)

const showFromMidi: (c: LEDControl, a: [number | undefined, number | undefined, number | undefined]) => void =
  (control, [red, green, blue]) => {
    control.color([
      midiToLed(red || 0),
      midiToLed(green || 0),
      midiToLed(blue || 0)
    ])
    control.show()
  }

getLEDControl(false)
  .then(ledControl => {
    input.on('noteon', ({note, velocity, channel}) => {
      console.log({note, velocity, channel})
      if(channel === listenChannel) {
        if(note === redNote) {
          showFromMidi(ledControl, [velocity, undefined, undefined])
        } else if(note === greenNote) {
          showFromMidi(ledControl, [undefined, velocity, undefined])
        } else if(note === blueNote) {
          showFromMidi(ledControl, [undefined, undefined, velocity])
        }
      }
    })

    input.on('noteoff', ({note, velocity, channel}) => {
      if(channel === listenChannel) {
        // if(note === redNote) {
        //   showFromMidi(ledControl, [0, undefined, undefined])
        // } else if(note === greenNote) {
        //   showFromMidi(ledControl, [undefined, 0, undefined])
        // } else if(note === blueNote) {
        //   showFromMidi(ledControl, [undefined, undefined, 0])
        // }
      }
    })
  })

setTimeout(function() {
  console.log(`Closing connection to MIDI device`)
  input.close()
}, 100000);