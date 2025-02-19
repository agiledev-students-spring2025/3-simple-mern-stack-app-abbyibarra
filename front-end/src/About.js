import { useState, useEffect } from 'react'
import axios from 'axios'

const About = () => {
    const [aboutContent, setAboutContent] = useState('')

    useEffect(() => {
        axios
            .get('http://localhost:3001/about')
            .then(response => {
                const aboutContent = response.data.about
                setAboutContent(aboutContent)
            })
            .catch(err => {
                const errMsg = JSON.stringify(err, null, 2) // convert error object to a string so we can simply dump it to the screen
                setError(errMsg)
            })
    })

    return (
        <div>
            <h1>{aboutContent.title}</h1>
            <p>{aboutContent.bio}</p>
            <img src={aboutContent.image} alt="About Me" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )
}

export default About