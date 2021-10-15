import nc from "next-connect"
// import connectDB from "../../connectDB"

import onError from "../../middleware/errors"
import formParser from "../../middleware/formParser"
import { uploadVideo } from "../../controllers/videoCont"

const router = nc({ onError })

// connectDB()

export const config = {
  api: {
    bodyParser: false,
  },
}

router.use(formParser).post(uploadVideo)

export default router
