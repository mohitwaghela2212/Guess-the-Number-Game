import { useState } from 'react';

export default function GuessTheNumber() {
  const generateNumber = () => Math.floor(Math.random() * 100) + 1;

  const [target, setTarget] = useState(generateNumber());
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100!');
  const [attempts, setAttempts] = useState(0);
  const [rangeHint, setRangeHint] = useState('1 - 100');
  const [difficulty, setDifficulty] = useState('easy');

  const attemptsMap = {
    easy: 15,
    medium: 10,
    hard: 7,
  };

  const maxAttempts = attemptsMap[difficulty];

  const getHint = (num) => {
    const diff = Math.abs(num - target);

    if (diff === 0) return '🎉 Correct!';
    if (diff <= 5) return '🔥 Very Hot!';
    if (diff <= 10) return '🌡️ Hot!';
    if (diff <= 20) return '🙂 Warm.';
    if (diff <= 40) return '❄️ Cold.';
    return '🧊 Very Cold!';
  };

  const updateRangeHint = (num) => {
    if (num > target) {
      setRangeHint(`1 - ${num - 1}`);
    } else {
      setRangeHint(`${num + 1} - 100`);
    }
  };

  const progressPercent = () => {
    const diff = Math.abs(guess - target);
    let percent = 100 - (diff / 100) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const handleGuess = () => {
    const num = Number(guess);
    if (!num || num < 1 || num > 100) {
      setMessage('⚠️ Enter a number between 1 and 100.');
      return;
    }

    setAttempts(a => a + 1);
    const hint = getHint(num);
    updateRangeHint(num);

    if (num === target) {
      setMessage('🎉 Correct! Starting a new game...');
      resetGame();
    } else if (num > target) {
      setMessage(`⬇️ Too high! ${hint}`);
    } else {
      setMessage(`⬆️ Too low! ${hint}`);
    }

    if (attempts + 1 >= maxAttempts && num !== target) {
      setMessage(`❌ No attempts left! The number was ${target}. Restarting...`);
      resetGame();
    }

    setGuess('');
  };

  const resetGame = () => {
    setTimeout(() => {
      setTarget(generateNumber());
      setAttempts(0);
      setRangeHint('1 - 100');
      setMessage('New game! Guess a number between 1 and 100.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">🎮 Ultimate Guess the Number Game</h1>

      <div className="flex gap-3">
        <button onClick={() => setDifficulty('easy')} className="px-4 py-2 bg-green-600 rounded-xl">Easy</button>
        <button onClick={() => setDifficulty('medium')} className="px-4 py-2 bg-yellow-600 rounded-xl">Medium</button>
        <button onClick={() => setDifficulty('hard')} className="px-4 py-2 bg-red-600 rounded-xl">Hard</button>
      </div>

      <p className="text-lg">Difficulty: <strong>{difficulty.toUpperCase()}</strong></p>
      <p className="text-lg">Attempts: {attempts}/{maxAttempts}</p>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
        <p className="text-md">Possible Range: <strong>{rangeHint}</strong></p>

        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
          className="w-full p-3 rounded-xl text-black focus:outline-none"
        />

        <button
          onClick={handleGuess}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl font-semibold"
        >
          Guess
        </button>

        <div className="text-center text-lg mt-4">{message}</div>

        <div className="w-full bg-gray-700 h-3 rounded-xl overflow-hidden mt-3">
          <div
            className="h-full bg-green-400 transition-all duration-300"
            style={{ width: `${progressPercent()}%` }}
          ></div>
        </div>
        <p className="text-sm text-center">Closeness Meter</p>
      </div>
    </div>
  );
}
