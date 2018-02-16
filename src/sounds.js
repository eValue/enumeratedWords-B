import success from './voices/success.mp3'
import failure from './voices/failure.mp3'
import tick from './voices/tick.mp3'

import middle from './voices/middle.mp3'
import dfront from './voices/front.mp3'
import dback from './voices/back.mp3'
import dleft from './voices/left.mp3'
import dright from './voices/right.mp3'

export default [
    {
        name: 'success',
        url: success
    },
    {
        name: 'failure',
        url: failure
    },
    {
        name: 'tick',
        url: tick
    },

    // directions - 3D Sounds
    {
        name: 'middle',
        url: middle
    },
    {
        name: 'front',
        url: dfront
    },
    {
        name: 'back',
        url: dback
    },
    {
        name: 'left',
        url: dleft
    },
    {
        name: 'right',
        url: dright
    },
];