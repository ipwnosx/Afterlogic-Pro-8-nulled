(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[43],{

/***/ "Ig+v":
/*!***********************************************************!*\
  !*** ./modules/CoreWebclient/js/views/CHeaderItemView.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "QaF5")
;

function CHeaderItemView(sLinkText)
{
	this.sName = '';
	
	this.visible = ko.observable(true);
	this.baseHash = ko.observable('');
	this.hash = ko.observable('');
	this.linkText = ko.observable(sLinkText);
	this.isCurrent = ko.observable(false);
	
	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.unseenCount = ko.observable(0);
	
	this.allowChangeTitle = ko.observable(false); // allows to change favicon and browser title when browser is inactive
	this.inactiveTitle = ko.observable('');
	
	this.excludedHashes = ko.observableArray([]);
}

CHeaderItemView.prototype.ViewTemplate = 'CoreWebclient_HeaderItemView';

CHeaderItemView.prototype.setName = function (sName)
{
	this.sName = sName.toLowerCase();
	if (this.baseHash() === '')
	{
		this.hash(Routing.buildHashFromArray([sName.toLowerCase()]));
		this.baseHash(this.hash());
	}
	else
	{
		this.hash(this.baseHash());
	}
};

module.exports = CHeaderItemView;


/***/ }),

/***/ "RN6j":
/*!***************************************************!*\
  !*** ./modules/CoreMobileWebclient/js/manager.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5");
	
	if (App.isMobile())
	{
		return {
			start: function (ModulesManager) {
				var
					InformationView = __webpack_require__(/*! modules/CoreWebclient/js/views/InformationView.js */ "2jwK"),
					HeaderView = __webpack_require__(/*! modules/CoreWebclient/js/views/HeaderView.js */ "5zoM"),
					CHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "Ig+v")
				;
				InformationView.ViewTemplate = 'CoreMobileWebclient_InformationView';
				HeaderView.ViewTemplate = 'CoreMobileWebclient_HeaderView';
				CHeaderItemView.prototype.ViewTemplate = 'CoreMobileWebclient_HeaderItemView';
				
				if (ModulesManager.isModuleAvailable('SettingsWebclient')
						&& (App.isUserNormalOrTenant() || App.getUserRole() === Enums.UserRole.SuperAdmin))
				{
					var CommonSettingsFormView = __webpack_require__(/*! modules/CoreWebclient/js/views/CommonSettingsFormView.js */ "skqm");
					CommonSettingsFormView.ViewTemplate = 'CoreMobileWebclient_CommonSettingsFormView';
				}
			}
		};
	}
	
	return null;
};


/***/ })

}]);