/**
 * Constructs the payload for the OpenAI API call based on the given event.
 *
 * @param {Object} event - The event object containing details of the calendar event.
 * @returns {Object} - The payload object to be sent to the OpenAI API.
 */
function getPayload(event) {
    var systemcontent = `
        You are an assistant skilled in categorizing calendar events based on the following categories: ${Object.keys(EventCategories)}
    `;

    var usercontent = `
        Categorize the following calendar event object: {"eventTitle": "${event.getTitle()}", "eventDescription": "${event.getDescription()}"}
        
        Return a json object in the following structure: 
        {"category": INSERT_CATEGORY_AS_STRING_HERE}
    `;

    var payload = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: systemcontent
            },
            {
                role: "user",
                content: usercontent
            }
        ],
        response_format: { "type": "json_object" }
    };

    return payload;
}

/**
 * Retrieves the OpenAI API key from the script properties.
 * Requires the property "OPENAI_API_KEY" set in script settings
 * @returns {string} - The OpenAI API key.
 */
function getOpenAIKey() {
    return PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
}

/**
 * Calls the OpenAI API with the given payload and returns the response.
 * Check out privacy policy here: https://openai.com/policies/privacy-policy/ 
 *
 * @param {Object} payload - The payload object to be sent to the OpenAI API.
 * @returns {Object} - The response object from the OpenAI API.
 * @throws {Error} - Throws an error if the API call fails.
 */
function callOpenAI(payload) {
    Logger.log("Calling OpenAI API with payload: " + JSON.stringify(payload));

    var apiKey = getOpenAIKey();
    var url = 'https://api.openai.com/v1/chat/completions';
    var options = {
        method: 'post',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        payload: JSON.stringify(payload)
    };

    try {
        var response = UrlFetchApp.fetch(url, options);
        Logger.log("Response received from OpenAI API");
        var jsonResponse = JSON.parse(response.getContentText());
        var result = jsonResponse.choices[0].message.content;
        var parsedResult = JSON.parse(result);

        return parsedResult;
    } catch (e) {
        Logger.log("Error calling OpenAI API: " + e.message);
        throw new Error("Failed to call OpenAI API");
    }
}

/**
 * Validates the response from the OpenAI API.
 *
 * @param {Object} response - The response object from the OpenAI API.
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
