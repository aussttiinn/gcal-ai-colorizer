function getOptions() {
    var now = new Date();
    TIME_DIFF = 60 * 60 * 1000;
    var earlier = new Date(now.getTime() - TIME_DIFF)
    return {
        updatedMin: earlier.toISOString(),
        maxResults: 50,
        orderBy: 'updated',
        singleEvents: false,
        showDeleted: false
    }
}

function getRandomNumber() {
    // Math.random() generates a random number between 0 (inclusive) and 1 (exclusive)
    // Multiplying by 11 gives a range from 0 to 10.999...
    // Adding 1 shifts the range to 1 to 11.999...
    // Math.floor() rounds down to the nearest whole number, resulting in a range from 1 to 11
    var randomNumber = Math.floor(Math.random() * 11) + 1;
    Logger.log('Random Number: ' + randomNumber);
    return randomNumber;
}

function getLastEditedEvent() {
    // returns https://developers.google.com/apps-script/reference/calendar/calendar-event
    var options = getOptions();
    var calendarId = Session.getActiveUser().getEmail();
    var events = Calendar.Events.list(calendarId, options);

    if (!events.items || events.items.length === 0) {
        throw new Error("No events found");
    } else {
        var _event = events.items[events.items.length - 1];
        return CalendarApp.getCalendarById(calendarId).getEventById(_event.id);
    }
}