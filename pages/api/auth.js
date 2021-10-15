import nc from "next-connect"
// import connectDB from "../../connectDB"

import onError from "../../middleware/errors"
// import formParser from "../../../../middlewares/formParser"
import { GoogleAuth } from "../../controllers/videoCont"

const router = nc({ onError })

// connectDB()

export const config = {
  api: {
    bodyParser: false,
  },
}

router.get(GoogleAuth)

export default router
