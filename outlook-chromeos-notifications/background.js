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
    console.log("adding alarm"), chrome.alarms.create(alarmName, { periodInMinutes: 0.0041666666666667 }); // 250ms
  });

  chrome.alarms.onAlarm.addListener((e) => {
    e.name === alarmName && runForceAvailability();
  });

  function runForceAvailability() {
    chrome.tabs.query({ url: ["https://outlook.office.com/*", "https://outlook.office365.com/*"] }, function (e) {
      for (tab of e) {
        console.log("tab found: " + tab.url);
        chrome.scripting.executeScript({ world: "MAIN", target: { tabId: tab.id }, function: requestForceAvailability }, () => { });
        return;
      }
      console.log("tab not found");
    });
  }

  function requestForceAvailability() {
    let count = 0;

    try {
      try {
        document.querySelector('div[title="Inbox"]').querySelectorAll('span[class="screenReaderOnly"]').forEach(function (v, i) {
          if (v.innerText == "unread") {
            count = parseInt(v.parentElement.firstChild.innerText, 10);
          }
        });
      } catch (e) {
        //
      }

      navigator.setAppBadge(count);
    } catch (e) {
      console.error(e);
    }
  }
} catch (s) {
  console.error(s);
}
