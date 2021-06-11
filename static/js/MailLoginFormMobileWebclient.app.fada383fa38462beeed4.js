(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "/Fo3":
/*!************************************************************!*\
  !*** ./modules/MailLoginFormMobileWebclient/js/manager.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),

		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),

		bAnonimUser = App.getUserRole() === Enums.UserRole.Anonymous
	;

	if (!ModulesManager.isModuleAvailable('CoreMobileWebclient'))
	{
		return null;
	}

	if (!App.isPublic() && bAnonimUser)
	{
		return {
			/**
			 * Returns login view screen.
			 */
			getScreens: function () {
				var
					oScreens = {},
					ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
					sHashModuleName = ModulesManager.run('MailLoginFormWebclient', 'getHashModuleName')
				;

				if (Types.isNonEmptyString(sHashModuleName))
				{
					oScreens[sHashModuleName] = function () {
						var oLoginScreenView = ModulesManager.run('MailLoginFormWebclient', 'getLoginScreenView');
						if (oLoginScreenView)
						{
							oLoginScreenView.ViewTemplate = 'MailLoginFormMobileWebclient_LoginView';
						}
						return oLoginScreenView;
					};
				}

				return oScreens;
			}
		};
	}

	return null;
};


/***/ })

}]);