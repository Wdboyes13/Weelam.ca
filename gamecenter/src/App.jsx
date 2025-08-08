import { useState } from 'react'
import './App.css'

function App() {

  return (
    <>
      <h1>My Games!</h1>
      <div className="card-container">
        <ACard Title="Square Game" Description="Be a square & Get chased by squares" Link="https://weelam.ca/squaregame" />
        <ACard Title="DevWordle" Description="Like Wordle, but for nerds" Link="devwordle.weelam.ca" />
      </div>
    </>
  )
}

function ACard({ Title, Description, Link }) {
  return (
    <button
      className="board-row card"
      onClick={() => window.location.href = Link}
    >
      <h2>{Title}</h2>
      <br />
      <sub>{Description}</sub>
    </button>
  )
}

export default App
