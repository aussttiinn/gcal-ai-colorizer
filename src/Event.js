/**
 * Constructs options for retrieving calendar events.
 *
 * @param {string} [pageToken] - The page token for pagination.
 * @returns {Object} - The options object to be used for retrieving calendar events.
 */
function getOptions(pageToken) {
    var now = new Date();
    var TIME_DIFF = 60 * 60 * 1000; // 1 hour in milliseconds
    var earlier = new Date(now.getTime() - TIME_DIFF);

    var options = {
        updatedMin: earlier.toISOString(),
        maxResults: 50,
        orderBy: 'updated',
        singleEvents: true,
        showDeleted: false
    };

    if (pageToken) {
        options.pageToken = pageToken;
    }

    return options;
}

/**
 * Retrieves the last edited calendar event for the active user.
 *
 * @returns {CalendarEvent} - The last edited calendar event. https://developers.google.com/apps-script/reference/calendar/calendar-event 
 * @throws {Error} - Throws an error if no events are found or if the iteration count exceeds the maximum allowed.
 */
function getLastEditedEvent() {
    Logger.log("Retrieving the last edited calendar event.");

    var calendarId = Session.getActiveUser().getEmail();
    var events;
    var pageToken;
    var allEvents = [];
    var maxIterations = 3; // Safeguard to prevent infinite loop
    var iterationCount = 0;

    do {
        var options = getOptions(pageToken);
        events = Calendar.Events.list(calendarId, options);

        if (events.items && events.items.length > 0) {
            allEvents = allEvents.concat(events.items);
        }

        pageToken = events.nextPageToken || null;
        Logger.log(`PageToken: ${pageToken}`);
        iterationCount++;
    } while (pageToken && iterationCount <= maxIterations); // For some reason it will keep going

    // Check if no events were found
    if (allEvents.length === 0) {
        Logger.log("No events found.");
        throw new Error("No events found");
    } else {
        Logger.log("Events found.");
        // Sort events by updated time to get the most recently updated one
        allEvents.sort(function(a, b) {
            return new Date(b.updated) - new Date(a.updated);
        });
        var lastEvent = allEvents[0];
        Logger.log(JSON.stringify(lastEvent));
        return CalendarApp.getCalendarById(calendarId).getEventById(lastEvent.id);
    }
}