require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// a route to handle fetching "about us" info
app.get('/about-us', (req, res) => {
  try {
    const aboutContent = {
      title: 'About Us',
      bio: 'Hi! My name is Abigail Ibarra, and I am a senior at New York University studying Neural Science with minors in Computer Science, Web Programming and Applications, and Child and Adolescent Mental Health Studies.\n\nAt NYU, I have been actively involved in the Mexican Student Association (MexSA), where I previously served as Vice President and Historian, as well as Hall Council, where I served as Director of Events. I have lived on campus throughout my time at NYU, residing at Lafayette Hall since my sophomore year. For the past two years, I have worked as a Resident Assistant (RA) at Lafayette Hall, and last summer, I was a Summer Assistant at Coral Towers. With these experiences, I’ve become very familiar with NYU’s residential life.\n\nBeyond my campus involvement, I have worked as a Product Researcher at a New York City-based startup developing a debate-focused social media platform. In this role, I applied data analysis skills and deepened my understanding of social media addiction and reward systems.\n\nAcademically and professionally, I am passionate about biotechnology, particularly in the field of brain-machine interfaces.\n\nI was born and raised in Austin, Texas, with my parents and three sisters. In my free time, I enjoy exploring the city, meeting new people, playing Stardew Valley, listening to music, and hanging out with friends.',
      image: 'https://drive.google.com/uc?export=view&id=1zjNxuJOl-uRokDVG1_NL4ncE6Cy2Xzj2',
    }
    res.json({
      about: aboutContent,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve about info',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
