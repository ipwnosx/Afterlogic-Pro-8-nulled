(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[36],{

/***/ "AzDT":
/*!***********************************!*\
  !*** ./modules/Ios/js/manager.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__(/*! modules/CoreWebclient/js/enums.js */ "VI1e");

module.exports = function (oAppData) {
	var
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		Settings = __webpack_require__(/*! modules/Ios/js/Settings.js */ "EczM"),
		Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "HLSX"),
		iUserRole = App.getUserRole()
	;
	
	Settings.init(oAppData);
	
	return {
		routeToIos: function () {
			if (Browser.iosDevice && iUserRole !== Enums.UserRole.Anonymous && Settings.SyncIosAfterLogin && Settings.AllowIosProfile && $.cookie('skip-ios') !== '1')
			{
				$.cookie('skip-ios', '1');
				window.location.href = '?ios';
			}
		}
	};
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "EVdn")))

/***/ }),

/***/ "EczM":
/*!************************************!*\
  !*** ./modules/Ios/js/Settings.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	
	AppData = window.auroraAppData
;

var Settings = {
	AllowIosProfile: false,
	SyncIosAfterLogin: false,
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var
			oAppDataIosSection = oAppData['Ios']
		;
		
		if (!_.isEmpty(oAppDataIosSection))
		{
			this.AllowIosProfile = Types.pBool(oAppDataIosSection.AllowIosProfile, this.AllowIosProfile);
			this.SyncIosAfterLogin = Types.pBool(oAppDataIosSection.SyncIosAfterLogin, this.SyncIosAfterLogin);
		}
	}
};

Settings.init(AppData);

module.exports = Settings;


/***/ })

}]);