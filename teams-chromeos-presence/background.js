// --- Configuration Constants ---
const ALARM_NAME = "forceTeamsAvailability";
const IDLE_DETECTION_INTERVAL_SECONDS = 120;
const ALARM_PERIOD_MINUTES = 1;

// List of all known Teams URLs to query
const TEAMS_URLS = [
    "https://teams.microsoft.com.mcas.ms/*",
    "https://teams.microsoft.com/*",
    "https://teams.live.com/*",
    "https://gov.teams.microsoft.us/*",
    "https://dod.teams.microsoft.us.mcas-gov.us/*",
    "https://teams.cloud.microsoft/*"
];

// 1. Initialization
// Set at the top level so it configures every time the Service Worker spins up
chrome.idle.setDetectionInterval(IDLE_DETECTION_INTERVAL_SECONDS);

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed/updated. Adding alarm.");
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: ALARM_PERIOD_MINUTES });
});

// 2. Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "log") {
        console.log(request.message);
    }
});

// 3. Event Triggers

// Trigger A: Interval-based (keeps you active while working)
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        checkAndForceAvailability();
    }
});

// Trigger B: State-change based (fires instantly when returning from away)
chrome.idle.onStateChanged.addListener((newState) => {
    if (newState === chrome.idle.IdleState.ACTIVE) {
        console.log("User returned! Forcing availability instantly.");
        forceAvailabilityReal();
    }
});

// 4. Core Logic Functions

function checkAndForceAvailability() {
    chrome.idle.queryState(IDLE_DETECTION_INTERVAL_SECONDS, (idleState) => {
        if (idleState === chrome.idle.IdleState.ACTIVE) {
            forceAvailabilityReal();
        }
    });
}

function forceAvailabilityReal() {
    chrome.tabs.query({ url: TEAMS_URLS }, (tabs) => {
        for (const tab of tabs) {
            console.log(`Teams tab found: ${tab.url}`);

            chrome.scripting.executeScript({
                world: chrome.scripting.ExecutionWorld.MAIN,
                target: { tabId: tab.id },
                function: injectMouseMovement
            }, () => {
                // Prevent silent errors (e.g., if the tab closes right before execution)
                if (chrome.runtime.lastError) {
                    console.warn(`Could not execute script in tab ${tab.id}:`, chrome.runtime.lastError.message);
                }
            });
        }
    });
}

// NOTE: This function gets stringified and injected into the target web page.
// It does NOT share variables or scope with the background script.
function injectMouseMovement() {
    const coordX = 20; // Simulated X movement
    const coordY = window.innerHeight / 2; // Moving in the center vertically

    // Create new mouse event
    const ev = new MouseEvent("mousemove", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: coordX,
        clientY: coordY
    });

    // Send event
    document.dispatchEvent(ev);
    console.log("Teams Availability Extension: Mouse movement simulated.");
}
