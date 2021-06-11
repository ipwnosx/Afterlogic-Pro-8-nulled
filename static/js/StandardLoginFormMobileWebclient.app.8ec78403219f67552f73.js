(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

/***/ "/cnp":
/*!****************************************************************!*\
  !*** ./modules/StandardLoginFormMobileWebclient/js/manager.js ***!
  \****************************************************************/
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
					sHashModuleName = ModulesManager.run('StandardLoginFormWebclient', 'getHashModuleName')
				;
				
				if (Types.isNonEmptyString(sHashModuleName))
				{
					oScreens[sHashModuleName] = function () {
						var oLoginScreenView = ModulesManager.run('StandardLoginFormWebclient', 'getLoginScreenView');
						if (oLoginScreenView)
						{
							oLoginScreenView.ViewTemplate = 'StandardLoginFormMobileWebclient_LoginView';
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