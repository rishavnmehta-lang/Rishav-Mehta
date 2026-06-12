from flask import Flask, request, jsonify, send_from_directory
import requests
from prompt_config import build_prompt

app = Flask(__name__)

# ============================================================
# INSTRUCTOR SETUP
# Replace YOUR_TOKEN_HERE with the Hugging Face token.
# Do NOT put the token in index.html, style.css, or script.js.
# ============================================================

API_URL = "https://router.huggingface.co/v1/chat/completions"

headers = {
    "Authorization": "Bearer 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"
}

MODEL_NAME = "deepseek-ai/DeepSeek-R1:novita"
MAX_TOKENS = 256


def query_huggingface(prompt):
    """Sends the prompt to the Hugging Face chat model."""
    response = requests.post(
        API_URL,
        headers=headers,
        json={
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": MODEL_NAME,
            "max_tokens": MAX_TOKENS
        }
    )

    result = response.json()

    # Basic error message for students if something goes wrong
    if "choices" not in result:
        print("Hugging Face error:", result)
        return "The AI had trouble responding. Ask an instructor to check app.py."

    return result["choices"][0]["message"]["content"]


def ask_model(user_message):
    """Builds the business prompt, sends it to the model, and returns the answer."""
    prompt = build_prompt(user_message)
    return query_huggingface(prompt)


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")


@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")


@app.route("/ask", methods=["POST", "OPTIONS"])
def ask():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json()
    user_message = data.get("message", "")

    if user_message.strip() == "":
        return jsonify({"reply": "Please type a question first."})

    ai_response = ask_model(user_message)

    return jsonify({
        "reply": ai_response
    })

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


if __name__ == "__main__":
    app.run(debug=True)
