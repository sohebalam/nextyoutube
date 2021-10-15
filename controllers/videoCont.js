// const fs = require("fs")
import fs from "fs"

// const OAuth2Data = require("../credentials.json")

import OAuth2Data from "../credentials.json"

const path = require("path")

import { google } from "googleapis"

// const { google } = require("googleapis")

const CLIENT_ID = OAuth2Data.web.client_id
const CLIENT_SECRET = OAuth2Data.web.client_secret
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0]

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
)

const SCOPES =
  "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile"

var authed = false
export const GoogleAuth = async (req, res) => {
  if (!authed) {
    // Generate an OAuth URL and redirect there
    var url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    })
    console.log(url)
    // res.render("index", { url: url })
    res.send(url)
  } else {
    var oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    })
    oauth2.userinfo.get(function (err, response) {
      if (err) {
        console.log(err)
      } else {
        console.log(response.data)
        name = response.data.name
        pic = response.data.picture
        res.render("success", {
          name: response.data.name,
          pic: response.data.picture,
          success: false,
        })
      }
    })
  }
}

export const GoogleCallback = async (req, res) => {
  const code = req.query.code
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating")
        console.log(err)
      } else {
        console.log("Successfully authenticated")
        // console.log(tokens)
        oAuth2Client.setCredentials(tokens)

        console.log("oAuth2Client", oAuth2Client)

        authed = true
        res.redirect("http://localhost:3000/upload")
      }
    })
  }
}

export const uploadVideo = async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" })
  }

  const file = req.files.file

  const { title, description } = req.body

  console.log(title, description, file.path)

  // const title = req.body.title
  // const description = req.body.description
  // tags = req.body.tags
  console.log(title)
  console.log(description)
  console.log("oAuth2ClientUpload", oAuth2Client)
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
        body: fs.createReadStream(file.path),
      },
    },
    (err, data) => {
      if (err) throw err
      console.log(data)
      console.log("Done.")
      fs.unlinkSync(file.path)
      // res.send("success", { name: title, success: true })
    }
  )
}
