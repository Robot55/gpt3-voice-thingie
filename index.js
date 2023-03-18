'user strict';
require('dotenv').config()
const express = require('express')
const fs = require('fs')
const axios = require('axios')
const { Readable } = require('stream');
const app = express()

let brains = {}
brains = JSON.parse(fs.readFileSync('./data.json', 'utf-8')) || {}

const service_path = process.env.SERVICE_URL;
const apiKey = process.env.ELEVAN_LABS_API_KEY;

console.log(service_path)
app.use(express.json())
app.use(express.static('client'))


async function getMp3Url(text,voiceId) {
    let res = await axios(
        {
            method: 'POST',
            responseType: "arraybuffer",
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            data: {
                text: text,
                voice_settings: {
                    stability: 0.7,
                    similarity_boost: 0.7
                }

            }
        }
    ).catch(function (error) {
        console.log(error.toJSON());
    })

    return res
}

async function buildIndex(name, content) {
    console.log({background: content, name})
    content = content.replaceAll('"',"").replaceAll("\n","")
    console.log({background: content, name})
    let result = await axios.post(`${service_path}/character`, {background: content, name})
    brains[name] = true
    fs.writeFileSync('./data.json', JSON.stringify(brains), 'utf-8');
    return result
}

function updateIndex(name, content) {
    axios.put(`${service_path}/character`, {update: content, name})

}

app.post(`/upsertBrain`, async (req, res) => {
    const {name, content} = req.body

    let result = await buildIndex(name, content)
    res.json(result.data)
})

app.get('/voices',async (req, res) => {
    let response = await axios(
        {
            method: 'GET',
            url: `https://api.elevenlabs.io/v1/voices`,
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        }
    );

    let answer = response.data.voices.map(({voice_id, name}) => {
        return {voice_id, name}
    })
    console.log(answer)
    res.json(answer)
})

app.post('/chat',async (req, res) => {
    let {messages} = req.body
    let response = await axios.post(`https://api.openai.com/v1/chat/completions`, {
        model:"gpt-3.5-turbo",
        messages
    },{
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        }
    })
    console.log(messages[messages.length-1],response.data.choices[0].message)
    messages.push(response.data.choices[0].message)
    res.json(messages)
})

app.get(`/getVoice`, async (req,res ) => {
    const {text, voiceId} = req.query

    let mp3file = await getMp3Url(text,voiceId)
    const buffer = Buffer.from(mp3file.data);
    res.set({
        'Content-Type': 'audio/mpeg'
    })
    Readable.from(buffer).pipe(res)

})

app.post(`/askBrain`, async (req, res) => {
    let start = new Date()-0;
    let timings = {}

    const {name, question} = req.body
    const questionPrefix = `You are a NPC in a roleplaying game. You are playing as ${name}. The players will converse with you, and you should answer them in two forms: once with the ${name}'s style and personality, using the knowledge that ${name} has. And the second time, act hostile and annoyed with the players. Whenever possible, keep your answers short. \nPlayers: `

    timings["Start of Request to Python"] = new Date()-start
    let result = await axios.post(`${service_path}/queryCharacter`, {
        name,
        query: questionPrefix + question
    })
    timings["Python Return"] = new Date()-start
    console.log(timings)
    res.json({text:result.data, timings})

    updateIndex(name, (result.data)) // don't need to actually wait for the result on this call
})

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`),
)
