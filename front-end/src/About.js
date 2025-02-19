import { useState, useEffect } from 'react'
import axios from 'axios'

/**
* @param {*} param0 an object holding any props passed to this component from its parent component
* @returns
*/

const About = props => {
    const [aboutContent, setAboutContent] = useState('')
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about-us`)
            .then(response => {
                const aboutContent = response.data.about
                setAboutContent(aboutContent)
            })
            .catch(err => {
                const errMsg = JSON.stringify(err, null, 2) // convert error object to a string so we can simply dump it to the screen
                setError(errMsg)
            })
    }, [])

    return (
        <>
            <h1>{aboutContent.title}</h1>
            <p>{aboutContent.bio}</p>
            <img src={aboutContent.image} alt="About Me" style={{ maxWidth: '100%', height: 'auto' }} />
        </>
    )
}

export default About