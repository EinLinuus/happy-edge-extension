let recentTabs = [];
let tabSwitchDelay = 200;
let tabSwitchTimeout = null;
let tabSwitchCount = 0;

chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log("onActivated", activeInfo, recentTabs);
	if(tabSwitchTimeout) {
		return;
	}

	if(recentTabs.length === 0) {
		recentTabs.push(activeInfo.tabId);
		return;
	}

	if(recentTabs[recentTabs.length - 1] === activeInfo.tabId) {
		return;
	}

	// remove the tab from the recentTabs array
	const index = recentTabs.indexOf(activeInfo.tabId);
	if(index !== -1) {
		recentTabs.splice(index, 1);
	}

	// add the tab to the end of the recentTabs array
	recentTabs.push(activeInfo.tabId);
});

chrome.commands.onCommand.addListener((command) => {
	if (command === "switch_recent_tab") {
		switchToLastTab();
	}
});

function switchToLastTab() {
	console.log("switching...", recentTabs);
	if(tabSwitchTimeout) {
		clearTimeout(tabSwitchTimeout);
	}

	tabSwitchCount++;

	setTimeout(() => {
		tabSwitchTimeout = null;

		console.log("Running action for tabSwitchCount", tabSwitchCount);
		if(recentTabs.length >= 1 + tabSwitchCount) {
			chrome.tabs.update(recentTabs[recentTabs.length - 1 - tabSwitchCount], { active: true });
		}

		// Reset
		tabSwitchCount = 0;
	}, tabSwitchDelay);

	return;

	// old
	if(recentTabs.length >= 2) {
		chrome.tabs.update(recentTabs[recentTabs.length - 2], { active: true });
	}
}
