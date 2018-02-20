import React, { Component } from 'react';
import Sound from 'react-sound';
import './Game.css';
import './helpers.css';
import {select_sound} from './helpers.js';
import Timer from './Timer.js';
import lives from './img/lives.png'
import sounds from './sounds.js';

const Word = require('./words.json');
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

            // display
            display: true,

            // my answer
            myAnswer: '',

            // sentences for player and value for compare
            word: '',
            objWord: '',
            correct: '',
            readWord: '',

            // score
            score: 0,

            //lives
            lives: ''
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
        this.removeListeners=this.removeListeners.bind(this);
        this.addListeners=this.addListeners.bind(this);
        this.onEnd=this.onEnd.bind(this);
        this.handleFinishedPlaying = this.handleFinishedPlaying.bind(this);
    }

    componentDidMount() {
        this.newGame();

        // add key listener
        this.addListeners();
    }

    componentWillUnmount() {
        // remove key listener
        this.removeListeners();
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

    // remove listeners
    removeListeners(){
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    // add listeners
    addListeners() {
        this.newGame();
        // add key listener
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    // generate random object from json array
    generateNewWord(Arr) {
        let randomNumber = Math.floor(Math.random() * Arr.length);
        let generateWord = Arr[randomNumber];
        return generateWord;
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
            // read sentence
            case 18: // alt
                e.preventDefault();
                if (!this.state.voices) return;
                this.readerSentences();
            break;

            // my answer "y"
            case 37: // arrow left
                e.preventDefault();
                this.setState({
                    myAnswer: 'y',
                    timerRun: false
                });
                this.compareAnswers();
            break;

            // my answer "i"
            case 39: // arrow right
                e.preventDefault();
                this.setState({
                    myAnswer: 'i',
                    timerRun: false
                });
                this.compareAnswers();
            break;

            default:
                break;
        }
    }

    // generate next sentence and replace (y,ý,i,í) to '_'
    generateNext () {
        let objWord = this.generateNewWord(Word);
        let newWord = objWord.word;
        let correct = objWord.correct;
        let a = newWord.split(' ').map((word)=> {
            const index = word.toLowerCase().lastIndexOf("b");
            let replace = word;
            if(word[index+1] ==="i" || word[index+1] ==="y" || word[index+1] ==="í" || word[index+1] ==="ý" ) {
                replace=word.substr(0,index+1) + "_" + word.substr(index+2);
            }
            return replace;

        }).join(' ');

        this.setState({
            objWord:objWord,
            word: a,
            readWord: newWord,
            correct: correct,
        });
    }

    // reader sentences
    readerSentences () {
        let sentence = this.state.readWord;
        window.responsiveVoice.speak("Tvoje věta je " + " " + sentence, "Czech Female", {onend: this.onEnd});
    }

    // compare my answer with correct answer
    compareAnswers () {
        let correctAnswer = this.state.correct;
        let myAnswer = this.state.myAnswer;
        let lives = this.state.lives;
        let newScore = this.state.score + 5;

        if (myAnswer === correctAnswer) {
            this.setState({
                soundStatus: 'play',
                soundName: 'success',
                score: newScore,
            });
            this.generateNext();
            if (lives > 0) {
                this.readerSentences();
            }
        } else {
            this.setState({
                soundStatus: 'play',
                soundName: 'failure',
                lives: this.state.lives - 1,
            });
            this.generateNext();
            if (lives === 1) {
                this.setState({
                    timerRun: false,
                    playing: false
                });
                window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
            }
            if (lives > 1) {
                this.readerSentences();
            }
        }


        if (lives === 0) {
            this.setState({
                timerRun: false,
                playing: false
            });
            window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
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

    onEnd() {
        this.setState({
            timerRun: true
        });
    }

    // init new game and replace (y,ý,i,í) to '_'
    newGame() {
        window.clearTimeout(this.startGameTimer);
        let objWord = this.generateNewWord(Word);
        let newWord = objWord.word;
        let correct = objWord.correct;

        let a = newWord.split(' ').map((word)=> {
            const index = word.toLowerCase().lastIndexOf("b");
            let replace = word;
            if(word[index+1] ==="i" || word[index+1] ==="y" || word[index+1] ==="í" || word[index+1] ==="ý" ) {
                replace=word.substr(0,index+1) + "_" + word.substr(index+2);
            }
            return replace;

        }).join(' ');
        this.setState({
            playing: false,
            objWord:objWord,
            word: a,
            readWord: newWord,
            correct: correct,
            seconds: SECONDS,
            timerRun: false,
            lives: 3,
            score: 0
        }, () => {

            this.setState({
                playing: true,
                timerRun: true
            });
            this.readerSentences();
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
                    <div className="lives">
                        {this.state.lives}
                        <span> <img src={lives} alt="heart"/></span>
                    </div>
                </header>

                <div className={display ? 'playground__area' : 'playground__area blur'}>
                    <div className="word">
                        <p>{this.state.word}</p>
                    </div>

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