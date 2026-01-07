/**
 * Constructs the payload for the Gemini API call based on the given event.
 *
 * @param {Object} event - The event object containing details of the calendar event.
 * @returns {Object} - The payload object to be sent to the Gemini API.
 */
function getPayload(event) {
    var systemcontent = `
        You are an assistant skilled in categorizing calendar events based on these categories: ${Object.keys(EventCategories).join(", ")}
    `;

    var usercontent = `
        Categorize this event: {"title": "${event.getTitle()}", "description": "${event.getDescription()}"}.
        Return ONLY a JSON object: {"category": "CATEGORY_NAME"}
    `;

    var payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    { "text": systemcontent + "\n\n" + usercontent }
                ]
            }
        ],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.1,
            "thinkingConfig": { "thinkingBudget": 0 } // As per your bash example
        }
    };

    return payload;
}

/**
 * Retrieves the OpenAI API key from the script properties.
 * Requires the property "GEMINI_API_KEY" set in script settings
 * @returns {string} - The Gemini API Key.
 */
function getGeminiAPIKey() {
    return PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
}

/**
 * Calls the Gemini API with the given payload and returns the response.
 *
 * @param {Object} payload - The payload object to be sent to the Gemini API.
 * @returns {Object} - The response object from the Gemini API.
 * @throws {Error} - Throws an error if the API call fails.
 */
function callGemini(payload) {
    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    var modelId = "gemini-flash-lite-latest";
    var url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    var options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload),
        'muteHttpExceptions': true
    };

    try {
        var response = UrlFetchApp.fetch(url, options);
        var json = JSON.parse(response.getContentText());
        
        if (response.getResponseCode() !== 200) {
            throw new Error("API Error: " + response.getContentText());
        }

        // Gemini's response structure is: candidates -> content -> parts -> text
        var resultText = json.candidates[0].content.parts[0].text;
        return JSON.parse(resultText);
    } catch (e) {
        Logger.log("Error: " + e.message);
        throw new Error("Failed to call Gemini API");
    }
}

/**
 * Validates the response from the Gemini API.
 *
 * @param {Object} response - The response object from the Gemini API.
 * @returns {boolean} - True if the response is valid, false otherwise.
 */
function isValid(response) {
    if (response.hasOwnProperty("category")) {
        if (EventCategories.hasOwnProperty(response.category)) {
            return true;
        } else {
            Logger.log("Invalid category in response: " + response.category);
            return false;
        }
    } else {
        Logger.log("Response does not have 'category' property.");
        return false;
    }
}
