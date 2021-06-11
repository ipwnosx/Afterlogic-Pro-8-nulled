(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ "FYyJ":
/*!**********************************************!*\
  !*** ./modules/GMailConnector/js/manager.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		_ = __webpack_require__(/*! underscore */ "F/us"),

		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),

		bAdminUser = App.getUserRole() === Enums.UserRole.SuperAdmin
	;

	if (bAdminUser)
	{
		return {
			start: function (ModulesManager) {
				App.subscribeEvent('MailWebclient::GetOauthConnectorsData', _.bind(function (oParams) {
					if (!_.isArray(oParams.aOauthConnectorsData))
					{
						oParams.aOauthConnectorsData = [];
					}
					oParams.aOauthConnectorsData.push({
						Name: 'Gmail',
						Type: 'gmail',
						IconUrl: 'static/styles/images/modules/GMailConnector/logo_gmail.png'
					})
				}, this));
			}
		};
	}

	return null;
};


/***/ })

}]);