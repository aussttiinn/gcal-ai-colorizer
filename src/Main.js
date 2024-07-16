var Trigger = {
    calendarId: null,
    triggerUid: null,
    authMode: null
}

var EventCategories = {
    // Key: category, value: int representing a color in GoogleCalendar
    "Work": 1,
    "Personal": 2,
    "Family": 3,
    "Fitness": 4,
    "Health": 5,
    "Education": 6,
    "Travel": 7,
    "Finance": 8,
    "Social": 9,
    "Hobbies": 10,
    "Miscellaneous": 11
};

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

    // Get the last edited event
    lastUpdatedEvent = getLastEditedEvent();

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
        Logger.log("Event color set to: " + EventCategories[category]);
    } else {
        Logger.log("Invalid response received: " + JSON.stringify(response));
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