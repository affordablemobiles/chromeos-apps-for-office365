try {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.type == "log") {
        console.log(request.message);
      }
    }
  );

  const alarmName = "forceTeamsAvailability";

  chrome.runtime.onInstalled.addListener(async () => {
    console.log("adding alarm"), chrome.alarms.create(alarmName, { periodInMinutes: 1 });
  });

  chrome.alarms.onAlarm.addListener((e) => {
    e.name === alarmName && runForceAvailability();
  });

  function runForceAvailability() {
    //queryAvailability();

    chrome.idle.queryState(120, (idleState) => {
      if (idleState == "active") {
        runForceAvailabilityReal();
      }
    });
  }

  function queryAvailability() {
    chrome.tabs.query({ url: ["https://teams.microsoft.com.mcas.ms/*", "https://teams.microsoft.com/*"] }, function (e) {
      for (tab of e) {
        //console.log("tab found: " + tab.url);
        chrome.scripting.executeScript({ target: { tabId: tab.id }, function: requestQueryAvailability }, () => { });
        return;
      }
      console.log("tab not found");
    });
  }

  function runForceAvailabilityReal() {
    chrome.tabs.query({ url: ["https://teams.microsoft.com.mcas.ms/*", "https://teams.microsoft.com/*", "https://teams.live.com/*", "https://gov.teams.microsoft.us/*", "https://dod.teams.microsoft.us.mcas-gov.us/*"] }, function (e) {
      for (tab of e) {
        console.log("tab found: " + tab.url);
        chrome.scripting.executeScript({ world: "MAIN", target: { tabId: tab.id }, function: requestForceAvailability }, () => { });
      }
    });
  }

  async function requestQueryAvailability() {
    var consolelog = function (msg) {
      chrome.runtime.sendMessage({ type: "log", message: msg });
    };

    try {
      let e;
      for (const b in localStorage)
        if (b.includes("cache.token.https://presence.teams.microsoft.com/")) {
          e = localStorage[b];
          break;
        }
      var d, g, y;
      e
        ? (
          (d = JSON.parse(e).token),
          (check = await fetch("https://presence.teams.microsoft.com/v1/me/presence/", { headers: { "Content-Type": "application/json", Authorization: "Bearer " + d }, method: "GET" })).ok,
          consolelog("presence check: " + (await check.json()).availability)
        )
        : consolelog("couldnt find auth token in local stoage");
    } catch (e) {
      consolelog("HTTP req failed to /presence: " + e);
    }
  }

  function requestForceAvailability() {
    let coordX = 0; // Moving from the left side of the screen
    let coordY = window.innerHeight / 2; // Moving in the center

    // Move step = 20 pixels
    coordX += 20;

    // Create new mouse event
    let ev = new MouseEvent("mousemove", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: coordX,
      clientY: coordY
    });

    // Send event
    document.dispatchEvent(ev);
  }
} catch (s) {
  console.error(s);
}
