let recentTabs = [];
let tabSwitchDelay = 200;
let tabSwitchTimeout = null;
let tabSwitchCount = 0;

chrome.tabs.onActivated.addListener((activeInfo) => {
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

	// Limit the recentTabs array to 10 items
	if(recentTabs.length > 10) {
		recentTabs.shift();
	}
});

chrome.commands.onCommand.addListener((command) => {
	if (command === "switch_recent_tab") {
		switchToLastTab();
	}
});

function switchToLastTab() {
	if(tabSwitchTimeout) {
		clearTimeout(tabSwitchTimeout);
	}

	tabSwitchCount++;

	setTimeout(() => {
		tabSwitchTimeout = null;

		if(recentTabs.length >= 1 + tabSwitchCount) {
			switchToLastTabOffset(tabSwitchCount);
		}

		// Reset
		tabSwitchCount = 0;
	}, tabSwitchDelay);
}

function switchToLastTabOffset(offset = 1) {
	chrome.tabs.update(recentTabs[recentTabs.length - 1 - offset], { active: true });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "switch_recent_tab") {
		const offset = message.offset || 1;
		switchToLastTabOffset(offset);
    } else if(message.action === "get_recent_tabs") {
		chrome.runtime.sendMessage({
			action: "get_recent_tabs",
			recentTabs,
		});
	}
});
