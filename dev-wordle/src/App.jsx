import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'

const WORDS = [
  "stack", "debug", "token", "array", "crash", "patch", "throw", "clang", "false", "loops",
  "input", "error", "javac", "https", "arm64", "64bit", "32bit", "arm32", "function", "variable",
  "rust", "python", "class", "android", "kotlin", "memory", "cpu", "gpu", "std", "string", "vector",
  "map", "hashmap", "heap", "bus", "core", "thread", "fault", "fork", "swap", "bios", "ram", "rom",
  "io", "tty", "boot", "init", "hash", "salt", "auth", "root", "sudo", "cert", "key", "null", "void",
  "elif", "case", "argv", "argc", "envp", "execve", "else", "main", "bool", "enum", "struct", "byte",
  "char", "true", "this", "self", "gradle", "cmake", "html", "json", "css", "url", "api", "exit",
  "segv", "trap", "warn", "log", "halt", "read", "echo", "type", "bash", "code", "test", "ping",
  "panic", "leak", "modem", "jump", "imap", "dhcp", "ipv6", "tls", "ssl", "ssh", "ntp", "ftp", "arp",
  "icmp", "ethernet", "wifi", "sql", "sip", "nfs", "smb", "vnc", "vpn"
];

window.setAnswerGlobal = (value) => window.theAnswer = value; //VULN: Remove this after testing since it allows
// For devtools to execute `console.log(window.theAnswer)` to show the answer


function App() {

  const [answer, setAnswer] = useState(() =>
    WORDS[Math.floor(Math.random() * WORDS.length)]
  );

  useEffect(() => {
    window.setAnswerGlobal(answer);
  }, [answer]); // See above VULN tag

  const numGuesses = 5;
  const wordLength = answer.length;

  const [board, setBoard] = useState(() =>
    Array.from({ length: numGuesses }, () =>
      Array.from({ length: wordLength }, () => "")
    )
  );
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)

  function handleKeyPress(letter) {
    // Handle Enter (⏎) key to go to the next row
    if (letter === "⏎" && col >= board[0].length) {
      const guess = board[row].join("").toLowerCase();
      
      console.log("Guess:", guess);

      if (guess === answer.toLowerCase()) {
        alert("🎉 Correct!");
        window.location.reload();
      } else {
        // Count how many letters are wrong
        let wrongCount = 0;
        for (let i = 0; i < answer.length; i++) {
          if (guess[i] !== answer[i]) wrongCount++;
        }

        if (row === numGuesses - 1) {
          alert(`You failed, word was: ${answer}`);
          window.location.reload();
          return;
        }

        alert(`❌ Try again! You got ${wrongCount} letter(s) wrong.`);
      }

      setRow(prev => prev + 1);
      setCol(0);
      return;
    }

    if (letter === "ⓧ"){
      if (col === 0) return;
      const newBoard = board.map(row => [...row]); // deep copy

      const newCol = col - 1;
      newBoard[row][newCol] = ""; // delete the last letter
      setBoard(newBoard);
      setCol(newCol);
      return;
    }

    // Block further input if out of bounds
    if (row >= board.length || col >= board[0].length) return

    // Write the letter to the board
    if (letter !== "⏎"){
      const newBoard = [...board]
      newBoard[row][col] = letter
      setBoard(newBoard)
      setCol(prev => prev + 1)
    } else {
      return;
    }
  }

  return (
    <>
    <h1>DevWordle</h1>
    <h3>Like wordle, but for nerds. Over 100 words available</h3>
    <Board board={board} />
    <Keyboard onKeyPress={handleKeyPress} />
    </>
  )
}

function Keyboard({ onKeyPress }) {
  return (
    <>
      <div className="board-row">
        {"0123456789".split("").map((char) => (
          <KeyLetter key={char} letter={char} onClick={onKeyPress} />
        ))}
      </div>
      <div className="board-row">
        {"ABCDEF".split("").map((char) => (
          <KeyLetter key={char} letter={char} onClick={onKeyPress} />
        ))}
      </div>
      <div className="board-row">
        {"GHIJKL".split("").map((char) => (
          <KeyLetter key={char} letter={char} onClick={onKeyPress} />
        ))}
      </div>
      <div className="board-row">
        {"MNOPQR".split("").map((char) => (
          <KeyLetter key={char} letter={char} onClick={onKeyPress} />
        ))}
      </div>
      <div className="board-row">
      </div>
      <div className="board-row">
        {"STUVWX".split("").map((char) => (
          <KeyLetter key={char} letter={char} onClick={onKeyPress} />
        ))}
      </div>
      <div className="board-row">
      </div>
      <div className="board-row">
        {"YZ⏎ⓧ".split("").map((char) => (
          <KeyLetter key={char} letter={char} onClick={onKeyPress} />
        ))}
      </div>
    </>
  )
}

function KeyLetter({ letter, onClick }) {
  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key.toUpperCase();
      const normalized = letter.toUpperCase();

      if (key === normalized) {
        onClick(letter);
      }

      // Add special handling if needed
      if (letter === "⏎" && (e.key === "Enter" || e.key === "Return")) {
        onClick(letter);
      }
      if (letter === "ⓧ" && (e.key === "Backspace" || e.key === "Delete")) {
        onClick(letter);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [letter, onClick]);

  return <button onClick={() => onClick(letter)}>{letter}</button>;
}

function Board({ board }) {
  return (
    <>
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((char, colIndex) => (
            <BoardLetter key={colIndex} value={char} />
          ))}
        </div>
      ))}
    </>
  )
}


function BoardLetter({ value }) {
  return <label className="board-letter">{value}</label>
}

export default App
