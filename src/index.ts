import {getDevice} from "./device";
import {Channel} from "easymidi";

const input = getDevice(false)

const listenChannel: Channel = 0

const redNote   = 0
const greenNote = 1
const blueNote  = 2

let red   = 0
let green = 0
let blue  = 0

input.on('noteon', ({note, velocity, channel}) => {
  console.log({note, velocity, channel})
  if(channel === listenChannel) {
    if(note === redNote) {
      red = (velocity * 2) + 1
    } else if(note === greenNote) {
      green = (velocity * 2) + 1
    } else if(note === blueNote) {
      blue = (velocity * 2) + 1
    }
    console.log(`RGB ${[red, green, blue]}`)
  }
})

input.on('noteoff', ({note, velocity, channel}) => {
  if(channel === listenChannel) {
    if(note === redNote) {
      red = 0
    } else if(note === greenNote) {
      green = 0
    } else if(note === blueNote) {
      blue = 0
    }
  }
})

setTimeout(function() {
  console.log(`Closing connection to MIDI device`)
  input.close()
}, 100000);