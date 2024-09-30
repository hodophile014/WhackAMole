import React, { useReducer, useEffect } from "react";

// Game Configurations
const moleCount = 9; // Number of mole holes
const gameDuration = 15000; // Game duration in milliseconds (15 seconds)
const moleDisplayTime = 2000; // How long each mole stays visible

// Initial state for the reducer
const initialState = {
  activeMole: null, // The currently active mole
  score: 0, // Player's score
  timeRemaining: gameDuration / 1000, // Time remaining in seconds
  isGameOver: false, // Whether the game is over
};

function reducer(state, action) {
  switch (action.type) {
    case "start_game":
      return { ...state, isGameOver: false, score: 0, timeRemaining: gameDuration / 1000 };
    case "set_active_mole":
      return { ...state, activeMole: action.payload };
    case "whack_mole":
      if (state.activeMole === action.payload) {
        return { ...state, score: state.score + 1, activeMole: null };
      }
      return state;
    case "decrease_time":
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    case "end_game":
      return { ...state, isGameOver: true, activeMole: null };
    default:
      throw new Error();
  }
}

function WhackAMole() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Randomly set an active mole every moleDisplayTime
  useEffect(() => {
    if (state.isGameOver) return;

    const interval = setInterval(() => {
      const randomMole = Math.floor(Math.random() * moleCount);
      dispatch({ type: "set_active_mole", payload: randomMole });
    }, moleDisplayTime);

    return () => clearInterval(interval);
  }, [state.isGameOver]);

  // Countdown timer
  useEffect(() => {
    if (state.isGameOver || state.timeRemaining === 0) {
      dispatch({ type: "end_game" });
      return;
    }

    const timer = setTimeout(() => {
      dispatch({ type: "decrease_time" });
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.timeRemaining, state.isGameOver]);

  // Start the game when component is mounted
  useEffect(() => {
    dispatch({ type: "start_game" });
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Whack-a-Mole Game</h1>
      <h2>Score: {state.score}</h2>
      <h2>Time Remaining: {state.timeRemaining}s</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {Array.from({ length: moleCount }).map((_, index) => (
          <div
            key={index}
            style={{
              width: "100px",
              height: "100px",
              border: "2px solid #000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: state.activeMole === index ? "brown" : "green",
              cursor: "pointer",
            }}
            onClick={() => dispatch({ type: "whack_mole", payload: index })}
          >
            {state.activeMole === index && <span role="img" aria-label="mole">🐹</span>}
          </div>
        ))}
      </div>

      {state.isGameOver && (
        <div style={{ marginTop: "20px" }}>
          <h2>Game Over! Your Score: {state.score}</h2>
          <button onClick={() => dispatch({ type: "start_game" })}>Restart Game</button>
        </div>
      )}
    </div>
  );
}

export default WhackAMole;
