var Trigger = {
    calendarId: null,
    triggerUid: null,
    authMode: null
}

/**
 * Validates the API's response
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

/**
 * Routes the event categorization request to the configured AI provider.
 *
 * @param {GoogleAppsScript.Calendar.Schema.Event} lastUpdatedEvent - The calendar event to be categorized.
 * @returns {Object} The parsed JSON response containing the event category.
 * @throws {Error} If the API_PROVIDER in APICONFIG is not recognized.
 */
function callApi(lastUpdatedEvent){
    switch(APICONFIG.API_PROVIDER){
        case('GEMINI'):
            return callGemini(getGeminiPayload(lastUpdatedEvent))
        case('OPENAI'):
            return callOpenAI(getOpenAIPayload(lastUpdatedEvent))
        default:
            throw new Error(`Unexpected API provider: ${APICONFIG.API_PROVIDER}`)
    }
}

/**
 * Handles changes to calendar events.
 *
 * @param {Object} event - The event object containing information about the calendar event change.
 */
function onEventChange(event) {
    Logger.log("Event change detected: " + JSON.stringify(event));

    // Update the Trigger object with event details
    Trigger.calendarId = event["calendarId"];
    Trigger.triggerUid = event["triggerUid"];
    Trigger.authMode = event["authMode"];
    Logger.log("Trigger updated with event details.");

    // Get the last edited event, exit the function if we've edited this event before
    lastUpdatedEvent = getLastEditedEvent();
    if (lastUpdatedEvent.getTag("category")) {
        Logger.log(`Has the tag ${lastUpdatedEvent.getTag("category")}`)
        return; 
    } 

    // Call OpenAI API to categorize the event
    var response = callOpenAI(getPayload(lastUpdatedEvent));
    Logger.log("OpenAI API response: " + JSON.stringify(response));

    // Validate the response and update the event color if valid
    if (isValid(response)) {
        var category = response.category;
        if (lastUpdatedEvent.isRecurringEvent()) {
            lastUpdatedEvent = lastUpdatedEvent.getEventSeries();
            Logger.log("Recurring event series retrieved.");
        }
        lastUpdatedEvent.setColor(EventCategories[category]);
        lastUpdatedEvent.setTag("category", category);
        Logger.log("Event color set to: " + EventCategories[category]);
    } else {
        Logger.log("Invalid response received: " + JSON.stringify(response));
    }
}
