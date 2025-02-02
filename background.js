let lastTabId = null;
let currentTabId = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (currentTabId !== activeInfo.tabId) {
    lastTabId = currentTabId;
    currentTabId = activeInfo.tabId;
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "switch_recent_tab") {
    switchToLastTab();
  }
});

function switchToLastTab() {
  if (lastTabId) {
    chrome.tabs.update(lastTabId, { active: true });
  } else {
	  alert("No recent tab found");
  }
}
