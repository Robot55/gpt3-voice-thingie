$(document).ready(() => {
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

    $("#ask").click(async () => {
        let start = new Date()-0;
        $("#loading").show()
        let res = await $.ajax("/askBrain",{
            type:'POST',
            data: JSON.stringify({name: $("#name").val(), question:$("#question").val()}),
            contentType: "application/json"
        })
        let timings = res.timings
         timings["Client displays written"] = new Date()-start
        console.log(timings)
        let answer = res.text;
        $("#answer").text(answer)


        timings["Voice Service Start"]= new Date()-start
        $("#audios").html("")
        let chunks = answer.split(". ");
        let html = ""
        for(let i in chunks) {
            html+=`<audio id="audioElement_${i}" preload="auto"><source id="mp3_src_${i}" src="getVoice?text=${chunks[i]}. &voiceId=Ag6Gw0sF8kVq9CAodbG3" type="audio/mp3" /></audio>`

        }
        $("#audios").append(html)

        for(let i in chunks) {
            $(`#audioElement_${i}`)[0].load()
        }

        let currentTrack = 0
        $(`#audioElement_${currentTrack}`)[0].play()
        $(`#audioElement_${currentTrack}`).on("ended", () => {
            currentTrack = currentTrack + 1;
            $(`#audioElement_${currentTrack}`)[0].play()
            $(`#audioElement_${currentTrack}`).on("ended", () => {
                currentTrack = currentTrack + 1;
                $(`#audioElement_${currentTrack}`)[0].play()
            });
        });
        timings["Voice Service End"]= new Date()-start
        console.log(timings)

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