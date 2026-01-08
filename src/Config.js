const APICONFIG = {
    // API Keys
    GEMINI_API_KEY: PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') || '**NOT SET**',
    OPENAI_API_KEY: PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY') || '**NOT SET**',
    
    // Model IDs
    GEMINI_MODEL_ID: PropertiesService.getScriptProperties().getProperty('GEMINI_MODEL_ID') || "gemini-flash-lite-latest",
    OPENAI_MODEL_ID: PropertiesService.getScriptProperties().getProperty('OPENAI_MODEL_ID') || "gpt-3.5-turbo",
    
    // Provider Switch
    API_PROVIDER: (PropertiesService.getScriptProperties().getProperty('API_PROVIDER') || 'GEMINI').toUpperCase(),
};

/** 
 * Maps an event category to a corresponding color in google calendar
 * https://developers.google.com/apps-script/reference/calendar/event-color 
 */
const EventCategories = {
    "Work": 5,
    "Health": 6,
    "Education": 9,
    "Travel": 3,
    "Finance": 10,
    "Social": 7,
    "Miscellaneous": 8
};
