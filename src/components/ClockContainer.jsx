import React, { useState, useEffect } from 'react'

const beepSound = {
  src: 'https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'
}

export const ClockContainer = () => {
  const [breakLength, setBreakLength] = useState(5*60)
  const [sessionLength, setSessionLength] = useState(25*60)
  const [timeDisplay, setTimeDisplay] = useState(sessionLength)
  const [timerStart, setTimerStart] = useState(false)
  const [breakStart, setBreakStart] = useState(false)
  // const [operation, setOperation] = useState('')

  const handleStartPause = () => {
    let timeLeft = timeDisplay
    let onBreak = breakStart
    if(!timerStart) {
      let currentTime = timeLeft
      let interval = setInterval(() => {
        if(currentTime === 0 && !onBreak) {
          playSound(true)
          onBreak = true;
          setBreakStart(true)
          currentTime = breakLength
          setTimeDisplay(currentTime)
        } else if(currentTime === 0 && onBreak) {
          playSound(true)
          onBreak = false
          setBreakStart(false)
          currentTime = sessionLength
          setTimeDisplay(currentTime)
        } else {
          currentTime = currentTime - 1
          setTimeDisplay(currentTime)
        }
        
        
        
      }, 1000)
      localStorage.clear()
      localStorage.setItem('interval-id', interval)
    }
    if (timerStart) {
      clearInterval(localStorage.getItem('interval-id'))
    }
    setTimerStart(!timerStart)
  }

  const formatTime = (time) => {
    let minutes = Math.floor( time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    )
  }

  const incrementLength = (type) => {
    if(timerStart) {
      return
    }
    if(type === 'break') {
      if(breakLength >= 60*60) {
        return
      }
      setBreakLength(breakLength + 60)
    } else {
      if(sessionLength >= 60*60) {
        return
      }
      setSessionLength(sessionLength + 60)
      setTimeDisplay(sessionLength + 60)
    }
  }

  const decrementLength = (type) => {
    if(timerStart) {
      return
    }
    if(type === 'break') {
      if(breakLength === 60) {
        return
      }
      setBreakLength(breakLength - 60)
    } else {
      if(sessionLength === 60) {
        return
      }
      setSessionLength(sessionLength - 60)
      setTimeDisplay(sessionLength - 60)
    }
  }

  const resetTime = () => {
    setTimerStart(false)
    setBreakStart(false)
    setBreakLength(5 * 60)
    setSessionLength(25 * 60)
    setTimeDisplay(25 * 60)
    clearInterval(localStorage.getItem('interval-id'))
    playSound(false)
  }

  const playSound = (play) => {
    let audioTag = document.getElementById('beep')
    if(audioTag && play) {
      audioTag.pause()
      audioTag.currentTime = 0
      audioTag.play()
    } else if(audioTag && !play) {
      audioTag.pause()
      audioTag.currentTime = 0
    }
  }

  return (
    <div>
      <div className='clock-container'>
        <div className='title'>25 + 5 Clock</div>
        <div className='controls-container'>
          <div className='break-container flex center column'>
            <div id='break-label'>Break Length</div>
            <div className='break-controls'>
              <div>
                <span id='break-decrement' className='fa-regular fa-circle-down' onClick={() => decrementLength('break')}></span>
                <span id='break-length' className='break-number margin-small' >{breakLength / 60}</span>
                <span id='break-increment' className='fa-regular fa-circle-up' onClick={() => incrementLength('break')}></span>
              </div>
            </div>
          </div>
          <div className='session-container flex center column'>
            <div id='session-label'>Session Length</div>
            <div className='session-controls'>
            <div>
                <span id='session-decrement' className='fa-regular fa-circle-down' onClick={() => decrementLength('session')}></span>
                <span id='session-length' className='session-number margin-small'>{sessionLength / 60}</span>
                <span id='session-increment' className='fa-regular fa-circle-up' onClick={() => incrementLength('session')}></span>
              </div>
            </div>
          </div>
        </div>
        <div className='timer-container flex center column'>
          <div id='timer-label'>{breakStart ? 'Break' : 'Session'}</div>
          <div id='time-left'>{formatTime(timeDisplay)}</div>
          <div className='timer-controls'>
            <div id='start_stop' onClick={handleStartPause} className={(timerStart ? 'fa-solid fa-pause' : 'fa-solid fa-play') + ' margin-small'}></div>
            <div id='reset' className='fa-solid fa-rotate margin-small' onClick={resetTime}></div>
          </div>
        </div>
      </div>
      <audio id='beep' className='clip' src={beepSound.src}></audio>
    </div>
  )
}
