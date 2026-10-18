// NAME: Auto Skip Ads
// AUTHOR: Spicetify contributors
// DESCRIPTION: Auto skip advertisement tracks. Toggle in Profile menu.

/// <reference path="../globals.d.ts" />

(async function AutoSkipAds() {
	if (!Spicetify.LocalStorage) {
		setTimeout(AutoSkipAds, 1000);
		return;
	}
	await new Promise((res) => Spicetify.Events.webpackLoaded.on(res));

	let isEnabled = Spicetify.LocalStorage.get("AutoSkipAds") !== "0";
	let isSkipping = false;

	new Spicetify.Menu.Item("Auto skip ads", isEnabled, (self) => {
		isEnabled = !isEnabled;
		Spicetify.LocalStorage.set("AutoSkipAds", isEnabled ? "1" : "0");
		self.setState(isEnabled);
	}).register();

	Spicetify.Player.addEventListener("songchange", () => {
		if (!isEnabled || isSkipping) return;

		const data = Spicetify.Player.data || Spicetify.Queue;
		if (!data?.item?.metadata) return;

		if (data.item.metadata.is_advertisement === "true") {
			isSkipping = true;
			Spicetify.Player.next();
			setTimeout(() => {
				isSkipping = false;
			}, 400);
		}
	});
})();
