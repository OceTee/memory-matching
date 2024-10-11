import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./App.css";

function App() {
  const initialCards = [
    { id: 1, value: "A", matched: false },
    { id: 2, value: "B", matched: false },
    { id: 3, value: "C", matched: false },
    { id: 4, value: "A", matched: false },
    { id: 5, value: "B", matched: false },
    { id: 6, value: "C", matched: false },
  ];

  const [cards, setCards] = useState(initialCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [isWinner, setIsWinner] = useState(false); // State for winning status
  const [timer, setTimer] = useState(0); // State for timer
  const [timerActive, setTimerActive] = useState(false); // State to track timer

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    resetGame();
  }, []); // Shuffle cards on mount

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!timerActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const resetGame = () => {
    const shuffledCards = shuffleArray([...initialCards]);
    setCards(shuffledCards.map((card) => ({ ...card, matched: false }))); // Reset matched status
    setFlippedCards([]);
    setDisabled(false);
    setMoveCount(0); // Reset move counter
    setIsWinner(false); // Reset winner status
    setTimer(0); // Reset timer
    setTimerActive(false); // Stop timer
  };

  const handleCardClick = (index) => {
    if (disabled || flippedCards.includes(index)) return;

    setFlippedCards((prev) => [...prev, index]);
    setMoveCount((prev) => prev + 1); // Increment move count

    // Start timer on first click
    if (!timerActive) {
      setTimerActive(true);
    }

    if (flippedCards.length === 1) {
      setDisabled(true);
      setTimeout(() => {
        checkForMatch(flippedCards[0], index);
      }, 1000);
    }
  };

  const checkForMatch = (firstIndex, secondIndex) => {
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.value === secondCard.value) {
      setCards((prevCards) =>
        prevCards.map((card, index) => {
          if (index === firstIndex || index === secondIndex) {
            return { ...card, matched: true };
          }
          return card;
        })
      );
    }

    setFlippedCards([]);
    setDisabled(false);
  };

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      setIsWinner(true);
      setTimerActive(false); // Stop timer
    }
  }, [cards]); // Check for win condition whenever cards change

  return (
    <div className="App">
      <h1>Memory Matching Game</h1>
      <button onClick={resetGame}>Restart Game</button>
      <p>Moves: {moveCount}</p> {/* Display the move count */}
      <p>Time: {timer}s</p> {/* Display the timer */}
      {isWinner && <h2>You won! 🎉</h2>} {/* Winning message */}
      <div className="card-grid">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card.value}
            onClick={() => handleCardClick(index)}
            isFlipped={flippedCards.includes(index) || card.matched}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
