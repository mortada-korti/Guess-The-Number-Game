import "./App.css";
import React, { useState, useEffect } from "react";
import Keys from "./Keys";
import Result from "./Result";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [darkMode, setDarkmode] = useState(true);
  const [level, setLevel] = useState(1);
  const [screen, setScreen] = useState([]);
  const [keys, setKeys] = useState(Keys);
  const [results, setResults] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [wonLvl, setWonLvl] = useState(false);
  const [attempts, setAttempts] = useState(5);
  const [lostGame, setLostGame] = useState(false);
  const [wonGame, setWonGame] = useState(false);

  // handle dark mode
  const handleDarkMode = () => {
    setDarkmode((prevMode) => !prevMode);
  };

  // generate random number
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10);
  };

  // generate the guessing number
  const generateSecretNumber = (lvl) => {
    let arr = [];
    for (let i = 0; i < lvl; i++) {
      let temp = generateRandomNumber();
      if (arr.indexOf(temp) === -1) {
        arr.push(temp);
      } else {
        i--;
      }
    }
    return arr;
  };
  const [secretNumber, setSecretNumber] = useState(generateSecretNumber(level));

  const holdKey = (key) => {
    setGuessed(false);
    if (screen.length < level) {
      setKeys((prevKeys) =>
        prevKeys.map((prevKey) => {
          if (prevKey === key) {
            return { ...prevKey, isHeld: true };
          } else {
            return { ...prevKey };
          }
        })
      );
    }
  };

  const handleClick = (key) => {
    if (guessed) {
      reset();
      setGuessed(false);
    }
    if (screen.length < level) {
      setScreen((prevScreen) => {
        if (!screen.includes(key)) {
          return [...prevScreen, key];
        } else {
          return [...prevScreen];
        }
      });
    }
  };

  useEffect(() => {
    if (guessed) {
      setResults((prevResults) => [...prevResults, screen]);
    }
    if (attempts === 0) {
      setLostGame(true);
    }
  }, [screen, guessed, keys, secretNumber]);

  const reset = () => {
    setGuessed(false);
    setScreen([]);
    setKeys((prevKeys) =>
      prevKeys.map((prevKey) => ({ ...prevKey, isHeld: false }))
    );
  };

  const guess = () => {
    setGuessed(true);
    let counter = 0;
    for (const i of secretNumber) {
      for (const j of screen) {
        if (j.value === i) {
          if (screen.indexOf(j) === secretNumber.indexOf(i)) {
            counter++;
            setScreen((prevKeys) =>
              prevKeys.map((prevKey) => {
                return prevKey.value === j.value
                  ? { ...prevKey, status: "correct" }
                  : { ...prevKey };
              })
            );
          } else {
            setScreen((prevKeys) =>
              prevKeys.map((prevKey) => {
                return prevKey.value === j.value
                  ? { ...prevKey, status: "semi-correct" }
                  : { ...prevKey };
              })
            );
          }
        }
      }
    }
    if (counter === level) {
      setWonLvl(true);
      if (level === 10) {
        setWonGame(true);
      }
    } else {
      setAttempts((prevAttempts) => prevAttempts - 1);
    }
  };

  const next = () => {
    if (level < 10) {
      setWonLvl(false);
      setResults([]);
      reset();
      setLevel((prevLevel) => prevLevel + 1);
      setAttempts((prevAttempts) => prevAttempts + 3);
      setSecretNumber(generateSecretNumber(level + 1));
    } else {
      setWonGame(true);
    }
  };

  const restart = () => {
    reset();
    setLevel(1);
    setAttempts(5);
    setWonGame(false);
    setLostGame(false);
    setWonLvl(false);
    setResults([]);
    setSecretNumber(generateSecretNumber(1));
  };
  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      {wonLvl && <Confetti />}
      <div className="main">
        <div className="results p-2">
          Previous guesses
          {results &&
            results.map((result) => {
              return (
                <div
                  className={`box d-flex justify-content-center`}
                  key={nanoid()}
                >
                  {result.map((e) => (
                    <div key={e.value} className={`${e.status} mx-2`}>
                      {e.value}
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
        <div className="main--head py-3">
          {!lostGame && !wonGame && (
            <>
              <h3 className="head--title">Level: {level}</h3>
              <h3 className="head--title">Attempts: {attempts}</h3>
            </>
          )}
          {lostGame && (
            <h3 className="head--title text-danger mx-auto">You Lost :(</h3>
          )}
          {wonGame && (
            <h3 className="head--title text-success mx-auto">You Won :)</h3>
          )}

          <div className="head--theme">
            <div className="theme--toggle" onClick={handleDarkMode}>
              <div className="toggle--circle"></div>
            </div>
          </div>
        </div>
        <div className="main--screen rounded-3 text-center p-4 my-3">
          {screen.map((key) => (
            <span key={key.value} className={`key text-center ${key.status}`}>
              {key.value}
            </span>
          ))}
        </div>
        <div className="main--keys rounded-3 p-4">
          <div className="numbers">
            {keys.map((key) => (
              <button
                key={key.value}
                onClick={() => {
                  holdKey(key), handleClick(key);
                }}
                className={`${key.isHeld ? "held" : ""}`}
                disabled={key.isHeld || guessed}
              >
                {key.value}
              </button>
            ))}
          </div>
          <div className="keys--controls">
            {!wonLvl && !guessed && (
              <button
                className={`control--reset`}
                disabled={screen.length === 0}
                onClick={reset}
              >
                RESET
              </button>
            )}
            {!wonLvl && !guessed && (
              <button
                className={`control--guess`}
                disabled={screen.length < level}
                onClick={guess}
              >
                GUESS
              </button>
            )}
            {wonLvl && level !== 10 && (
              <button className="next-btn" onClick={() => next()}>
                Next
              </button>
            )}
            {guessed && !wonLvl && !lostGame && (
              <button className="guess-again-btn" onClick={() => reset()}>
                Guess Again
              </button>
            )}
            {lostGame && (
              <button className="play-again-btn" onClick={() => restart()}>
                Play Again
              </button>
            )}
            {wonLvl && level === 10 && (
              <button className="guess-again-btn" onClick={() => restart()}>
                Play Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
