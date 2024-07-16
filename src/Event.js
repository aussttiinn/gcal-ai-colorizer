/**
 * Constructs options for retrieving calendar events.
 *
 * @returns {Object} - The options object to be used for retrieving calendar events.
 */
function getOptions() {
    Logger.log("Constructing options for retrieving calendar events.");

    var now = new Date();
    var TIME_DIFF = 60 * 60 * 1000;
    var earlier = new Date(now.getTime() - TIME_DIFF);

    var options = {
        updatedMin: earlier.toISOString(),
        maxResults: 50,
        orderBy: 'updated',
        singleEvents: false,
        showDeleted: false
    };

    Logger.log("Options constructed: " + JSON.stringify(options));
    return options;
}

/**
 * Retrieves the last edited calendar event for the active user.
 *
 * @returns {CalendarEvent} - The last edited calendar event.
 * @throws {Error} - Throws an error if no events are found.
 */
function getLastEditedEvent() {
    Logger.log("Retrieving the last edited calendar event.");

    var options = getOptions();
    var calendarId = Session.getActiveUser().getEmail();
    var events = Calendar.Events.list(calendarId, options);

    if (!events.items || events.items.length === 0) {
        Logger.log("No events found.");
        throw new Error("No events found");
    } else {
        Logger.log("Event found.");
        var _event = events.items[events.items.length - 1];
        return CalendarApp.getCalendarById(calendarId).getEventById(_event.id);
    }
}