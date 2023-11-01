import confetti from 'canvas-confetti'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Maze from './components/Maze'
import Player from './components/Player'

import { questions } from './data.json'

const CONFETTI_CONFIG = {
  particleCount: 200,
  spread: 70,
  origin: { y: 0.6 }
}

function App () {
  const initialMazeData = [
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 5, 0, 1, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 5, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [1, 0, 5, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 5, 0, 0, 1, 0, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 5],
    [0, 0, 0, 1, 1, 1, 5, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 3]
  ]

  const [mazeData, setMazeData] = useState(initialMazeData)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [showModal, setShowModal] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver || showModal) return

      const { key } = event
      let newX = playerPosition.x
      let newY = playerPosition.y

      if (
        key === 'ArrowUp' &&
        playerPosition.y > 0 &&
        mazeData[playerPosition.y - 1][playerPosition.x] !== 1
      ) {
        newY = playerPosition.y - 1
      } else if (
        key === 'ArrowDown' &&
        playerPosition.y < mazeData.length - 1 &&
        mazeData[playerPosition.y + 1][playerPosition.x] !== 1
      ) {
        newY = playerPosition.y + 1
      } else if (
        key === 'ArrowLeft' &&
        playerPosition.x > 0 &&
        mazeData[playerPosition.y][playerPosition.x - 1] !== 1
      ) {
        newX = playerPosition.x - 1
      } else if (
        key === 'ArrowRight' &&
        playerPosition.x < mazeData[0].length - 1 &&
        mazeData[playerPosition.y][playerPosition.x + 1] !== 1
      ) {
        newX = playerPosition.x + 1
      }

      if (newX !== playerPosition.x || newY !== playerPosition.y) {
        if (mazeData[newY][newX] === 3) {
          setGameOver(true)
          confetti(CONFETTI_CONFIG)
        }

        if (mazeData[newY][newX] === 5)
          window.setTimeout(() => setShowModal(true), 100)

        const newMazeData = [...mazeData]
        newMazeData[playerPosition.y][playerPosition.x] = 0

        if (newX === 0 && newY === 0) newMazeData[newY][newX] = 2
        else newMazeData[newY][newX] = 4

        setPlayerPosition({ x: newX, y: newY })
        setMazeData(newMazeData)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [gameOver, mazeData, playerPosition, showModal])

  const question = useMemo(
    () => questions[currentQuestionIndex],
    [currentQuestionIndex]
  )

  const restartGame = () => {
    setGameOver(false)
    setMazeData(initialMazeData)
    setCurrentQuestionIndex(0)
    setPlayerPosition({ x: 0, y: 0 })
  }

  const handleQuestionAnswer = (answerId) => {
    if (answerId === question.correctAnswer) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowModal(false)
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  const handleKeyPress = (key) => {
    const event = new KeyboardEvent('keydown', { key })
    window.dispatchEvent(event)
  }

  return (
    <main>
      <h1>Escape the QA Maze</h1>
      <button type='button' onClick={restartGame}>Restart</button>

      <div className='legend'>
        <div className='legend-item'>
          <div className='maze-cell start'></div>
          <span>Start</span>
        </div>
        <div className='legend-item'>
          <div className='maze-cell exit'></div>
          <span>Exit</span>
        </div>
        <div className='legend-item'>
          <div className='maze-cell player'></div>
          <span>Player</span>
        </div>
        <div className='legend-item'>
          <div className='maze-cell wall'></div>
          <span>Wall</span>
        </div>
      </div>

      <p>Use the arrow keys to move the player to the exit.</p>

      {showModal && (
        <div className='modal-background'>
          <dialog open>
            <h3> {question.question}</h3>
            <br />
            {question.answers.map((answer) => (
              <button
                key={answer.id}
                className='answer'
                onClick={() => handleQuestionAnswer(answer.id)}
              >
                {answer.answer}
              </button>
            ))}
          </dialog>
        </div>
      )}

      {gameOver && (
        <div className='modal-background'>
          <dialog open>
            <h2>
              ¡Felicidades! Escapaste del QA Maze y demostraste ser un experto
              en el arte de encontrar errores y responder preguntas difíciles.
              Ahora, ve y encuentra la &apos;salida&apos; en el laberinto de la
              vida real. ¡Buena suerte en tu búsqueda! 😄🔍✨
            </h2>
          </dialog>
        </div>
      )}

      {playerPosition.x === 0 && playerPosition.y === 0 && <Player />}

      <Maze mazeData={mazeData} />

      <div className='key-board'>
        <button className='key' onClick={() => handleKeyPress('ArrowLeft')}>
          ←
        </button>
        <button className='key' onClick={() => handleKeyPress('ArrowUp')}>
          ↑
        </button>
        <button className='key' onClick={() => handleKeyPress('ArrowDown')}>
          ↓
        </button>
        <button className='key' onClick={() => handleKeyPress('ArrowRight')}>
          →
        </button>
      </div>
    </main>
  )
}

export default App
