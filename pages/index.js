import axios from "axios"

function App() {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await axios.get(`http://localhost:3000/api/auth`)
    console.log(data)
    window.location.href = data
  }

  return (
    <div className="App">
      <button type="submit" onClick={handleSubmit}>
        You Tube Upload
      </button>
    </div>
  )
}

export default App
