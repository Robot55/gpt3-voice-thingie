'user strict';
require('dotenv').config()
const express = require('express')
const fs = require('fs')
const axios = require('axios')

async function getAudio() {
    try {
        let res = await axios(
            {
                method: 'post',
                url: 'https://api.elevenlabs.io/v1/text-to-speech/5aT436ZVbowepjRYiLPL',
                headers: {
                    'accept': 'audio/mpeg',
                    'xi-api-key': 'e909df11621c740db448ca22afe34552',
                    'Content-Type': 'application/json'
                },
                data: {
                    text: 'hello. my name is Inigo Montoya',
                    voice_settings: {
                        stability: 0.7,
                        similarity_boost: 0.7
                    }

                }
            }
        )
    } catch (e) {
        console.log(e)
        console.log("======================")
        console.log("======================")
        console.log("======================")
        console.log(e.message)

    }
}

console.log("starting...")
getAudio();
