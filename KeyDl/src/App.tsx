import './App.css'

function App() {

  return (
    <>
      <h1>My Public Keys</h1>
      <div className="card-container">
        <ACard Title="Current Dev Public Key" Description="Current public key, for Git Commit Signing & Other Signing" Link="/keys/dev-weelam.asc" />
        <ACard Title="Old Dev Public Key" Description="Old public key, for Git Commit Signing & Other Signing" Link="/keys/olddev-weelam.asc" />
        <ACard Title="Non-Dev Public Key" Description="Public Key used for general encryption" Link="/keys/nondev-weelam.asc" />
      </div>
    </>
  )
}

type CardProps = {
  Title: string,
  Description: string,
  Link: string
};

function ACard({ Title, Description, Link }: CardProps) {
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
