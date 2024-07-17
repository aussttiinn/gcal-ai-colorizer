var Trigger = {
    calendarId: null,
    triggerUid: null,
    authMode: null
}

/** 
 * Maps an event category to a corresponding color in google calendar
 * https://developers.google.com/apps-script/reference/calendar/event-color 
 */
var EventCategories = {
    "Work": 5,
    "Health": 6,
    "Education": 9,
    "Travel": 3,
    "Finance": 10,
    "Social": 7,
    "Miscellaneous": 8
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
