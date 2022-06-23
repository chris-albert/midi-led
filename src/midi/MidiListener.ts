import {LedStrip} from "../led/LedStrip";
import {ofRGB} from "../types/blinkstick";
import Stream from 'ts-stream'
import {Input, Note} from "easymidi";
import {forAll, hslArr} from "../animations";
import _ from 'lodash'

export const getMidiStream: (d: Input) => Stream<Note> =
  device => {
    const stream = new Stream<Note>()
    device.on('noteon', note => {
      stream.write(note)
    })
    return stream
  }

export type ChannelToControl = Record<number, LedMidiControl>

export const midiStreamDispatcher: (c: ChannelToControl, l: LedMidiMappings) => (n: Note) => Promise<void> =
  (channelToControl, noteToControl) => note => {
    if(channelToControl[note.channel] && noteToControl[note.note]) {
      return noteToControl[note.note](channelToControl[note.channel])(note.velocity, note.note)
    } else {
      return Promise.resolve()
    }
  }

type NoteValue = number

type LedMidiMappings = Record<NoteValue, (m: LedMidiControl) => (v: number, n: number) => Promise<void>>

const simpleMidiMappings: LedMidiMappings = {
  0: c => c.show,
  1: c => c.morph,
  2: c => c.off,
  3: c => c.red,
  4: c => c.green,
  5: c => c.blue,
  6: c => c.white
}

const hslMappings: LedMidiMappings =
  _.fromPairs(forAll(121, i => {
    return [i + 7, (con: LedMidiControl) => con.degrees]
  }))

export const defaultMidiMappings: LedMidiMappings = {
  ...simpleMidiMappings, ...hslMappings
}

export type LedMidiControl = {
  red: (v: number, n: number) => Promise<void>
  green: (v: number, n: number) => Promise<void>
  blue: (v: number, n: number) => Promise<void>
  white: (v: number, n: number) => Promise<void>
  show: (v: number, n: number) => Promise<void>
  morph: (v: number, n: number) => Promise<void>
  off: (v: number, n: number) => Promise<void>
  degrees: (v: number, n: number) => Promise<void>
}

export const ledMidiControl: (strip: LedStrip) => LedMidiControl = (strip) => {

  let red = 0
  let green = 0
  let blue = 0

  const reset = () => {
    red = 0
    green = 0
    blue = 0
  }

  const control: LedMidiControl = {
    red: (v: number, n: number) => {
      red = v * 2
      return Promise.resolve()
    },
    green: (v: number, n: number) => {
      green = v * 2
      return Promise.resolve()
    },
    blue: (v: number, n: number)  => {
      blue = v * 2
      return Promise.resolve()
    },
    white: (v: number, n: number) => {
      return strip.setColor(ofRGB(255, 255, 255)).then(() => reset())
    },
    show: (v: number, n: number) => {
      return strip.setColor(ofRGB(red, green, blue)).then(() => reset())
    },
    morph: (v: number, n: number) => {
      return strip.morph(ofRGB(red, green, blue)).then(() => reset())
    },
    off: (v: number, n: number) => {
      return strip.off().then(() => reset())
    },
    degrees: (v: number, n: number) => {
      const deg = n - 7
      const index = deg === 120 ? 359 : deg * 3
      const color = hslArr[index]
      return strip.setColor(color).then(() => reset())
    }
  }

  return control
}