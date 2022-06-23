import {getDevice} from "./midi/device";
const nano = require('nanoseconds')

const input = getDevice(true)

const nanos: () => number =
  () => nano(process.hrtime())

let time = 0

// (60 / BPM) / 96 = ms
// 60 / BPM = ms * 96
// 1 / BPM = (ms * 96) / 60
// BPM = 1 / ((ms * 96) / 60)

const determineBPM: (n: number) => number = ms =>
  1 / ((ms * 24) / 60)

let ticks = 0
input.on('clock', () => {
  const now = nanos()
  const diff = (now - time) / 1000000000
  time = now
  const bpm = determineBPM(diff)
  // console.log(`Clock tick diff [${diff}ns] BPM [${bpm}]`)
  ticks += 1
  if(ticks > 24) {
    ticks = 0
    console.log("Quarter beat")
  }
})

input.on('start', () => {
  console.log("Start")
  time = nanos()
  ticks = 0
})

input.on('continue', () => {
  console.log("Continue")
  time = nanos()
})

input.on('reset', () => {
  console.log("Reset")
})

input.on('stop', () => {
  console.log("Stop")
})

input.on('position', pos => {
  console.log(`Position [${pos}]`)
})

input.on('sysex', pos => {
  console.log(`Sysex [${pos}]`)
})

setTimeout(function() {
  console.log(`Closing connection to MIDI device`)
  input.close()
}, 100000);
