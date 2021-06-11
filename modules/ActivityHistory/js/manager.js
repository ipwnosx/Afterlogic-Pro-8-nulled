'use strict';

module.exports = function (oAppData) {
	return {
		getShowHistoryPopup: function () {
			return require('modules/%ModuleName%/js/popups/ShowHistoryPopup.js');
		}
	};
};
