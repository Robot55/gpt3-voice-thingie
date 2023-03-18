let temp_background=`You are Qelline Alderleaf. A wise female halfling of forty-five, Qelline Alderleaf is a pragmatic farmer who seems to know little of what goes on in town. She is a kind host, and is willing to let the characters stay in her hayloft if they don't want to stay at the Stonehill Inn.
Qelline is a longtime friend of a druid named Reidoth. If she figures out that the characters are looking for specific sites in the area, such as Cragmaw Castle or Wave Echo Cave, she suggests that they visit Reidoth and ask for his help, 'since there's not an inch of the land he doesn't know.' She tells the characters that Reidoth recently set out for the ruins of a town called Thundertree, just west of the Neverwinter Wood. The ruins are about fifty miles northwest of Phandalin, and she provides directions so the characters can easily find the place. Qelline's son, Carp, is a spirited and precocious halfling lad of ten years. 
She speaks as a poor medieval peasent with poor language skills`

let temp_name = `Qelline`

$(document).ready(() => {
    $("#name").val(temp_name)
    $("#background").val(temp_background)

    async function start() {
        let res = await $.getJSON("/voices");
        res.map(({voice_id, name}) => {
            $("#voices").append(`<option value='${voice_id}'>${name}</option>`)
        })


    }
    start().catch(console.error)

    $("#createNewBrain").click(async () => {
        $("#loading").show()
        let res = await $.ajax("/upsertBrain",{
            type:'POST',
            data: JSON.stringify({name: $("#name").val(), content:$("#brain").val()}),
            contentType: "application/json"
        })
        $("#loading").hide()
        $("#createNewBrain").attr('disabled','disabled')
        $("#brain").hide()
        $("#questionArea").show()
    })

    let messages = [];

    function updateTextBox() {
        let history = ""
        messages.map((row) => {
            history+=`${row.role}: ${row.content}\n`
        })
        $("#chatHistory").val(history)
        $("#chatHistory")[0].scrollTop = $("#chatHistory")[0].scrollHeight;
    }

    $("#ask").click(async () => {
        let name = $("#name").val()
        if(messages.length==0) {
            messages.push({
                "role": "user",
                "content": `You are a NPC in a roleplaying game. The players, who are an adventuring party, will converse with you. You should answer in the form of dialogue for ${name}, keeping your answers brief and revealing as little information as possible.`
            })
            let background = $("#background").val();
            if(background.length>5) {
                let backgrounds = background.split("\n");
                for(let i in backgrounds) {
                    messages.push({
                        "role": "user",
                        "content": backgrounds[i]
                    })
                }
            }
        }
        updateTextBox()
        let start = new Date()-0;
        $("#loading").show()

        messages.push({
            "role": "user",
            "content": $("#question").val()
        })
        updateTextBox()


        let res = await $.ajax("/chat",{
            type:'POST',
            data: JSON.stringify({messages}),
            contentType: "application/json"
        })

        messages = res;
        $("#question").val("");
        updateTextBox()

        let answer = messages[messages.length-1].content


        $("#mp3_src").attr('src',`getVoice?text=${answer}&voiceId=${$("#voices").val()}`)

        $("#audioElement")[0].load()
        $("#audioElement")[0].play()



        $("#loading").hide()
    })

    var recognition = new webkitSpeechRecognition();

    recognition.onresult = function(event) {
        var saidText = "";
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                saidText = event.results[i][0].transcript;
            } else {
                saidText += event.results[i][0].transcript;
            }
        }
        $("#record").css("border","1px solid black")
        // Update Textbox value
        $("#question").val(saidText)
        $("#ask").click();
    }

    $("#record").click(() => {
        $("#record").css("border","3px solid red")
        recognition.start();
    })

})