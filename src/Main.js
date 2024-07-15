function onEventChange(event) {
    // set the trigger 
    Trigger.calendarId=event["calendarId"];
    Trigger.triggerUid=event["triggerUid"];
    Trigger.authMode=event["authMode"];

    main(event);
}

function main(event) {
    Logger.log(JSON.stringify(Trigger));
    lastUpdated = getLastEditedEvent();
    Logger.log(JSON.stringify(lastUpdated));
}