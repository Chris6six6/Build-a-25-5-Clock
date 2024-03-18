import { useState, useEffect, useRef } from 'react';
import Timer from './components/PomodoroTimer';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [play, setPlay] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);

  const intervalRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    if (play) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0) {
            clearInterval(intervalRef.current);
            handleTimerComplete();
            return prevTimeLeft;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [play, timerLabel]);

  useEffect(() => {
    if (timerLabel === 'Session') {
      setTimeLeft(sessionLength * 60);
    } else {
      setTimeLeft(breakLength * 60);
    }
  }, [breakLength, sessionLength, timerLabel]);

  const incrementBreakLength = () => {
    if (!play && breakLength < 60) {
      setBreakLength(prevLength => prevLength + 1);
    }
  };

  const decrementBreakLength = () => {
    if (breakLength > 1 && !play) {
      setBreakLength(prevLength => prevLength - 1);
    }
  };

  const incrementSessionLength = () => {
    if (!play && sessionLength < 60) {
      setSessionLength(prevLength => prevLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1 && !play) {
      setSessionLength(prevLength => prevLength - 1);
    }
    if(sessionLength < 0)
    {
      setTimeLeft(1);
      setSessionLength(1);
    }
  };

  const handlePlayClick = () => {
    setPlay(prevPlay => !prevPlay);
  };

  const reset = () => {
    setPlay(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
    pauseAudio();
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reiniciar la reproducción desde el principio
    }
  };
  const handleTimerComplete = () => {
    if (timerLabel === 'Session') {
      setTimerLabel('Break');
      setTimeLeft(breakLength * 60);
    }
    else {
      setTimerLabel('Session');
      setTimeLeft(sessionLength * 60);
    }
    playAudio(); // Activar el sonido cuando se complete el temporizador
  };

  const playAudio = () => {
    audioRef.current.volume = 0.1; // Ajustar el volumen aquí
    audioRef.current.play();
  };

  const formatTime = timeLeft => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      <h1>25+5 Clock</h1>
      
      <div className='length-control'>
        <div id='break-label'>Break Length</div>
        <button className='button' id="break-decrement" onClick={decrementBreakLength}>-</button>
        <span id="break-length">{breakLength}</span> 
        <button className='button' id="break-increment" onClick={incrementBreakLength}>+</button>
      </div>
        
      <div className='length-control'>
        <div id='session-label'>Session Length</div>
        <button className='button' id="session-decrement" onClick={decrementSessionLength}>-</button>
        <span id="session-length">{sessionLength}</span>
        <button className='button' id="session-increment" onClick={incrementSessionLength}>+</button>
      </div>

      <div className="timer-container">
        <Timer play={play} session={sessionLength*60} tbreak={breakLength*60} label={timerLabel} />
        <div className='timer-wrapper'>
          <div id="timer-label">{timerLabel}</div>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>
      </div>
        
      <audio ref={audioRef}
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />

      <div className='timer-control'>
        <button className='button' id="start_stop" onClick={handlePlayClick}>{play ? <i className="fa-solid fa-stop"> Stop</i> : <i className="fa-solid fa-play"> Start</i>}</button>
        <button className='button' id="reset" onClick={reset}><i className="fa-solid fa-stopwatch"> Reset</i></button>
      </div>
    </div>
  );
}

export default App;