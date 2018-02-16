import React from 'react';
import './Timer.css';

class Timer extends React.Component {
    componentDidMount() {
        if (this.props.status) {
            this.timer_run();
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.duration <= 0) {
            window.clearInterval(this.timer);
        }
    }
    
    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    timer_run() {
        this.timer = window.setInterval(() => {
            if (this.props.status) {
                this.props.timeCallback(this.props.duration - 1);
            }
        }, 1000);

        if (this.props.status) {
            return this.timer;
        }
    }

    toMinutes(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds - mins * 60);
        return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
    }
    
    render() {
        const time = this.toMinutes(this.props.duration);

        return (
            <div className="Timer">
                <span>{time}</span>
            </div>
        );
    }
}

export default Timer;