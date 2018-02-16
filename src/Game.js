import React, { Component } from 'react';
import Sound from 'react-sound';
import './Game.css';
import './helpers.css';
import {select_sound} from './helpers.js';
import Timer from './Timer.js';

import sounds from './sounds.js';

var FontAwesome = require('react-fontawesome');


const SECONDS = 60;

class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            // is game on?
            playing: false,

            // time
            seconds: SECONDS,
            timerRun: false,

            // voices
            voices: true,

            // sounds
            sounds: true,
            soundStatus: 'stop',
            soundName: '',

            soundsToPlay: [],

            // display labyrinth
            display: true,

            // player position
            player: {posX: 0, posY:0},

            // score
            score: 0
        };

        this.turnVoices = this.turnVoices.bind(this);
        this.turnSound = this.turnSound.bind(this);

        this.controlDisplay = this.controlDisplay.bind(this);

        this.setTime = this.setTime.bind(this);

        // handle time update from timer
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);

        // handle keys
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // new game function
        this.newGame = this.newGame.bind(this);

        this.handleFinishedPlaying = this.handleFinishedPlaying.bind(this);
    }

    componentDidMount() {
        this.newGame();

        // add key listener
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        // remove key listener
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    // turn voices off/on
    turnVoices() {
        this.setState({
            voices: !this.state.voices
        }, () => !this.state.voices ? window.responsiveVoice.cancel() : window.responsiveVoice.speak(" ", "Czech Female"));

        this.buttonVoices.blur();
    }

    // turn sounds off/on
    turnSound() {
        this.setState({
            sounds: !this.state.sounds
        });       

        this.buttonSounds.blur();
    }

    // display controls - blind mode
    controlDisplay() {
        this.setState({
            display: !this.state.display
        });

        this.buttonDisplay.blur();
    }

    // timer update - to (in/de)crease actual time by specified time (seconds)
    setTime(currentTime, sec) {
        if (this.state.playing) {
            if ((currentTime + sec) > 60) {
                return 60;
            } else if ((currentTime - sec) < 0) {
                return 0;
            } else {
                return currentTime + sec;
            }
        } else {
            return 60;
        }
    }

    controlPos(direction) {
        let player = this.state.player;

        switch(direction) {
            case 'up':
                if (player.top) {
                    this.setState({
                        soundStatus: 'play',
                        soundName: 'failure'
                    });
                    return false;
                } else {
                    return true;
                }
            case 'down':
                if (player.bottom) {
                    this.setState({
                        soundStatus: 'play',
                        soundName: 'failure'
                    });
                    return false;
                } else {
                    return true;
                }
            case 'left':
                if (player.left) {
                    this.setState({
                        soundStatus: 'play',
                        soundName: 'failure'
                    });
                    return false;
                } else {
                    return true;
                }
            case 'right':
                if (player.right) {
                    this.setState({
                        soundStatus: 'play',
                        soundName: 'failure'
                    });
                    return false;
                } else {
                    return true;
                }
            default :
                return null;
        }
    }

    movePlayer(x, y) {
        let newX = this.state.player.posX + x;
        let newY = this.state.player.posY + y;

        if ((newX >= 0 &&  newX <= 10/*gameArray_length*/) && (newY >= 0 && newY <= 10/*gameArray_length*/)) {
            this.setState({
                player: {
                    posX: newX,
                    posY: newY
                }
            }, () => {
                if (newY !== 10/*gameArray_length*/ || newX !== 10/*gameArray_length*/) {
                }
            });

            if (newX === 10/*gameFinish_position*/ && newY === 10/*gameFinish_position*/) {
                let newScore = this.state.score + 10;

                this.setState({
                    soundStatus: 'play',
                    soundName: 'success',

                    player: {
                        posX: 0,
                        posY: 0
                    },

                    score: newScore
                });

            }
        } else {
            this.setState({
                soundStatus: 'play',
                soundName: 'failure'
            });
        }
    }

    // handle keyDown - move player by 'Arrow keys', 'Alt' to read possible directions
    handleKeyDown(e) {
        if (!this.state.playing || !this.state.timerRun) {
            if (e.keyCode === 82) {
                e.preventDefault(); // cancel focus event from turn voices button
                this.newGame();
            } else {
                return;
            }
        }

        switch (e.keyCode) {
            case 82:
            default:
                // refresh
                e.preventDefault(); // cancel focus event from turn voices button
                return this.newGame();
            case 18: // alt
                e.preventDefault();
                if (!this.state.voices) return;
            break;

            // move player up
            case 38:
                e.preventDefault();

                if (this.controlPos("up")) {
                    this.movePlayer(-1, 0);
                }
            break;
            // move player down
            case 40:
                e.preventDefault();

                if (this.controlPos("down")) {
                    this.movePlayer(1, 0);
                }
            break;
            // move player left
            case 37:
                e.preventDefault();

                if (this.controlPos("left")) {
                    this.movePlayer(0, -1);
                }
            break;
            // move player right
            case 39:
                e.preventDefault();

                if (this.controlPos("right")) {
                    this.movePlayer(0, 1);
                }
            break;
        }
    }

    // handle keyUp
    handleKeyUp(e) {
        if (!this.state.playing) return;
    }

    // handle finish sound playing
    handleFinishedPlaying() {
        this.setState({
            soundStatus: 'stop'
        });
    }

    // init new game
    newGame() {
        window.clearTimeout(this.startGameTimer);

        this.setState({
            playing: false,

            seconds: SECONDS,
            timerRun: false,

            player: {posX: 0, posY: 0},

            score: 0
        }, () => {

            this.setState({
                playing: true,
                timerRun: true
            });

            this.buttonRefresh.blur();
        });
    }

    // handle time update
    handleTimeUpdate(seconds) {
        this.setState({
            seconds
        });

        if (seconds === 3) {
            this.setState({
                soundStatus: 'play',
                soundName: 'tick',
            });
        } else if (seconds === 0 || seconds < 0) {
            this.setState({
                playing: false,
                timerRun: false
            });
            
            window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
        }
    }

    render() {
        const {
            playing,
            timerRun,
            seconds,
            display,
            sounds: stateSounds,
            voices
        } = this.state;

        let iconVoices = voices ? <FontAwesome name='toggle-on' size='2x' /> : <FontAwesome name='toggle-off' size='2x' />;
        let iconSounds = stateSounds ? <FontAwesome name='volume-up' size='2x' /> : <FontAwesome name='volume-off' size='2x' />;
        let iconDisplay = display ? <FontAwesome name='eye-slash' size='4x' /> : <FontAwesome name='eye' size='4x' />;

        return (
            <div className="Game">
                <header>
                    {/* <h1>ProjectName<span>Easy</span></h1> */}

                    <div className="options">
                        <button onClick={this.newGame} ref={(buttonRefresh) => { this.buttonRefresh = buttonRefresh; }}>
                            <FontAwesome name='refresh' size='2x' />
                        </button>

                        <button onClick={this.turnSound} ref={(buttonSounds) => { this.buttonSounds = buttonSounds; }}>
                            {iconSounds}
                        </button>

                        <button className="speech-btn" onClick={this.turnVoices} ref={(buttonVoices) => { this.buttonVoices = buttonVoices; }}>
                            {iconVoices}
                            <span>číst</span>
                        </button>
                    </div>
                </header>

                <div className={display ? 'Labyrinth__area' : 'Labyrinth__area blur'}>

                    {
                        !this.state.display
                            ? <div className="overlay"/>
                            : null
                    }

                </div>

                <div className="options options-display">
                    <button onClick={this.controlDisplay} ref={(buttonDisplay) => this.buttonDisplay = buttonDisplay}>
                        {iconDisplay}
                    </button>
                </div>

                {
                    playing && seconds > 0
                    ? <Timer status={timerRun} duration={seconds} timeCallback={this.handleTimeUpdate} />
                    : null
                }

                {
                    !this.state.sounds || this.state.soundStatus !== 'play'
                    ? null
                    : (
                        <Sound
                            url={select_sound(sounds, this.state.soundName).url}
                            playStatus={'PLAYING'}
                            volume={100}
                            onFinishedPlaying={this.handleFinishedPlaying}
                        />
                    )
                }

                <div className="score">
                    {this.state.score}
                    <span> points</span>
                </div>

                <footer>
                    {/* Powered by <a href="http://evalue.cz/">eValue.cz</a> */}
                </footer>
            </div>
        );
    }
}

export default Game;