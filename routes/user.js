import express from "express"
import { signup, signin, signout } from "../controllers/user.js"
import {check} from 'express-validator'
const router = express.Router()

router.post('/signup', [
  check("name", "Name atleast should be 3 characters").isLength({min: 3}),
  check("email", "Email should be valid").isEmail(),
  check("password", "Password at least should be 6 characters").isLength({min: 6}),
] ,signup)

router.post('/signin', signin)

router.get("/signout", signout)

export default router