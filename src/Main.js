function onEventChange(event) {
    Trigger.calendarId=event["calendarId"];
    Trigger.triggerUid=event["triggerUid"];
    Trigger.authMode=event["authMode"];
    main();
}

function main() {
    lastUpdated = getLastEditedEvent();
    lastUpdated.setColor(getRandomNumber());
}