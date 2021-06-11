(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[33],{

/***/ "767o":
/*!**************************************************************************!*\
  !*** ./modules/FilesCutCopyPasteWebclientPlugin/js/views/ButtonsView.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR")
;

/**
 * @constructor
 */
function ButtonsView()
{
	this.copiedItems = ko.observableArray([]);
	this.cuttedItems = ko.observableArray([]);
	this.pasteTooltip = ko.computed(function () {
		var aItems = _.union(this.cuttedItems(), this.copiedItems());
		if (aItems.length > 0)
		{
			return TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/ACTION_PASTE') + ': <br/>' + _.map(aItems, function (oFile) {
				return oFile.fileName();
			}).join(',<br/>');
		}
		else
		{
			return TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/ACTION_PASTE');
		}
	}, this);
	this.storageType = null;
	this.cutButtonModules = ko.observableArray([]);	//list of modules that disable "cut" button
	this.pasteButtonModules = ko.observableArray([]);	//list of modules that disable "paste" button
	this.isDisabledCutButton = ko.computed(function () {
		return this.cutButtonModules().length > 0;
	}, this);
	this.isDisabledPasteButton = ko.computed(function () {
		return this.pasteButtonModules().length > 0;
	}, this);
}

ButtonsView.prototype.ViewTemplate = 'FilesCutCopyPasteWebclientPlugin_ButtonsView';

ButtonsView.prototype.useFilesViewData = function (oFilesView)
{
	this.storageType = oFilesView.storageType;
	this.listCheckedAndSelected = oFilesView.selector.listCheckedAndSelected;
	this.checkedReadyForOperations = oFilesView.checkedReadyForOperations;
	this.moveItems = _.bind(oFilesView.moveItems, oFilesView);
	this.cutCommand = Utils.createCommand(this, function () {
		this.copiedItems([]);
		this.cuttedItems(this.listCheckedAndSelected());
		Popups.showPopup(AlertPopup, [TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/INFO_ITEMS_CUTTED')]);
	}, function () {
		return	!oFilesView.isZipFolder() && this.storageType() !== Enums.FileStorageType.Shared
				&& this.checkedReadyForOperations() && this.listCheckedAndSelected().length > 0
				&& !this.isDisabledCutButton();
	});
	this.copyCommand = Utils.createCommand(this, function () {
		this.copiedItems(this.listCheckedAndSelected());
		this.cuttedItems([]);
		Popups.showPopup(AlertPopup, [TextUtils.i18n('FILESCUTCOPYPASTEWEBCLIENTPLUGIN/INFO_ITEMS_COPIED')]);
	}, function () {
		return	!oFilesView.isZipFolder() && this.storageType() !== Enums.FileStorageType.Shared
				&& this.checkedReadyForOperations() && this.listCheckedAndSelected().length > 0;
	});
	this.pasteCommand = Utils.createCommand(this, function () {
		if (this.cuttedItems().length > 0)
		{
			oFilesView.moveItems('Move', oFilesView.getCurrentFolder(), this.cuttedItems());
			this.cuttedItems([]);
		}
		if (this.copiedItems().length > 0)
		{
			oFilesView.moveItems('Copy', oFilesView.getCurrentFolder(), this.copiedItems());
			this.copiedItems([]);
		}
	}, function () {
		return	!oFilesView.isZipFolder() && this.storageType() !== Enums.FileStorageType.Shared
				&& ((this.cuttedItems().length > 0 || this.copiedItems().length > 0)
				&& !this.isDisabledPasteButton());
	});
	this.savedItemsCount = ko.computed(function () {
		return this.cuttedItems().length + this.copiedItems().length;
	}, this);
	oFilesView.pathItems.subscribe(function () {
		var
			iPathItemsLength = oFilesView.pathItems().length,
			oLastPathItem = oFilesView.pathItems()[iPathItemsLength - 1] || false
		;

		//Disable toolbar buttons for "root" directory of Shared files
		//and for folders with access level "Read"
		if ((!this.isSharedStorage()
			|| (iPathItemsLength !== 0
				&& oLastPathItem.oExtendedProps
				&& oLastPathItem.oExtendedProps.Access
				&& oLastPathItem.oExtendedProps.Access === Enums.SharedFileAccess.Write
			))
			&& !this.isEncryptedStorage()
		)
		{
			this.enableButton(this.pasteButtonModules, 'FilesCutCopyPasteWebclientPlugin');
		}
		else
		{
			this.disableButton(this.pasteButtonModules, 'FilesCutCopyPasteWebclientPlugin');
		}
		//Disable delete buttons for folders with access level "Read"
		if (this.isSharedStorage()
			&& iPathItemsLength !== 0
			&& oLastPathItem.oExtendedProps
			&& oLastPathItem.oExtendedProps.Access
			&& oLastPathItem.oExtendedProps.Access !== Enums.SharedFileAccess.Write
		)
		{
			this.disableButton(this.cutButtonModules, 'FilesCutCopyPasteWebclientPlugin');
		}
		else
		{
			this.enableButton(this.cutButtonModules, 'FilesCutCopyPasteWebclientPlugin');
		}
	}, this);
};

ButtonsView.prototype.disableButton = function (koButtonModules, sModuleName)
{
	if (koButtonModules.indexOf(sModuleName) === -1)
	{
		koButtonModules.push(sModuleName);
	}
};

ButtonsView.prototype.enableButton = function (koButtonModules, sModuleName)
{
	koButtonModules.remove(sModuleName);
};

ButtonsView.prototype.isSharedStorage = function ()
{
	return this.storageType() === Enums.FileStorageType.Shared;
};

ButtonsView.prototype.isEncryptedStorage = function ()
{
	return this.storageType() === 'encrypted';
};


module.exports = new ButtonsView();


/***/ }),

/***/ "QYQq":
/*!****************************************************************!*\
  !*** ./modules/FilesCutCopyPasteWebclientPlugin/js/manager.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5");

	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('FilesWebclient', 'registerToolbarButtons', [__webpack_require__(/*! modules/FilesCutCopyPasteWebclientPlugin/js/views/ButtonsView.js */ "767o")]);
			}
		};
	}
	
	return null;
};


/***/ })

}]);