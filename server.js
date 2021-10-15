app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" })
  }

  const file = req.files.file

  const { title, description } = req.body

  console.log(title, description, file)

  const dirPath = path.join(__dirname, "..")

  console.log(dirPath)

  const newpath = dirPath + `/frontend/public/uploads/${file.name}`

  file.mv(newpath, (err) => {
    if (err) {
      console.error(err)
      return res.status(500).send(err)
    }
  })
  res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })

  console.log(title, description, file)

  // const title = req.body.title
  // const description = req.body.description
  // tags = req.body.tags
  console.log(title)
  console.log(description)
  // console.log(tags)
  const youtube = google.youtube({ version: "v3", auth: oAuth2Client })
  console.log(youtube)
  youtube.videos.insert(
    {
      resource: {
        // Video title and description
        snippet: {
          title: title,
          description: description,
          // tags: tags,
        },
        // I don't want to spam my subscribers
        status: {
          privacyStatus: "private",
        },
      },
      // This is for the callback function
      part: "snippet,status",

      // Create the readable stream to upload the video
      media: {
        body: fs.createReadStream(newpath),
      },
    },
    (err, data) => {
      if (err) throw err
      console.log(data)
      console.log("Done.")
      fs.unlinkSync(newpath)
      // res.send("success", { name: title, success: true })
    }
  )
})

app.listen(5000, () => console.log("Server Started..."))

app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.end("Something went wrong")
    } else {
      const { title, description, file } = req.body

      console.log(title, description, file)

      title = req.body.title
      description = req.body.description
      // tags = req.body.tags
      console.log(title)
      console.log(description)
      // console.log(tags)
      const youtube = google.youtube({ version: "v3", auth: oAuth2Client })
      console.log(youtube)
      youtube.videos.insert(
        {
          resource: {
            // Video title and description
            snippet: {
              title: title,
              description: description,
              // tags: tags,
            },
            // I don't want to spam my subscribers
            status: {
              privacyStatus: "private",
            },
          },
          // This is for the callback function
          part: "snippet,status",

          // Create the readable stream to upload the video
          media: {
            body: fs.createReadStream(req.file.path),
          },
        },
        (err, data) => {
          if (err) throw err
          console.log(data)
          console.log("Done.")
          fs.unlinkSync(req.file.path)
          res.render("success", { name: name, pic: pic, success: true })
        }
      )
    }
  })
})

app.get("/logout", (req, res) => {
  authed = false
  res.redirect("/")
})

app.get("/oauth2callback", function (req, res) {
  const code = req.query.code
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating")
        console.log(err)
      } else {
        console.log("Successfully authenticated")
        console.log(tokens)
        oAuth2Client.setCredentials(tokens)

        authed = true
        res.redirect("http://localhost:3000/upload")
      }
    })
  }
})

app.listen(5001, () => {
  console.log("App is listening on Port 5001")
})
