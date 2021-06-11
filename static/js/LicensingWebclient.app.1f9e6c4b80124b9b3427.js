(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[19],{

/***/ "2JeG":
/*!**************************************************!*\
  !*** ./modules/LicensingWebclient/js/manager.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),

		Settings = __webpack_require__(/*! modules/LicensingWebclient/js/Settings.js */ "lRcT"),
		
		bAdminUser = App.getUserRole() === Enums.UserRole.SuperAdmin
	;
	
	Settings.init(oAppData);
	
	if (bAdminUser)
	{
		return {
			start: function (ModulesManager) {
				var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F");
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						__webpack_require__.e(/*! require.ensure | admin-bundle */ 13).then((function() {
								resolve(__webpack_require__(/*! modules/LicensingWebclient/js/views/LicensingAdminSettingsView.js */ "GmMD"));
							}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					},
					Settings.HashModuleName,
					TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_LICENSING_SETTINGS_TAB')
				]);
			}
		};
	}
	
	return null;
};


/***/ }),

/***/ "lRcT":
/*!***************************************************!*\
  !*** ./modules/LicensingWebclient/js/Settings.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'Licensing',
	HashModuleName: 'licensing',
	
	LicenseKey: '',
	TrialKeyLink: '',
	PermanentKeyLink: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var 
			oModuleDataSection = oAppData['LicensingWebclient'],
			oServerModuleDataSection = oAppData[this.ServerModuleName]
		;
		
		if (!_.isEmpty(oServerModuleDataSection))
		{
			this.LicenseKey = Types.pString(oServerModuleDataSection.LicenseKey, this.LicenseKey);
		}
		
		if (!_.isEmpty(oModuleDataSection))
		{
			this.TrialKeyLink = Types.pString(oModuleDataSection.TrialKeyLink, this.TrialKeyLink);
			this.PermanentKeyLink = Types.pString(oModuleDataSection.PermanentKeyLink, this.PermanentKeyLink);
		}
	},
	
	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {string} sLicenseKey
	 */
	update: function (sLicenseKey)
	{
		this.LicenseKey = sLicenseKey;
	}
};


/***/ })

}]);