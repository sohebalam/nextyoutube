import React, { useState } from "react"
import axios from "axios"

const Success = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    file: null,
  })

  const handleChange = async (e) => {
    const inputValue =
      e.target.name === "file" ? e.target.files[0] : e.target.value

    setForm({
      ...form,
      [e.target.name]: inputValue,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("form", form)
    const { file, title, description } = form
    var formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("description", description)

    console.log(formData)

    const config = {
      headers: {
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
      },
    }

    const { data } = await axios.post(
      "http://localhost:3000/api/upload",
      formData,
      config
    )

    console.log(data)
  }

  return (
    <div>
      <h1>Upload You Tube Video</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          name="title"
          autoComplete="off"
          placeholder="Title"
        />
        <input
          onChange={handleChange}
          type="text"
          name="description"
          autoComplete="off"
          placeholder="Description"
        />
        <input
          onChange={handleChange}
          accept="video/*"
          type="file"
          name="file"
          placeholder="Add Video"
        />
        <button type="submit">Upload Video</button>
      </form>
    </div>
  )
}

export default Success
