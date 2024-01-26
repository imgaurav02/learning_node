import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) // to limit he acceptence of json from server unlimited json receive will overaload server
app.use(express.urlencoded({extended: true, limit: "16kb"})) // to handle the URL params like you search on google gaurav singh but in params it is gaurav+singh or sometimes it will be gaurav%20singh
app.use(express.static("public")) // to handle fevicon type images 
app.use(cookieParser())
export {app}