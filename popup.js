chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "get_recent_tabs") {
		const list = document.getElementById("tablist");
		list.innerHTML = "";

		for (let i = 0; i < message.recentTabs.length; i++) {
			const element = document.createElement("li");
			const tabId = message.recentTabs[i];

			element.textContent = message.recentTabs[i];
			const tab = chrome.tabs.get(tabId, (tab) => {
				element.textContent = tab.title;
			});

			element.addEventListener("click", () => {
				chrome.runtime.sendMessage({
					action: "switch_recent_tab",
					offset: i,
				});
			});

			list.appendChild(element);
		}
    }
});

chrome.runtime.sendMessage({ action: "get_recent_tabs" });
