// ==UserScript==
// @name         Kartenicons verkleinern
// @version      1.0
// @description  Verkleinerung der Gruppenicons auf der Karte
// @author       catonbook
// @match        https://*.die-staemme.de/game.php?*&screen=map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// ==/UserScript==

(function () {
	'use strict';

	function updateIconStyle() {
		const mapIcons = document.querySelectorAll('img[id^="map_icons_"]');
		let marginLeft = 0;
		let count = 0;
		let prevId = '';
		const idCountMap = {};

		mapIcons.forEach(function (icon, index) {
			if (index > 0 && icon.id === prevId) {
				count++;
			} else {
				count = 0;
			}
			idCountMap[icon.id] = count;
			prevId = icon.id;
		});

		let marginTop = 20;

		mapIcons.forEach(function (icon) {
			icon.style.width = '12px';
			icon.style.height = '12px';

			const currentCount = idCountMap[icon.id];

			mapIcons.forEach(function (innerIcon, index) {
				innerIcon.style.width = '12px';
				innerIcon.style.height = '12px';

				if (index > 0 && mapIcons[index].id === mapIcons[index - 1].id) {
					count++;
					if (count % 4 === 0) {
						marginLeft = 4;
						marginTop += 12;
					}
				} else {
					marginLeft = 4;
					marginTop = 10;
					count = 0;
				}

				if (idCountMap[innerIcon.id] <= 3) {
					marginTop = 20;
				}

				innerIcon.style.marginLeft = marginLeft + 'px';
				innerIcon.style.marginTop = marginTop + 'px';
				marginLeft += 12;
			});
		});
	}

	function observeMapChanges() {
		updateIconStyle();
		const mapContainer = document.querySelector('#map_wrap');
		if (!mapContainer) return;

		const observer = new MutationObserver(function (mutationsList) {
			updateIconStyle();
		});

		const observerConfig = {
			childList: true,
			subtree: true,
		};

		observer.observe(mapContainer, observerConfig);
	}
	observeMapChanges();
})();
