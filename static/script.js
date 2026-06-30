// =============================
// Speech Recognition
// =============================

const micBtn = document.getElementById("micBtn");
const speechText = document.getElementById("speechText");
const correctedSentence = document.getElementById("correctSentence");
const feedback = document.getElementById("feedback");

// Check browser support

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    alert("Your browser does not support Speech Recognition.");

}
else {

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    // Microphone Click

    micBtn.addEventListener("click", () => {

        recognition.start();

    });

    // Listening Started

    recognition.onstart = () => {

        micBtn.classList.add("listening");

        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';

    };

    // Result

    recognition.onresult = (event) => {

    const transcript = event.results[0][0].transcript;

    speechText.value = transcript;

    checkGrammar(transcript);

};

    // Stop Listening

    recognition.onend = () => {

        micBtn.classList.remove("listening");

    };

    // Error

    recognition.onerror = (event) => {

        alert("Error : " + event.error);

        micBtn.style.background = "#10E7C4";

    };

}

// ==============================
// Send Text to Flask
// ==============================

async function checkGrammar(text) {

    try {

        const response = await fetch("/check", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })

        });

        const data = await response.json();

        // Show corrected sentence

        correctedSentence.textContent = data.corrected;

        // Clear previous feedback

        feedback.innerHTML = "";

        // No grammar mistakes

        if (data.feedback.length === 0) {

            feedback.innerHTML = `
                <p style="color:lightgreen;">
                    ✅ No grammar mistakes found!
                </p>
            `;

            return;

        }

        // Display each mistake

        data.feedback.forEach(item => {

            feedback.innerHTML += `

                <div class="feedback-card">

                    <h4>Grammar Suggestion</h4>

                    <p>${item.message}</p>

                    <strong>Suggestion:</strong>

                    <span>${item.suggestion}</span>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}


speechText.addEventListener("blur", () => {

    const text = speechText.value.trim();

    if (text !== "") {

        checkGrammar(text);

    }

});