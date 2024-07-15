function getOptions() {
    var now = new Date();
    TIME_DIFF = 60 * 60 * 1000;
    var earlier = new Date(now.getTime() - TIME_DIFF)
    return {
        updatedMin: earlier.toISOString(),
        maxResults: 50,
        orderBy: 'updated',
        singleEvents: true,
        showDeleted: false
    }
}

function getLastEditedEvent() {
    // returns https://developers.google.com/apps-script/reference/calendar/calendar-event
    var options = getOptions();
    var calendarId = Session.getEffectiveUser().getEmail();
    var events = Calendar.Events.list(calendarId, options);

    if (!events.items || events.items.length === 0) {
        throw new Error("No events found");
    } else {
        var _event = events.items[events.items.length - 1];
        return CalendarApp.getCalendarById(calendarId).getEventById(_event.id);
    }
}