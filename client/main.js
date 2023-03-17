$(document).ready(() => {
    $("#createNewBrain").click(async () => {
        $("#loading").show()
        let res = await $.ajax("/upsertBrain",{
            type:'POST',
            data: JSON.stringify({name: $("#name").val(), content:[$("#brain").val()]}),
            contentType: "application/json"
        })
        $("#loading").hide()
        $("#createNewBrain").attr('disabled','disabled')
        $("#brain").hide()
        $("#questionArea").show()
    })

    $("#ask").click(async () => {
        $("#loading").show()
        let res = await $.ajax("/askBrain",{
            type:'POST',
            data: JSON.stringify({name: $("#name").val(), question:$("#question").val()}),
            contentType: "application/json"
        })
        console.log(res)



        $("#mp3_src").attr('src',`getVoice?text=${res.text.split(":")[1]}&voiceId=Ag6Gw0sF8kVq9CAodbG3`)
        $("#audioElement")[0].load()
        $("#audioElement")[0].play()
        $("#answer").text(res.text.split(":")[1])

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