(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[41],{

/***/ "DlrD":
/*!**********************************************!*\
  !*** ./modules/S3Filestorage/js/Settings.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'S3Filestorage',
	HashModuleName: 's3-filestorage',
	
	AccessKey: '',
	SecretKey: '',
	Region: '',
	Host: '',
	BucketPrefix: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData[this.ServerModuleName];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.AccessKey = Types.pString(oAppDataSection.AccessKey, this.AccessKey);
			this.SecretKey = Types.pString(oAppDataSection.SecretKey, this.SecretKey);
			this.Region = Types.pString(oAppDataSection.Region, this.Region);
			this.Host = Types.pString(oAppDataSection.Host, this.Host);
			this.BucketPrefix = Types.pString(oAppDataSection.BucketPrefix, this.BucketPrefix);
		}
	},
	
	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {string} sAccessKey
	 * @param {string} sSecretKey
	 * @param {string} sRegion
	 * @param {string} sHost
	 * @param {string} sBucketPrefix
	 */
	update: function (sAccessKey, sSecretKey, sRegion, sHost, sBucketPrefix)
	{
		this.AccessKey = sAccessKey;
		this.SecretKey = sSecretKey;
		this.Region = sRegion;
		this.Host = sHost;
		this.BucketPrefix = sBucketPrefix;
	}
};


/***/ }),

/***/ "GuVt":
/*!*********************************************!*\
  !*** ./modules/S3Filestorage/js/manager.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
		
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),

		Settings = __webpack_require__(/*! modules/S3Filestorage/js/Settings.js */ "DlrD")
	;
	
	Settings.init(oAppData);

	if (App.getUserRole() === Enums.UserRole.SuperAdmin)
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						__webpack_require__.e(/*! require.ensure | admin-bundle */ 13).then((function() {
								resolve(__webpack_require__(/*! modules/S3Filestorage/js/views/S3AdminSettingsView.js */ "BnpE"));
							}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					},
					Settings.HashModuleName,
					TextUtils.i18n('S3FILESTORAGE/LABEL_SETTINGS_TAB')
				]);
			}
		};
	}
	
	return null;
};


/***/ })

}]);