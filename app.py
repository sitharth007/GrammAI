from flask import Flask, render_template, request, jsonify
import language_tool_python

app = Flask(__name__)

# Initialize LanguageTool
tool = language_tool_python.LanguageTool('en-US')


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check():

    data = request.get_json()

    sentence = data.get("text", "")

    matches = tool.check(sentence)

    corrected = language_tool_python.utils.correct(sentence, matches)

    feedback = []

    for match in matches:

        feedback.append({
            "message": match.message,
            "suggestion": match.replacements[0] if match.replacements else "No suggestion"
        })

    return jsonify({
        "corrected": corrected,
        "feedback": feedback
    })


if __name__ == "__main__":
    app.run(debug=True)