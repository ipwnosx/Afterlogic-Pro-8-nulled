(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "+v/2":
/*!*******************************************!*\
  !*** ./modules/FilesWebclient/js/Ajax.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	
	Settings = __webpack_require__(/*! modules/FilesWebclient/js/Settings.js */ "Jq2H")
;

Ajax.registerAbortRequestHandler(Settings.ServerModuleName, function (oRequest, oOpenedRequest) {
	switch (oRequest.Method)
	{
		case 'GetFiles':
			return oOpenedRequest.Method === 'GetFiles';
	}
	
	return false;
});

module.exports = {
	send: function (sMethod, oParameters, fResponseHandler, oContext) {
		Ajax.send(Settings.ServerModuleName, sMethod, oParameters, fResponseHandler, oContext);
	},
	sendToWebclient: function (sMethod, oParameters, fResponseHandler, oContext) {
		Ajax.send('FilesWebclient', sMethod, oParameters, fResponseHandler, oContext);
	}
};

/***/ }),

/***/ "42lS":
/*!***********************************************************!*\
  !*** ./modules/CoreWebclient/js/popups/EmbedHtmlPopup.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CEmbedHtmlPopup()
{
	CAbstractPopup.call(this);
	
	this.htmlEmbed = ko.observable('');
}

_.extendOwn(CEmbedHtmlPopup.prototype, CAbstractPopup.prototype);

CEmbedHtmlPopup.prototype.PopupTemplate = 'CoreWebclient_EmbedHtmlPopup';

CEmbedHtmlPopup.prototype.onOpen = function (sHtmlEmbed)
{
	this.htmlEmbed(sHtmlEmbed);
};

CEmbedHtmlPopup.prototype.close = function ()
{
	this.closePopup();
	this.htmlEmbed('');
};

module.exports = new CEmbedHtmlPopup();

/***/ }),

/***/ "4KVt":
/*!*************************************************************!*\
  !*** ./modules/FilesWebclient/js/popups/CreateLinkPopup.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	
	Ajax = __webpack_require__(/*! modules/FilesWebclient/js/Ajax.js */ "+v/2"),
	CFileModel = __webpack_require__(/*! modules/FilesWebclient/js/models/CFileModel.js */ "Pg7U")
;

/**
 * @constructor
 */
function CCreateLinkPopup()
{
	CAbstractPopup.call(this);
	
	this.fCallback = null;
	this.link = ko.observable('');
	this.linkPrev = ko.observable('');
	this.linkFocus = ko.observable(false);
	this.checkTimeout = null;
	this.urlChecked = ko.observable(false);
	this.saveCommand = Utils.createCommand(this, this.executeSave, function () {
		return (this.urlChecked());
	});
	this.fileItem = ko.observable(null);
}

_.extendOwn(CCreateLinkPopup.prototype, CAbstractPopup.prototype);

CCreateLinkPopup.prototype.PopupTemplate = 'FilesWebclient_CreateLinkPopup';

/**
 * @param {Function} fCallback
 */
CCreateLinkPopup.prototype.onOpen = function (fCallback)
{
	this.link('');
	this.linkFocus(true);
	
	this.fCallback = fCallback;
	this.checkTimer = setTimeout(_.bind(this.checkUrl, this), 2000);
};

CCreateLinkPopup.prototype.checkUrl = function ()
{
	clearTimeout(this.checkTimer);
	if (this.link() !== this.linkPrev())
	{
		this.linkPrev(this.link());
		Ajax.send('CheckUrl', { 'Url': this.link() }, this.onCheckUrlResponse, this);
	}
	this.checkTimer = setTimeout(_.bind(this.checkUrl, this), 1000);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CCreateLinkPopup.prototype.onCheckUrlResponse = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		var
			oData = CFileModel.prepareLinkData(oResponse.Result, this.link()),
			oFile = new CFileModel(oData)
		;
		this.fileItem(oFile);
		this.urlChecked(true);
	}
};

CCreateLinkPopup.prototype.executeSave = function ()
{
	if ($.isFunction(this.fCallback))
	{
		this.fCallback(this.fileItem());
		this.link('');
		this.linkPrev('');
		this.urlChecked(false);
	}
	clearTimeout(this.checkTimer);
	this.closePopup();
};

CCreateLinkPopup.prototype.cancelPopup = function ()
{
	this.link('');
	this.linkPrev('');
	this.urlChecked(false);
	clearTimeout(this.checkTimer);
	this.closePopup();
};

module.exports = new CCreateLinkPopup();


/***/ }),

/***/ "5hOJ":
/*!*******************************************************!*\
  !*** ./modules/CoreWebclient/js/models/CDateModel.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	moment = __webpack_require__(/*! moment */ "wd/R"),
			
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3")
;

/**
 * @constructor
 */
function CDateModel()
{
	this.iTimeStampInUTC = 0;
	this.oMoment = null;
}

/**
 * @param {number} iTimeStampInUTC
 */
CDateModel.prototype.parse = function (iTimeStampInUTC)
{
	this.iTimeStampInUTC = iTimeStampInUTC;
	this.oMoment = moment.unix(this.iTimeStampInUTC);
};

/**
 * @param {number} iYear
 * @param {number} iMonth
 * @param {number} iDay
 */
CDateModel.prototype.setDate = function (iYear, iMonth, iDay)
{
	this.oMoment = moment([iYear, iMonth, iDay]);
};

/**
 * @return {string}
 */
CDateModel.prototype.getTimeFormat = function ()
{
	return (UserSettings.timeFormat() === window.Enums.TimeFormat.F24) ? 'HH:mm' : 'hh:mm A';
};

/**
 * @return {string}
 */
CDateModel.prototype.getFullDate = function ()
{
	return this.getDate() + ' ' + this.getTime();	
};

/**
 * @return {string}
 */
CDateModel.prototype.getMidDate = function ()
{
	return this.getShortDate(true);
};

/**
 * @param {boolean=} bTime = false
 * 
 * @return {string}
 */
CDateModel.prototype.getShortDate = function (bTime)
{
	var
		sResult = '',
		oMomentNow = null
	;

	if (this.oMoment)
	{
		oMomentNow = moment();

		if (oMomentNow.format('L') === this.oMoment.format('L'))
		{
			sResult = this.oMoment.format(this.getTimeFormat());
		}
		else
		{
			if (oMomentNow.clone().subtract(1, 'days').format('L') === this.oMoment.format('L'))
			{
				sResult = TextUtils.i18n('COREWEBCLIENT/LABEL_YESTERDAY');
			}
			else
			{
				if (UserSettings.UserSelectsDateFormat)
				{
					sResult = this.oMoment.format(Utils.getDateFormatForMoment(UserSettings.dateFormat()));
				}
				else
				{
					if (oMomentNow.year() === this.oMoment.year())
					{
						sResult = this.oMoment.format('MMM D');
					}
					else
					{
						sResult = this.oMoment.format('MMM D, YYYY');
					}
				}
			}

			if (!!bTime)
			{
				sResult += ', ' + this.oMoment.format(this.getTimeFormat());
			}
		}
	}

	return sResult;
};

/**
 * @return {string}
 */
CDateModel.prototype.getDate = function ()
{
	var sFormat = 'ddd, MMM D, YYYY';
	
	if (UserSettings.UserSelectsDateFormat)
	{
		sFormat = 'ddd, ' + Utils.getDateFormatForMoment(UserSettings.dateFormat());
	}
	
	return (this.oMoment) ? this.oMoment.format(sFormat) : '';
};

/**
 * @return {string}
 */
CDateModel.prototype.getTime = function ()
{
	return (this.oMoment) ? this.oMoment.format(this.getTimeFormat()): '';
};

/**
 * @return {number}
 */
CDateModel.prototype.getTimeStampInUTC = function ()
{
	return this.iTimeStampInUTC;
};

module.exports = CDateModel;


/***/ }),

/***/ "AGjx":
/*!*******************************************************************!*\
  !*** ./modules/FilesWebclient/js/views/MobileSyncSettingsView.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3")
;

/**
 * @constructor
 */
function CMobileSyncSettingsView()
{
	this.davServer = ko.observable('');
	this.credentialsHintText = App.mobileCredentialsHintText;
	this.bDemo = UserSettings.IsDemo;
}

CMobileSyncSettingsView.prototype.ViewTemplate = 'FilesWebclient_MobileSyncSettingsView';

/**
 * @param {Object} oDav
 */
CMobileSyncSettingsView.prototype.populate = function (oDav)
{
	this.davServer(oDav.Server);
};

module.exports = new CMobileSyncSettingsView();


/***/ }),

/***/ "Au6d":
/*!***************************************************************!*\
  !*** ./modules/FilesWebclient/js/popups/CreateFolderPopup.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CCreateFolderPopup()
{
	CAbstractPopup.call(this);
	
	this.fCallback = null;
	this.folderName = ko.observable('');
	this.folderName.focus = ko.observable(false);
	this.folderName.error = ko.observable('');

	this.folderName.subscribe(function () {
		this.folderName.error('');
	}, this);
}

_.extendOwn(CCreateFolderPopup.prototype, CAbstractPopup.prototype);

CCreateFolderPopup.prototype.PopupTemplate = 'FilesWebclient_CreateFolderPopup';

/**
 * @param {Function} fCallback
 */
CCreateFolderPopup.prototype.onOpen = function (fCallback)
{
	this.folderName('');
	this.folderName.focus(true);
	this.folderName.error('');
	
	if ($.isFunction(fCallback))
	{
		this.fCallback = fCallback;
	}
};

CCreateFolderPopup.prototype.onOKClick = function ()
{
	this.folderName.error('');
	
	if (this.fCallback)
	{
		var sError = this.fCallback(this.folderName());
		if (sError)
		{
			this.folderName.error('' + sError);
		}
		else
		{
			this.closePopup();
		}
	}
	else
	{
		this.closePopup();
	}
};

module.exports = new CCreateFolderPopup();

/***/ }),

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

/***/ "Jq2H":
/*!***********************************************!*\
  !*** ./modules/FilesWebclient/js/Settings.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	_ = __webpack_require__(/*! underscore */ "F/us"),

	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'Files',
	CorporateServerModuleName: 'CorporateFiles',
	PersonalServerModuleName: 'PersonalFiles',
	HashModuleName: 'files',

	CustomTabTitle: '',
	Storages: [],
	EnableUploadSizeLimit: false,
	PublicFolderName: '',
	PublicHash: '',
	UploadSizeLimitMb: 0,
	UserSpaceLimitMb: 0,
	TenantSpaceLimitMb: 0,
	CorporateSpaceLimitMb: 0,

	EditFileNameWithoutExtension: false,
	ShowCommonSettings: true,
	ShowFilesApps: true,
	BottomLeftCornerLinks: [],

	ShowPersonalFilesAdminSection: false,
	ShowCorporateFilesAdminSection: false,
	PublicLinksEnabled: true,

	/**
	 * Initializes settings from AppData object sections.
	 *
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var
			oAppDataFilesSection = oAppData[this.ServerModuleName],
			// oAppDataPersonalFilesSection = oAppData[this.PersonalServerModuleName],
			oAppDataCorporateFilesSection = oAppData[this.CorporateServerModuleName],
			oAppDataFilesWebclientSection = oAppData['FilesWebclient']
		;

		if (!_.isEmpty(oAppDataFilesSection))
		{
			this.CustomTabTitle = Types.pString(oAppDataFilesSection.CustomTabTitle, this.CustomTabTitle);
			this.Storages = Types.pArray(oAppDataFilesSection.Storages, this.Storages);
			this.EnableUploadSizeLimit = Types.pBool(oAppDataFilesSection.EnableUploadSizeLimit, this.EnableUploadSizeLimit);
			this.PublicFolderName = Types.pString(oAppDataFilesSection.PublicFolderName, this.PublicFolderName);
			this.PublicHash = Types.pString(oAppDataFilesSection.PublicHash, this.PublicHash);
			this.UploadSizeLimitMb = Types.pNonNegativeInt(oAppDataFilesSection.UploadSizeLimitMb, this.UploadSizeLimitMb);

			this.UserSpaceLimitMb = Types.pNonNegativeInt(oAppDataFilesSection.UserSpaceLimitMb, this.UserSpaceLimitMb);
			this.TenantSpaceLimitMb = Types.pNonNegativeInt(oAppDataFilesSection.TenantSpaceLimitMb, this.TenantSpaceLimitMb);
		}

		// if (!_.isEmpty(oAppDataPersonalFilesSection))
		// {
		 	this.ShowPersonalFilesAdminSection = true;
		// }

		if (!_.isEmpty(oAppDataCorporateFilesSection))
		{
			this.ShowCorporateFilesAdminSection = true;
			this.CorporateSpaceLimitMb = Types.pNonNegativeInt(oAppDataCorporateFilesSection.SpaceLimitMb, this.CorporateSpaceLimitMb);
		}

		if (!_.isEmpty(oAppDataFilesWebclientSection))
		{
			this.EditFileNameWithoutExtension = Types.pBool(oAppDataFilesWebclientSection.EditFileNameWithoutExtension, this.EditFileNameWithoutExtension);
			this.ShowCommonSettings = Types.pBool(oAppDataFilesWebclientSection.ShowCommonSettings, this.ShowCommonSettings);
			this.ShowFilesApps = Types.pBool(oAppDataFilesWebclientSection.ShowFilesApps, this.ShowFilesApps);
			this.BottomLeftCornerLinks = Types.pArray(oAppDataFilesWebclientSection.BottomLeftCornerLinks, this.BottomLeftCornerLinks);
			this.PublicLinksEnabled = Types.pBool(oAppDataFilesWebclientSection.PublicLinksEnabled, this.PublicLinksEnabled);
		}
	},

	/**
	 * Updates settings from settings tab in admin panel.
	 *
	 * @param {boolean} bEnableUploadSizeLimit Indicates if upload size limit is enabled.
	 * @param {number} iUploadSizeLimitMb Value of upload size limit in Mb.
	 */
	updateAdmin: function (bEnableUploadSizeLimit, iUploadSizeLimitMb)
	{
		this.EnableUploadSizeLimit = bEnableUploadSizeLimit;
		this.UploadSizeLimitMb = iUploadSizeLimitMb;
	},

	updateAdminPersonal: function (iUserSpaceLimitMb)
	{
		this.PersonalSpaceLimitMb = iUserSpaceLimitMb;
	},

	updateAdminCorporate: function (iSpaceLimitMb)
	{
		this.CorporateSpaceLimitMb = iSpaceLimitMb;
	}
};


/***/ }),

/***/ "KM9R":
/*!********************************************************!*\
  !*** ./modules/FilesWebclient/js/popups/SharePopup.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),

	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),

	Ajax = __webpack_require__(/*! modules/FilesWebclient/js/Ajax.js */ "+v/2"),
	CFolderModel = __webpack_require__(/*! modules/FilesWebclient/js/models/CFolderModel.js */ "MTJk"),

	ShowHistoryPopup = ModulesManager.run('ActivityHistory', 'getShowHistoryPopup')
;

/**
 * @constructor
 */
function CSharePopup()
{
	CAbstractPopup.call(this);
	
	this.item = null;
	this.pub = ko.observable('');
	this.pubFocus = ko.observable(false);

	this.bAllowShowHistory = !!ShowHistoryPopup;
}

_.extendOwn(CSharePopup.prototype, CAbstractPopup.prototype);

CSharePopup.prototype.PopupTemplate = 'FilesWebclient_SharePopup';

/**
 * @param {Object} oItem
 */
CSharePopup.prototype.onOpen = function (oItem)
{
	this.item = oItem;
	
	this.pub('');
		
	Ajax.send('CreatePublicLink', {
			'Type': oItem.storageType(),
			'Path': oItem.path(),
			'Name': oItem.fileName(),
			'Size': oItem instanceof CFolderModel ? 0 : oItem.size(),
			'IsFolder': oItem instanceof CFolderModel
		}, this.onCreatePublicLinkResponse, this
	);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CSharePopup.prototype.onCreatePublicLinkResponse = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		this.pub(UrlUtils.getAppPath() + oResponse.Result);
		this.pubFocus(true);
		this.item.published(true);
	}
};

CSharePopup.prototype.onCancelSharingClick = function ()
{
	if (this.item)
	{
		Ajax.send('DeletePublicLink', {
				'Type': this.item.storageType(),
				'Path': this.item.path(),
				'Name': this.item.fileName()
			}, this.closePopup, this);
		this.item.published(false);
	}
};

CSharePopup.prototype.showHistory = function () {
	if (this.bAllowShowHistory)
	{
		Popups.showPopup(ShowHistoryPopup, [TextUtils.i18n('FILESWEBCLIENT/HEADING_HISTORY_POPUP'), this.item]);
	}
}

module.exports = new CSharePopup();

/***/ }),

/***/ "MTJk":
/*!**********************************************************!*\
  !*** ./modules/FilesWebclient/js/models/CFolderModel.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	CAbstractFileModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CAbstractFileModel.js */ "cGGv")
;

/**
 * @constructor
 */
function CFolderModel()
{
	//template
	this.selected = ko.observable(false);
	this.checked = ko.observable(false); // ? = selected ?
	this.deleted = ko.observable(false); // temporary removal until it was confirmation from the server to delete, css-animation
	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	
	this.published = ko.observable(false);
	this.isShared = ko.observable(false);
	this.fileName = ko.observable('');
	
	//onDrop
	this.fullPath = ko.observable('');
	
	//rename
	this.path = ko.observable('');
	
	//pathItems
	this.storageType = ko.observable(Enums.FileStorageType.Personal);
	this.displayName = ko.observable('');
	this.id = ko.observable('');
	
	this.sMainAction = 'list';
	this.oExtendedProps = null;
	
	// The folder can be uploading. Operations should be disabled for such a folder.
	this.uploadingFilesCount = ko.observable(0);
	this.uploadedFilesCount = ko.observable(0);
	this.progressPercent = ko.computed(function () {
		if (this.uploadingFilesCount() > 0)
		{
			return Math.floor((this.uploadedFilesCount() / this.uploadingFilesCount()) * 100);
		}
		return 0;
	}, this);
	this.isIncomplete = ko.computed(function () {
		return this.uploadingFilesCount() > 0;
	}, this);
	this.uploaded = ko.computed(function () {
		return this.uploadingFilesCount() === 0;
	}, this);
}

CFolderModel.prototype.parse = function (oData)
{
	this.published(!!oData.Published);
	this.fileName(Types.pString(oData.Name));
	this.fullPath(Types.pString(oData.FullPath));
	this.path(Types.pString(oData.Path));
	this.storageType(Types.pString(oData.Type));
	this.displayName(this.fileName());
	this.id(Types.pString(oData.Id));
	this.oExtendedProps = oData.ExtendedProps || [];
	if (oData.MainAction)
	{
		this.sMainAction = Types.pString(oData.MainAction);
	}
	App.broadcastEvent('FilesWebclient::ParseFolder::after', [this, oData]);
};

CFolderModel.prototype.getMainAction = function ()
{
	return this.sMainAction;
};

CFolderModel.prototype.increaseUploadingFiles = function ()
{
	return this.uploadingFilesCount(this.uploadingFilesCount() + 1);
};

CFolderModel.prototype.increaseUploadedFiles = function ()
{
	return this.uploadedFilesCount(this.uploadedFilesCount() + 1);
};


CFolderModel.prototype.eventDragStart = CAbstractFileModel.prototype.eventDragStart;

module.exports = CFolderModel;


/***/ }),

/***/ "Pg7U":
/*!********************************************************!*\
  !*** ./modules/FilesWebclient/js/models/CFileModel.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "ZCBP"),
	
	CAbstractFileModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CAbstractFileModel.js */ "cGGv"),
	CDateModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CDateModel.js */ "5hOJ"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	EmbedHtmlPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/EmbedHtmlPopup.js */ "42lS"),
	
	Enums = window.Enums
;

/**
 * @constructor
 * @param {Object} oData
 * @param {bool} bPopup
 * @extends CAbstractFileModel
 */
function CFileModel(oData, bPopup)
{
	// the constant is used instead of constructor.name because constructor.name can not be used in minified JS
	this.IS_FILE = true;
	
	this.storageType = ko.observable(Types.pString(oData.Type));
	this.sLastModified = CFileModel.parseLastModified(oData.LastModified);
	this.iLastModified = Types.pInt(oData.LastModified);

	this.path = ko.observable(Types.pString(oData.Path));
	this.fullPath = ko.observable(Types.pString(oData.FullPath));
	
	this.selected = ko.observable(false);
	this.checked = ko.observable(false);
	
	this.bIsLink = !!oData.IsLink;
	this.oExtendedProps = oData.ExtendedProps;
	this.sLinkType = this.bIsLink ? Types.pString(oData.LinkType) : '';
	this.sLinkUrl = this.bIsLink ? Types.pString(oData.LinkUrl) : '';
	this.sThumbnailExternalLink = this.bIsLink ? Types.pString(oData.ThumbnailUrl) : '';
	
	this.deleted = ko.observable(false); // temporary removal until it was confirmation from the server to delete
	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.published = ko.observable(false);
	this.sOwnerName = Types.pString(oData.Owner);
	
	CAbstractFileModel.call(this);
	
	this.content = ko.observable('');
	
	this.thumbUrlInQueueSubscribtion.dispose();
	this.thumbUrlInQueue.subscribe(function () {
		if (this.sThumbnailExternalLink !== '')
		{
			this.thumbnailSrc(this.sThumbnailExternalLink);
		}
		else if (!this.bIsLink)
		{
			this.getInThumbQueue();
		}
	}, this);
	
	this.visibleCancelButton = ko.computed(function () {
		return this.visibleProgress() && this.progressPercent() !== 100;
	}, this);
	
	this.oActionsData['list'] = {
		'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_VIEW_FILE'),
		'Handler': _.bind(function () { App.broadcastEvent('Files::ShowList', {'Item': this}); }, this)
	};
	this.oActionsData['open'] = {
		'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_OPEN_LINK'),
		'Handler': _.bind(this.openLink, this)
	};

	this.iconAction('');
	
	this.sHeaderText = _.bind(function () {
		if (this.sLastModified)
		{
			var sLangConstName = this.sOwnerName !== '' ? 'FILESWEBCLIENT/INFO_OWNER_AND_DATA' : 'FILESWEBCLIENT/INFO_DATA';
			return TextUtils.i18n(sLangConstName, {
				'OWNER': this.sOwnerName,
				'LASTMODIFIED': this.sLastModified
			});
		}
		return '';
	}, this)();
	
	this.type = this.storageType;

	this.canShare = ko.computed(function () {
		return (this.storageType() === Enums.FileStorageType.Personal || this.storageType() === Enums.FileStorageType.Corporate);
	}, this);
	
	this.sHtmlEmbed = Types.pString(oData.OembedHtml);
	
	this.commonParseActions(oData);
	
	this.cssClasses = ko.computed(function () {
		var aClasses = this.getCommonClasses();
		
		if (this.allowDrag())
		{
			aClasses.push('dragHandle');
		}
		if (this.selected())
		{
			aClasses.push('selected');
		}
		if (this.checked())
		{
			aClasses.push('checked');
		}
		if (this.deleted())
		{
			aClasses.push('deleted');
		}
		if (this.allowPublicLink() && this.published())
		{
			aClasses.push('published');
		}
		if (this.bIsLink)
		{
			aClasses.push('aslink');
		}
		
		return aClasses.join(' ');
	}, this);
	
	this.parse(oData, bPopup);
}

_.extendOwn(CFileModel.prototype, CAbstractFileModel.prototype);

/**
 * Parses date of last file modification.
 * @param {number} iLastModified Date in unix fomat
 * @returns {String}
 */
CFileModel.parseLastModified = function (iLastModified)
{
	var oDateModel = new CDateModel();
	if (iLastModified)
	{
		oDateModel.parse(iLastModified);
		return oDateModel.getShortDate();
	}
	return '';
};

/**
 * Prepares data of link for its further parsing.
 * @param {Object} oData Data received from the server after URL checking.
 * @param {string} sLinkUrl Link URL.
 * @returns {Object}
 */
CFileModel.prepareLinkData = function (oData, sLinkUrl)
{
	return {
		IsLink: true,
		LinkType: oData.LinkType,
		LinkUrl: sLinkUrl,
		Name: oData.Name,
		Size: oData.Size,
		ThumbnailUrl: oData.Thumb
	};
};

/**
 * Parses data from server.
 * @param {object} oData
 * @param {boolean} bPopup
 */
CFileModel.prototype.parse = function (oData, bPopup)
{
	this.uploaded(true);
	this.allowDrag(!bPopup);
	this.allowUpload(true);
	this.allowPublicLink(true);
	this.allowActions(!bPopup && this.fullPath() !== '');
		
	this.fileName(Types.pString(oData.Name));
	this.content(Types.pString(oData.Content));
	this.id(Types.pString(oData.Id));
	this.published(!!oData.Published);

	this.size(Types.pInt(oData.Size));
	this.hash(Types.pString(oData.Hash));
	
	this.thumbUrlInQueue(Types.pString(oData.ThumbnailUrl) !== '' ? Types.pString(oData.ThumbnailUrl) + '/' + Math.random() : '');
	
	this.mimeType(Types.pString(oData.ContentType));

	this.bHasHtmlEmbed = !bPopup && this.fullPath() !== '' && this.sLinkType === 'oembeded';
	if (this.bHasHtmlEmbed)
	{
		this.iconAction('view');
	}
	if (!this.isViewSupported() && !this.bHasHtmlEmbed)
	{
		this.actions(_.without(this.actions(), 'view'));
	}

	App.broadcastEvent('FilesWebclient::ParseFile::after', [this, oData]);
};

/**
 * Prepares data of upload file for its further parsing.
 * @param {Object} oFileData
 * @param {string} sPath
 * @param {string} sStorageType
 * @param {Function} fGetFileByName
 * @returns {Object}
 */
CFileModel.prepareUploadFileData = function (oFileData, sPath, sStorageType, fGetFileByName)
{
	var
		sFileName = oFileData.FileName,
		sFileNameExt = Utils.getFileExtension(sFileName),
		sFileNameWoExt = Utils.getFileNameWithoutExtension(sFileName),
		iIndex = 0
	;
	
	if (sFileNameExt !== '')
	{
		sFileNameExt = '.' + sFileNameExt;
	}
	
	while (fGetFileByName(sFileName))
	{
		sFileName = sFileNameWoExt + '_' + iIndex + sFileNameExt;
		iIndex++;
	}
	
	oFileData.FileName = sFileName;
	
	return {
		Name: sFileName,
		LastModified: moment().unix(),
		Owner: App.getUserPublicId(),
		Path: sPath,
		FullPath: sPath + '/' + sFileName,
		Type: sStorageType,
		ContentType: oFileData.Type,
		Size: oFileData.Size
	};
};

/**
 * Opens file viewing via post to iframe.
 * @param {Object} oFileModel
 * @param {Object} oEvent
 */
CFileModel.prototype.viewFile = function (oFileModel, oEvent)
{
	if (!oEvent || !oEvent.ctrlKey && !oEvent.shiftKey)
	{
		if (this.sHtmlEmbed !== '')
		{
			Popups.showPopup(EmbedHtmlPopup, [this.sHtmlEmbed]);
		}
		else if (this.bIsLink)
		{
			this.viewCommonFile(this.sLinkUrl);
		}
		else
		{
			this.viewCommonFile();
		}
	}
};

/**
 * Opens link URL in the new tab.
 */
CFileModel.prototype.openLink = function ()
{
	if (this.bIsLink)
	{
		WindowOpener.openTab(this.sLinkUrl);
	}
};

CFileModel.prototype.commonParseActions = function (oData)
{
	_.each (oData.Actions, function (oData, sAction) {
		if (!this.oActionsData[sAction])
		{
			this.oActionsData[sAction] = {};
		}
		var sHash = '';
		if (sAction === 'download' || sAction === 'view')
		{
			sHash = '&' + Utils.getRandomHash();
		}
		this.oActionsData[sAction].Url = Types.pString(oData.url) + sHash;
		this.actions.push(sAction);
	}, this);
};

module.exports = CFileModel;


/***/ }),

/***/ "QFUI":
/*!*************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Files.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
	
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	
	FilesUtils = {}
;

/**
 * Gets link for download by hash.
 *
 * @param {string} sModuleName Name of module that owns the file.
 * @param {string} sHash Hash of the file.
 * @param {string} sPublicHash Hash of shared folder if the file is displayed by public link.
 * 
 * @return {string}
 */
FilesUtils.getDownloadLink = function (sModuleName, sHash, sPublicHash)
{
	return sHash.length > 0 ? '?/Download/' + sModuleName + '/DownloadFile/' + sHash + '/' + (sPublicHash ? '0/' + sPublicHash : '') : '';
};

/**
 * Gets link for view by hash in iframe.
 *
 * @param {number} iAccountId
 * @param {string} sUrl
 *
 * @return {string}
 */
FilesUtils.getIframeWrappwer = function (iAccountId, sUrl)
{
	return '?/Raw/Iframe/' + iAccountId + '/' + window.encodeURIComponent(sUrl) + '/';
};

FilesUtils.thumbQueue = (function () {

	var
		oImages = {},
		oImagesIncrements = {},
		iNumberOfImages = 2
	;

	return function (sSessionUid, sImageSrc, fImageSrcObserver)
	{
		if(sImageSrc && fImageSrcObserver)
		{
			if(!(sSessionUid in oImagesIncrements) || oImagesIncrements[sSessionUid] > 0) //load first images
			{
				if(!(sSessionUid in oImagesIncrements)) //on first image
				{
					oImagesIncrements[sSessionUid] = iNumberOfImages;
					oImages[sSessionUid] = [];
				}
				oImagesIncrements[sSessionUid]--;

				fImageSrcObserver(sImageSrc); //load image
			}
			else //create queue
			{
				oImages[sSessionUid].push({
					imageSrc: sImageSrc,
					imageSrcObserver: fImageSrcObserver,
					messageUid: sSessionUid
				});
			}
		}
		else //load images from queue (fires load event)
		{
			if(oImages[sSessionUid] && oImages[sSessionUid].length)
			{
				oImages[sSessionUid][0].imageSrcObserver(oImages[sSessionUid][0].imageSrc);
				oImages[sSessionUid].shift();
			}
		}
	};
}());

/**
 * @param {string} sFileName
 * @param {number} iSize
 * @returns {Boolean}
 */
FilesUtils.showErrorIfAttachmentSizeLimit = function (sFileName, iSize)
{
	var
		sWarning = TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_SIZE_DETAILED', {
			'FILENAME': sFileName,
			'MAXSIZE': TextUtils.getFriendlySize(UserSettings.AttachmentSizeLimit)
		})
	;
	
	if (UserSettings.AttachmentSizeLimit > 0 && iSize > UserSettings.AttachmentSizeLimit)
	{
		Popups.showPopup(AlertPopup, [sWarning]);
		return true;
	}
	
	return false;
};

module.exports = FilesUtils;


/***/ }),

/***/ "TX6J":
/*!***************************************************************************!*\
  !*** ./modules/FilesWebclient/js/views/FilesPersonalAdminSettingsView.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = __webpack_require__(/*! modules/FilesWebclient/js/Settings.js */ "Jq2H")
;

/**
* @constructor
*/
function CFilesPersonalAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName, 'UpdateSettingsForEntity');
	
	/* Editable fields */
	this.userSpaceLimitMb = ko.observable(Settings.UserSpaceLimitMb);
	this.tenantSpaceLimitMb = ko.observable(Settings.TenantSpaceLimitMb);

	/*-- Editable fields */

	this.sEntityType = '';
	this.iEntityId = 0;

	this.isSuperAdmin = ko.observable(false);

	this.isVisible = ko.observable(true);
}

_.extendOwn(CFilesPersonalAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CFilesPersonalAdminSettingsView.prototype.ViewTemplate = 'FilesWebclient_FilesPersonalAdminSettingsView';

CFilesPersonalAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.userSpaceLimitMb(),
		this.tenantSpaceLimitMb()
	];
};

CFilesPersonalAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.userSpaceLimitMb(Settings.UserSpaceLimitMb);
	this.tenantSpaceLimitMb(Settings.TenantSpaceLimitMb);
};

CFilesPersonalAdminSettingsView.prototype.getParametersForSave = function ()
{
	var oParameters = {
		'EntityType': this.sEntityType,
		'EntityId': Types.pInt(this.iEntityId),
		'UserSpaceLimitMb': Types.pInt(this.userSpaceLimitMb()),
		'TenantSpaceLimitMb': Types.pInt(this.tenantSpaceLimitMb())
	};
	if (this.sEntityType === 'Tenant')
	{
		oParameters.TenantId = oParameters.EntityId;
	}
	return oParameters;
};

/**
 * Applies saved values to the Settings object.
 * 
 * @param {Object} oParameters Parameters which were saved on the server side.
 */
CFilesPersonalAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	Settings.updateAdminPersonal(oParameters.UserSpaceLimitMb);
};

/**
 * Sets access level for the view via entity type and entity identifier.
 * This view is visible only for empty entity type.
 * 
 * @param {string} sEntityType Current entity type.
 * @param {number} iEntityId Indentificator of current intity.
 */
CFilesPersonalAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.sEntityType = sEntityType;
	this.iEntityId = (sEntityType === 'User' || sEntityType === 'Tenant') ? iEntityId : 0;

	this.visible(sEntityType === '' || sEntityType === 'Tenant' || sEntityType === 'User');
	this.isSuperAdmin(sEntityType === '');
};

CFilesPersonalAdminSettingsView.prototype.hide = function ()
{
	this.isVisible(false);
};

module.exports = new CFilesPersonalAdminSettingsView();


/***/ }),

/***/ "c3Cn":
/*!******************************************************************!*\
  !*** ./modules/FilesWebclient/js/views/FilesSettingsFormView.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = __webpack_require__(/*! modules/FilesWebclient/js/Settings.js */ "Jq2H")
;

/**
 * @constructor
 */
function CFilesSettingsFormView()
{
	CAbstractSettingsFormView.call(this, 'FilesWebclient');

	this.bShowFilesApps = Settings.ShowFilesApps;

	this.sAppPath = UrlUtils.getAppPath();
}

_.extendOwn(CFilesSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

CFilesSettingsFormView.prototype.ViewTemplate = 'FilesWebclient_FilesSettingsFormView';

module.exports = new CFilesSettingsFormView();


/***/ }),

/***/ "cGGv":
/*!***************************************************************!*\
  !*** ./modules/CoreWebclient/js/models/CAbstractFileModel.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),

	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	FilesUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Files.js */ "QFUI"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "ZCBP"),
	
	aViewMimeTypes = [
		'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
		'text/html', 'text/plain', 'text/css',
		'text/rfc822-headers', 'message/delivery-status',
		'application/x-httpd-php', 'application/javascript'
	],
	
	aViewExtensions = []
;

if ($('html').hasClass('pdf'))
{
	aViewMimeTypes.push('application/pdf');
	aViewMimeTypes.push('application/x-pdf');
}

/**
 * @constructor
 */
function CAbstractFileModel()
{
	this.id = ko.observable('');
	this.index = ko.observable(0);
	this.fileName = ko.observable('');
	this.tempName = ko.observable('');
	this.displayName = ko.observable('');
	this.extension = ko.observable('');
	
	this.fileName.subscribe(function (sFileName) {
		this.id(sFileName);
		this.displayName(sFileName);
		this.extension(Utils.getFileExtension(sFileName));
	}, this);
	
	this.size = ko.observable(0);
	this.friendlySize = ko.computed(function () {
		return this.size() > 0 ? TextUtils.getFriendlySize(this.size()) : '';
	}, this);
	
	this.hash = ko.observable('');
	
	this.thumbUrlInQueue = ko.observable('');
	this.thumbUrlInQueueSubscribtion = this.thumbUrlInQueue.subscribe(function () {
		this.getInThumbQueue();
	}, this);

	this.thumbnailSrc = ko.observable('');
	this.thumbnailLoaded = ko.observable(false);
	this.thumbnailSessionUid = ko.observable('');

	this.mimeType = ko.observable('');
	this.uploadUid = ko.observable('');
	this.uploaded = ko.observable(false);
	this.uploadError = ko.observable(false);
	this.downloading = ko.observable(false);
	this.isViewMimeType = ko.computed(function () {
		return (-1 !== $.inArray(this.mimeType(), aViewMimeTypes));
	}, this);
	this.bHasHtmlEmbed = false;
	
	this.otherTemplates = ko.observableArray([]);

	// Some modules can override this field if it is necessary to manage it.
	this.visibleCancelButton = ko.observable(true);
	
	this.statusText = ko.observable('');
	this.statusTooltip = ko.computed(function () {
		return this.uploadError() ? this.statusText() : '';
	}, this);
	this.progressPercent = ko.observable(0);
	this.visibleProgress = ko.observable(false);
	
	this.uploadStarted = ko.observable(false);
	this.uploadStarted.subscribe(function () {
		if (this.uploadStarted())
		{
			this.uploaded(false);
			this.visibleProgress(true);
			this.progressPercent(20);
		}
		else
		{
			this.progressPercent(100);
			this.visibleProgress(false);
			this.uploaded(true);
		}
	}, this);
	
	this.downloading.subscribe(function () {
		if (this.downloading())
		{
			this.visibleProgress(true);
		}
		else
		{
			this.visibleProgress(false);
			this.progressPercent(0);
		}
	}, this);
	
	this.allowDrag = ko.observable(false);
	this.allowUpload = ko.observable(false);
	this.allowPublicLink = ko.observable(false);
	this.bIsSecure = ko.observable(false);
	this.isShared = ko.observable(false);
	
	this.sHeaderText = '';

	this.oActionsData = {
		'view': {
			'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_VIEW_FILE'),
			'HandlerName': 'viewFile'
		},
		'download': {
			'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_DOWNLOAD_FILE'),
			'HandlerName': 'downloadFile',
			'Tooltip': ko.computed(function () {
				var sTitle = TextUtils.i18n('COREWEBCLIENT/INFO_CLICK_TO_DOWNLOAD_FILE', {
					'FILENAME': this.fileName(),
					'SIZE': this.friendlySize()
				});

				if (this.friendlySize() === '')
				{
					sTitle = sTitle.replace(' ()', '');
				}

				return sTitle;
			}, this)
		}
	};
	
	this.allowActions = ko.observable(true);
	
	this.iconAction = ko.observable('download');
	
	this.cssClasses = ko.computed(function () {
		return this.getCommonClasses().join(' ');
	}, this);
	
	this.actions = ko.observableArray([]);
	
	this.firstAction = ko.computed(function () {
		if (this.actions().length > 1)
		{
			return this.actions()[0];
		}
		return '';
	}, this);
	
	this.secondAction = ko.computed(function () {
		if (this.actions().length === 1)
		{
			return this.actions()[0];
		}
		if (this.actions().length > 1)
		{
			return this.actions()[1];
		}
		return '';
	}, this);
	
	this.subFiles = ko.observableArray([]);
	this.subFilesExpanded = ko.observable(false);
	
	this.sUploadSubFolder = '';
	this.bIsHidden = false;
}

CAbstractFileModel.prototype.addAction = function (sAction, bMain, oActionData)
{
	if (bMain)
	{
		this.actions.unshift(sAction);
	}
	else
	{
		this.actions.push(sAction);
	}
	this.actions(_.compact(this.actions()));
	if (oActionData)
	{
		this.oActionsData[sAction] = oActionData;
	}
};

CAbstractFileModel.prototype.removeAction = function (sAction)
{
	this.actions(_.without(this.actions(), sAction));
};

CAbstractFileModel.prototype.getMainAction = function ()
{
	return this.actions()[0];
};

CAbstractFileModel.prototype.hasAction = function (sAction)
{
	return _.indexOf(this.actions(), sAction) !== -1;
};

/**
 * Returns button text for specified action.
 * @param {string} sAction
 * @returns string
 */
CAbstractFileModel.prototype.getActionText = function (sAction)
{
	if (this.hasAction(sAction) && this.oActionsData[sAction] && (typeof this.oActionsData[sAction].Text === 'string' || _.isFunction(this.oActionsData[sAction].Text)))
	{
		return _.isFunction(this.oActionsData[sAction].Text) ? this.oActionsData[sAction].Text() : this.oActionsData[sAction].Text;
	}
	return '';
};

CAbstractFileModel.prototype.getActionUrl = function (sAction)
{
	return (this.hasAction(sAction) && this.oActionsData[sAction]) ? (this.oActionsData[sAction].Url || '') : '';
};

/**
 * Executes specified action.
 * @param {string} sAction
 */
CAbstractFileModel.prototype.executeAction = function (sAction)
{
	var oData = this.hasAction(sAction) && this.oActionsData[sAction];
	if (oData)
	{
		if (_.isFunction(oData.Handler)) {
			oData.Handler();
		}
		else if (typeof oData.HandlerName === 'string' && _.isFunction(this[oData.HandlerName]))
		{
			this[oData.HandlerName]();
		}
	}
};

/**
 * Returns tooltip for specified action.
 * @param {string} sAction
 * @returns string
 */
CAbstractFileModel.prototype.getTooltip = function (sAction)
{
	var mTootip = this.hasAction(sAction) && this.oActionsData[sAction] ? this.oActionsData[sAction].Tooltip : '';
	if (typeof mTootip === 'string')
	{
		return mTootip;
	}
	if (_.isFunction(mTootip))
	{
		return mTootip();
	}
	return '';
};

/**
 * Returns list of css classes for file.
 * @returns array
 */
CAbstractFileModel.prototype.getCommonClasses = function ()
{
	var aClasses = [];

	if ((this.allowUpload() && !this.uploaded()) || this.downloading())
	{
		aClasses.push('incomplete');
	}
	if (this.uploadError())
	{
		aClasses.push('fail');
	}
	else
	{
		aClasses.push('success');
	}

	return aClasses;
};

/**
 * Parses attachment data from server.
 * @param {AjaxAttachmenResponse} oData
 */
CAbstractFileModel.prototype.parse = function (oData)
{
	this.fileName(Types.pString(oData.FileName));
	this.tempName(Types.pString(oData.TempName));
	if (this.tempName() === '')
	{
		this.tempName(this.fileName());
	}

	this.mimeType(Types.pString(oData.MimeType));
	this.size(oData.EstimatedSize ? Types.pInt(oData.EstimatedSize) : Types.pInt(oData.SizeInBytes));

	this.hash(Types.pString(oData.Hash));

	this.parseActions(oData);

	this.uploadUid(this.hash());
	this.uploaded(true);

	if ($.isFunction(this.additionalParse))
	{
		this.additionalParse(oData);
	}
};

CAbstractFileModel.prototype.parseActions = function (oData)
{
	this.thumbUrlInQueue(Types.pString(oData.ThumbnailUrl) !== '' ? Types.pString(oData.ThumbnailUrl) + '/' + Math.random() : '');
	this.commonParseActions(oData);
	this.commonExcludeActions();
};

CAbstractFileModel.prototype.commonExcludeActions = function ()
{
	if (!this.isViewSupported())
	{
		this.actions(_.without(this.actions(), 'view'));
	}
};

CAbstractFileModel.prototype.commonParseActions = function (oData)
{
	_.each (oData.Actions, function (oData, sAction) {
		if (!this.oActionsData[sAction])
		{
			this.oActionsData[sAction] = {};
		}
		this.oActionsData[sAction].Url = Types.pString(oData.url);
		this.actions.push(sAction);
	}, this);
};

CAbstractFileModel.addViewExtensions = function (aAddViewExtensions)
{
	if (_.isArray(aAddViewExtensions))
	{
		aViewExtensions = _.union(aViewExtensions, aAddViewExtensions);
	}
};

CAbstractFileModel.prototype.isViewSupported = function ()
{
	return (-1 !== $.inArray(this.mimeType(), aViewMimeTypes) || -1 !== $.inArray(this.extension(), aViewExtensions));
};

CAbstractFileModel.prototype.getInThumbQueue = function ()
{
	if(this.thumbUrlInQueue() !== '' && (!this.linked || this.linked && !this.linked()))
	{
		this.thumbnailSessionUid(Date.now().toString());
		FilesUtils.thumbQueue(this.thumbnailSessionUid(), this.thumbUrlInQueue(), this.thumbnailSrc);
	}
};

/**
 * Starts downloading attachment on click.
 */
CAbstractFileModel.prototype.downloadFile = function (bNotBroadcastEvent)
{
	//todo: UrlUtils.downloadByUrl in nessesary context in new window
	var 
		sDownloadLink = this.getActionUrl('download'),
		oParams = {
			'File': this,
			'CancelDownload': false
		}
	;
	if (sDownloadLink.length > 0 && sDownloadLink !== '#')
	{
		if (!bNotBroadcastEvent)
		{
			App.broadcastEvent('AbstractFileModel::FileDownload::before', oParams);
		}
		if (!oParams.CancelDownload)
		{
			if (_.isFunction(oParams.CustomDownloadHandler))
			{
				oParams.CustomDownloadHandler();
			}
			else
			{
				sDownloadLink += '/' + moment().unix();
				UrlUtils.downloadByUrl(sDownloadLink, this.extension() === 'eml');
			}
		}
	}
};

/**
 * Can be overridden.
 * Starts viewing attachment on click.
 * @param {Object} oViewModel
 * @param {Object} oEvent
 */
CAbstractFileModel.prototype.viewFile = function (oViewModel, oEvent)
{
	Utils.calmEvent(oEvent);
	this.viewCommonFile();
};

/**
 * Starts viewing attachment on click.
 * @param {string=} sUrl
 */
CAbstractFileModel.prototype.viewCommonFile = function (sUrl)
{
	var 
		oWin = null,
		oParams = null
	;
	
	if (!Types.isNonEmptyString(sUrl))
	{
		sUrl = UrlUtils.getAppPath() + this.getActionUrl('view');
	}

	if (sUrl.length > 0 && sUrl !== '#')
	{
		oParams = {sUrl: sUrl, index: this.index(), bBreakView: false};
		
		App.broadcastEvent('AbstractFileModel::FileView::before', oParams);
		
		if (!oParams.bBreakView)
		{
			oWin = WindowOpener.open(oParams.sUrl, oParams.sUrl, false);

			if (oWin)
			{
				oWin.focus();
			}
		}
	}
};

/**
 * @param {Object} oAttachment
 * @param {*} oEvent
 * @return {boolean}
 */
CAbstractFileModel.prototype.eventDragStart = function (oAttachment, oEvent)
{
	var oLocalEvent = oEvent.originalEvent || oEvent;
	if (oAttachment && oLocalEvent && oLocalEvent.dataTransfer && oLocalEvent.dataTransfer.setData)
	{
		oLocalEvent.dataTransfer.setData('DownloadURL', this.generateTransferDownloadUrl());
	}

	return true;
};

/**
 * @return {string}
 */
CAbstractFileModel.prototype.generateTransferDownloadUrl = function ()
{
	var sLink = this.getActionUrl('download');
	if ('http' !== sLink.substr(0, 4))
	{
		sLink = UrlUtils.getAppPath() + sLink;
	}

	return this.mimeType() + ':' + this.fileName() + ':' + sLink;
};

/**
 * Fills attachment data for upload.
 *
 * @param {string} sFileUid
 * @param {Object} oFileData
 * @param {bool} bOnlyUploadStatus
 */
CAbstractFileModel.prototype.onUploadSelect = function (sFileUid, oFileData, bOnlyUploadStatus)
{
	if (!bOnlyUploadStatus)
	{
		this.fileName(Types.pString(oFileData['FileName']));
		this.mimeType(Types.pString(oFileData['Type']));
		this.size(Types.pInt(oFileData['Size']));
	}
	
	this.uploadUid(sFileUid);
	this.uploaded(false);
	this.statusText('');
	this.progressPercent(0);
	this.visibleProgress(false);
	
	// if uploading file is from uploading folder it should be hidden in files list.
	this.sUploadSubFolder = Types.pString(oFileData.Folder);
	this.bIsHidden = this.sUploadSubFolder !== '';
};

/**
 * Starts progress.
 */
CAbstractFileModel.prototype.onUploadStart = function ()
{
	this.visibleProgress(true);
};

/**
 * Fills progress upload data.
 *
 * @param {number} iUploadedSize
 * @param {number} iTotalSize
 */
CAbstractFileModel.prototype.onUploadProgress = function (iUploadedSize, iTotalSize)
{
	if (iTotalSize > 0)
	{
		this.progressPercent(Math.ceil(iUploadedSize / iTotalSize * 100));
		this.visibleProgress(true);
	}
};

/**
 * Fills progress download data.
 *
 * @param {number} iDownloadedSize
 * @param {number} iTotalSize
 */
CAbstractFileModel.prototype.onDownloadProgress = function (iDownloadedSize, iTotalSize)
{
	if (iTotalSize > 0)
	{
		this.progressPercent(Math.ceil(iDownloadedSize / iTotalSize * 100));
		this.visibleProgress(this.progressPercent() < 100);
	}
};

/**
 * Fills data when upload has completed.
 *
 * @param {string} sFileUid
 * @param {boolean} bResponseReceived
 * @param {Object} oResponse
 */
CAbstractFileModel.prototype.onUploadComplete = function (sFileUid, bResponseReceived, oResponse)
{
	var
		bError = !bResponseReceived || !oResponse || !!oResponse.ErrorCode || !oResponse.Result || !!oResponse.Result.Error || false,
		sError = (oResponse && oResponse.ErrorCode && oResponse.ErrorCode === Enums.Errors.CanNotUploadFileLimit) ?
			TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_SIZE') :
			TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_UNKNOWN')
	;

	this.progressPercent(0);
	this.visibleProgress(false);
	
	this.uploaded(true);
	this.uploadError(bError);
	this.statusText(bError ? sError : TextUtils.i18n('COREWEBCLIENT/REPORT_UPLOAD_COMPLETE'));

	if (!bError)
	{
		this.fillDataAfterUploadComplete(oResponse, sFileUid);
		
		setTimeout((function (self) {
			return function () {
				self.statusText('');
			};
		})(this), 3000);
	}
};

/**
 * Should be overriden.
 * 
 * @param {Object} oResult
 * @param {string} sFileUid
 */
CAbstractFileModel.prototype.fillDataAfterUploadComplete = function (oResult, sFileUid)
{
};

/**
 * @param {Object} oAttachmentModel
 * @param {Object} oEvent
 */
CAbstractFileModel.prototype.onImageLoad = function (oAttachmentModel, oEvent)
{
	if(this.thumbUrlInQueue() !== '' && !this.thumbnailLoaded())
	{
		this.thumbnailLoaded(true);
		FilesUtils.thumbQueue(this.thumbnailSessionUid());
	}
};

/**
 * Signalise that file download was stoped.
 */
CAbstractFileModel.prototype.stopDownloading = function ()
{
	this.downloading(false);
};

/**
 * Signalise that file download was started.
 */
CAbstractFileModel.prototype.startDownloading = function ()
{
	this.downloading(true);
};

module.exports = CAbstractFileModel;


/***/ }),

/***/ "dtb0":
/*!*******************************************************!*\
  !*** ./modules/FilesWebclient/js/views/CFilesView.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	CJua = __webpack_require__(/*! modules/CoreWebclient/js/CJua.js */ "mjrp"),
	CSelector = __webpack_require__(/*! modules/CoreWebclient/js/CSelector.js */ "kwPS"),
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "QaF5"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	
	CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
	ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "20Ah"),
	CreateFolderPopup = __webpack_require__(/*! modules/FilesWebclient/js/popups/CreateFolderPopup.js */ "Au6d"),
	CreateLinkPopup = __webpack_require__(/*! modules/FilesWebclient/js/popups/CreateLinkPopup.js */ "4KVt"),
	RenamePopup = __webpack_require__(/*! modules/FilesWebclient/js/popups/RenamePopup.js */ "qsz4"),
	SharePopup = __webpack_require__(/*! modules/FilesWebclient/js/popups/SharePopup.js */ "KM9R"),
	FilesSharePopup = ModulesManager.run('SharedFiles', 'getFilesSharePopup'),
	
	ComposeMessageWithAttachments = ModulesManager.run('MailWebclient', 'getComposeMessageWithAttachments'),
	
	LinksUtils = __webpack_require__(/*! modules/FilesWebclient/js/utils/Links.js */ "p2SF"),
	
	Ajax = __webpack_require__(/*! modules/FilesWebclient/js/Ajax.js */ "+v/2"),
	Settings = __webpack_require__(/*! modules/FilesWebclient/js/Settings.js */ "Jq2H"),
	
	CFileModel = __webpack_require__(/*! modules/FilesWebclient/js/models/CFileModel.js */ "Pg7U"),
	CFolderModel = __webpack_require__(/*! modules/FilesWebclient/js/models/CFolderModel.js */ "MTJk"),
	
	Enums = window.Enums
;

/**
* @constructor
* @param {boolean=} bPopup = false
*/
function CFilesView(bPopup)
{
	CAbstractScreenView.call(this, 'FilesWebclient');
	
	this.browserTitle = ko.observable(TextUtils.i18n('FILESWEBCLIENT/HEADING_BROWSER_TAB'));
	
	this.bAllowSendEmails = _.isFunction(ComposeMessageWithAttachments);
	
	this.error = ko.observable(false);
	this.loaded = ko.observable(false);
	this.bPublic = App.isPublic();
	
	this.storages = ko.observableArray([]);
	this.folders = ko.observableArray();
	this.files = ko.observableArray();
	this.uploadingFiles = ko.observableArray();

	this.rootPath = ko.observable(this.bPublic ? Settings.PublicFolderName : TextUtils.i18n('FILESWEBCLIENT/LABEL_PERSONAL_STORAGE'));
	this.storageType = ko.observable(Enums.FileStorageType.Personal);
	this.storageDisplayName = ko.computed(function () {
		var oStorage = this.getStorageByType(this.storageType());
		return oStorage ? oStorage.displayName : '';
	}, this);
	this.storageType.subscribe(function () {
		if (this.bPublic)
		{
			this.rootPath(Settings.PublicFolderName);
		}
		else
		{
			var oStorage = this.getStorageByType(this.storageType());
			if (oStorage)
			{
				this.rootPath(oStorage.displayName);
			}
			else if (this.storageType() === 'corporate')
			{
				this.rootPath(TextUtils.i18n('FILESWEBCLIENT/LABEL_CORPORATE_STORAGE'));
			}
			this.selector.listCheckedAndSelected(false);
		}
	}, this);
	this.newItemsDisabled = ko.computed(function () {
		return this.storageType() === Enums.FileStorageType.Shared;
	}, this);
	this.createButtonsControllers = ko.observableArray([]);

	this.pathItems = ko.observableArray();
	this.currentPath = ko.observable('');
	this.isZipFolder = ko.computed(function () {
		var aPath = this.currentPath().split('$ZIP:');
		return Utils.getFileExtension(aPath[0]) === 'zip';
	}, this);
	this.dropPath = ko.observable('');
	ko.computed(function () {
		this.dropPath(this.currentPath());
	}, this);
	
	this.filesCollection = ko.computed(function () {
		var aFiles = _.union(this.files(), this.getUploadingFiles());
		
		aFiles.sort(function(left, right) {
			return left.fileName() === right.fileName() ? 0 : (left.fileName() < right.fileName() ? -1 : 1);
		});
		
		return aFiles;
	}, this);
	
	this.collection = ko.computed(function () {
		return _.union(this.folders(), this.filesCollection());
	}, this);
	
	this.columnCount = ko.observable(1);
	
	this.selector = new CSelector(this.collection, _.bind(this.onItemSelect, this),
		_.bind(this.onItemDelete, this), _.bind(this.onItemDblClick, this), _.bind(this.onEnter, this), this.columnCount, true, true, true);
		
	this.firstSelectedFile = ko.computed(function () {
		return _.find(this.selector.listCheckedAndSelected(), function (oItem) {
			return oItem instanceof CFileModel;
		});
	}, this);
	this.selectedCount = ko.computed(function () {
		return this.selector.listCheckedAndSelected().length;
	}, this);
	
	this.searchPattern = ko.observable('');
	this.newSearchPattern = ko.observable('');
	this.isSearchFocused = ko.observable(false);

	this.checkedReadyForOperations = ko.computed(function () {
		var  aItems = this.selector.listCheckedAndSelected() || [];
		return aItems.every(function (oItem)  {
			return !(oItem.uploaded !== undefined && oItem.uploaded() === false || oItem.downloading !== undefined && oItem.downloading() === true);
		});
	}, this);
	this.renameCommand = Utils.createCommand(this, this.executeRename, function () {
		return	!this.isZipFolder()
				&& this.checkedReadyForOperations() && this.selector.listCheckedAndSelected().length === 1
				&& !this.isDisabledRenameButton();
	});
	this.deleteCommand = Utils.createCommand(this, this.executeDelete, function () {
		return	this.storageType() !== Enums.FileStorageType.Shared && !this.isZipFolder()
				&& this.checkedReadyForOperations() && this.selector.listCheckedAndSelected().length > 0
				&& !this.isDisabledDeleteButton();
	});
	this.downloadCommand = Utils.createCommand(this, this.executeDownload, function () {
		if (this.checkedReadyForOperations())
		{
			var oFile = this.getFileIfOnlyOneSelected();
			return !!oFile && oFile.hasAction('download');
		}
		return false;
	});
	this.shareCommand = Utils.createCommand(this, this.executeShare, function () {
		var aItems = this.selector.listCheckedAndSelected();
		return !this.isZipFolder() && this.checkedReadyForOperations() && 1 === aItems.length && (!aItems[0].bIsLink);
	});
	this.sendCommand = Utils.createCommand(this, this.executeSend, function () {
		if (!this.isZipFolder() && this.checkedReadyForOperations())
		{
			var
				aItems = this.selector.listCheckedAndSelected(),
				aFileItems = _.filter(aItems, function (oItem) {
					return oItem instanceof CFileModel;
				}, this)
			;
			return (aFileItems.length > 0);
		}
		return false;
	});

	this.uploaderButton = ko.observable(null);
	this.uploaderArea = ko.observable(null);
	this.bDragActive = ko.observable(false);
	this.isNewItemsMenuOpened = ko.observable(false);

	this.bDragActiveComp = ko.computed(function () {
		var bDrag = this.bDragActive();
		return bDrag && this.searchPattern() === '';
	}, this);
	
	this.bAllowDragNDrop = false;
	
	this.uploadError = ko.observable(false);
	
	this.quota = ko.observable(0);
	this.used = ko.observable(0);
	this.quotaDesc = ko.observable('');
	this.quotaProc = ko.observable(-1);
	
	this.aBottomLeftCornerLinks = Settings.BottomLeftCornerLinks;
	
	ko.computed(function () {
		if (!UserSettings.ShowQuotaBar)
		{
			return true;
		}

		var
			iQuota = this.quota(),
			iUsed = this.used(),
			iProc = 0 < iQuota ? Math.ceil((iUsed / iQuota) * 100) : -1
		;

		iProc = 100 < iProc ? 100 : iProc;
		
		this.quotaProc(iProc);
		this.quotaDesc(-1 < iProc ?
			TextUtils.i18n('COREWEBCLIENT/INFO_QUOTA', {
				'PROC': iProc,
				'QUOTA': TextUtils.getFriendlySize(iQuota)
			}) : '')
		;
		
		if (UserSettings.QuotaWarningPerc > 0 && iProc !== -1 && UserSettings.QuotaWarningPerc > (100 - iProc))
		{
			Screens.showError(TextUtils.i18n('COREWEBCLIENT/WARNING_QUOTA_ALMOST_REACHED'), true);
		}
	}, this);
	
	this.dragover = ko.observable(false);
	
	this.loading = ko.observable(false);
	this.loadedFiles = ko.observable(false);

	this.fileListInfoText = ko.computed(function () {
		var sInfoText = '';
		
		if (this.loading())
		{
			sInfoText = TextUtils.i18n('COREWEBCLIENT/INFO_LOADING');
		}
		else if (this.loadedFiles())
		{
			if (this.collection().length === 0)
			{
				if (this.searchPattern() !== '')
				{
					sInfoText = TextUtils.i18n('FILESWEBCLIENT/INFO_NOTHING_FOUND');
				}
				else if (this.storageType() === Enums.FileStorageType.Shared)
				{
					sInfoText = TextUtils.i18n('FILESWEBCLIENT/INFO_SHARED_FOLDER_IS_EMPTY');
				}
				else if (this.currentPath() !== '' || this.bInPopup || this.bPublic)
				{
					sInfoText = TextUtils.i18n('FILESWEBCLIENT/INFO_FOLDER_IS_EMPTY');
				}
				else if (this.bAllowDragNDrop)
				{
					sInfoText = TextUtils.i18n('FILESWEBCLIENT/INFO_DRAGNDROP_FILES_OR_CREATE_FOLDER');
				}
			}
		}
		else if (this.error())
		{
			sInfoText = TextUtils.i18n('FILESWEBCLIENT/ERROR_FILES_NOT_RECEIVED');
		}
		
		return sInfoText;
	}, this);
	
	this.dragAndDropHelperBound = _.bind(this.dragAndDropHelper, this);
	this.bInPopup = !!bPopup;
	this.isCurrentStorageExternal = ko.computed(function () {
		var oStorage = this.getStorageByType(this.storageType());
		return (oStorage && oStorage.isExternal);
	}, this);
	this.timerId = null;
	
	var oParams = {
		'View': this,
		'TemplateName': 'FilesWebclient_ItemsView'
	};
	this.itemsViewTemplate = ko.observable(oParams.TemplateName);
	App.broadcastEvent('Files::ChangeItemsView', oParams);
	
	this.addToolbarButtons = ko.observableArray([]);
	
	App.subscribeEvent('Files::ShowList', _.bind(function (oParams) {
		if (this.shown() && oParams.Item)
		{
			this.routeFiles(oParams.Item.storageType(), oParams.Item.fullPath());
		}
	}, this));
	App.broadcastEvent('FilesWebclient::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
	
	ConfirmPopup.opened.subscribe(_.bind(function() {
		if (this.shown())
		{
			this.selector.useKeyboardKeys(true);
		}
	}, this));
	
	this.createFolderButtonModules = ko.observableArray([]);	//list of modules that disable "create folder" button
	this.renameButtonModules = ko.observableArray([]);	//list of modules that disable "rename" button
	this.deleteButtonModules = ko.observableArray([]);	//list of modules that disable "delete" button
	this.shortcutButtonModules = ko.observableArray([]);	//list of modules that disable "shortcut" button
	this.isDisabledCreateFolderButton = ko.computed(function () {
		return this.createFolderButtonModules().length > 0;
	}, this);
	this.isDisabledRenameButton = ko.computed(function () {
		return this.renameButtonModules().length > 0;
	}, this);
	this.isDisabledDeleteButton = ko.computed(function () {
		return this.deleteButtonModules().length > 0;
	}, this);
	this.isDisabledShortcutButton = ko.computed(function () {
		return this.shortcutButtonModules().length > 0;
	}, this);
	this.createFolderCommand = Utils.createCommand(this, this.executeCreateFolder, function () {
		return !this.isZipFolder() && !this.isDisabledCreateFolderButton();
	});
	this.createShortcutCommand = Utils.createCommand(this, this.executeCreateShortcut, function () {
		return !this.isZipFolder() && !this.isDisabledShortcutButton() && !this.isCurrentStorageExternal();
	});
	this.PublicLinksEnabled = Settings.PublicLinksEnabled;
}

_.extendOwn(CFilesView.prototype, CAbstractScreenView.prototype);

CFilesView.prototype.ViewTemplate = App.isPublic() ? 'FilesWebclient_PublicFilesView' : 'FilesWebclient_FilesView';
CFilesView.prototype.ViewConstructorName = 'CFilesView';

CFilesView.prototype.registerCreateButtonsController = function (oBigButtonView)
{
	this.createButtonsControllers().push(oBigButtonView);
};

/**
 * @param {object} $popupDom
 */
CFilesView.prototype.onBind = function ($popupDom)
{
	var $dom = this.$viewDom || $popupDom;
	this.selector.initOnApplyBindings(
		'.items_sub_list .item',
		'.items_sub_list .selected.item',
		'.items_sub_list .item .custom_checkbox',
		$('.panel.files .items_list', $dom),
		$('.panel.files .items_list .files_scroll.scroll-inner', $dom)
	);
	
	this.initUploader();

	this.hotKeysBind();
};

CFilesView.prototype.hotKeysBind = function ()
{
	$(document).on('keydown', _.bind(function(ev) {
		if (this.shown() && ev && ev.keyCode === Enums.Key.s && this.selector.useKeyboardKeys() && !Utils.isTextFieldFocused())
		{
			ev.preventDefault();
			this.isSearchFocused(true);
		}
	}, this));
};

/**
 * Initializes file uploader.
 */
CFilesView.prototype.initUploader = function ()
{
	var self = this;
	
	if (!this.bPublic && this.uploaderButton() && this.uploaderArea())
	{
		this.oJua = new CJua({
			'action': '?/Api/',
			'name': 'jua-uploader',
			'queueSize': 2,
			'clickElement': this.uploaderButton(),
			'hiddenElementsPosition': UserSettings.IsRTL ? 'right' : 'left',
			'dragAndDropElement': this.uploaderArea(),
			'disableAjaxUpload': false,
			'disableFolderDragAndDrop': false,
			'disableDragAndDrop': false,
			'hidden': _.extendOwn({
				'Module': Settings.ServerModuleName,
				'Method': 'UploadFile',
				'Parameters':  function (oFile) {
					return JSON.stringify({
						'Type': self.storageType(),
						'SubPath': oFile && oFile.Folder || '',
						'Path': self.dropPath(),
						'Overwrite': false
					});
				}
			}, App.getCommonRequestParameters())
		});

		this.oJua
			.on('onProgress', _.bind(this.onFileUploadProgress, this))
			.on('onSelect', _.bind(this.onFileUploadSelect, this))
			.on('onStart', _.bind(this.onFileUploadStart, this))
			.on('onDrop', _.bind(this.onDrop, this))
			.on('onComplete', _.bind(this.onFileUploadComplete, this))
			.on('onBodyDragEnter', _.bind(this.bDragActive, this, true))
			.on('onBodyDragLeave', _.bind(this.bDragActive, this, false))
			.on('onCancel', _.bind(this.onCancelUpload, this))
			.on('onDialog', _.bind(function () {
				setTimeout(_.bind(this.isNewItemsMenuOpened, this, false), 0);
			}, this, false))
		;
		
		this.bAllowDragNDrop = this.oJua.isDragAndDropSupported();
	}
};

/**
 * Creates new attachment for upload.
 *
 * @param {string} sFileUid
 * @param {Object} oFileData
 */
CFilesView.prototype.onFileUploadSelect = function (sFileUid, oFileData)
{
	if (Settings.EnableUploadSizeLimit && oFileData.Size/(1024*1024) > Settings.UploadSizeLimitMb)
	{
		Popups.showPopup(AlertPopup, [
			TextUtils.i18n('FILESWEBCLIENT/ERROR_SIZE_LIMIT', {'FILENAME': oFileData.FileName, 'SIZE': Settings.UploadSizeLimitMb})
		]);
		return false;
	}
	
	if (this.storageType() === Enums.FileStorageType.Personal && Types.isPositiveNumber(this.quota()))
	{
		if (this.quota() > 0 && this.used() + oFileData.Size > this.quota())
		{
			Popups.showPopup(AlertPopup, [
				TextUtils.i18n('COREWEBCLIENT/ERROR_CANT_UPLOAD_FILE_QUOTA')
			]);
			return false;
		}
	}
	
	if (this.searchPattern() === '')
	{
		var 
			oData = CFileModel.prepareUploadFileData(oFileData, this.currentPath(), this.storageType(), _.bind(function (sFileName) {
				if (this.getFileByName(sFileName))
				{
					return true;
				}
				else
				{
					return !!_.find(this.getUploadingFiles(), function (oItem) {
						return oItem.fileName() === sFileName;
					});
				}
			}, this)),
			oFile = new CFileModel(oData)
		;
		oFile.onUploadSelect(sFileUid, oFileData, true);
		this.uploadingFiles.push(oFile);
		this.onFileFromSubfolderUploadSelect(oFileData);
	}
};

/**
 * If selected for upload file is from subfolder increase uploading files count for this folder.
 * @param {Object} oFileData
 */
CFilesView.prototype.onFileFromSubfolderUploadSelect = function (oFileData)
{
	if (Types.isNonEmptyString(oFileData.Folder))
	{
		var
			aPath = _.compact(oFileData.Folder.split('/')),
			sFolderName = aPath[0],
			oFolder = _.find(this.folders(), function (oTmpFolder) {
				return oTmpFolder.fileName() === sFolderName;
			})
		;
		if (sFolderName && !oFolder)
		{
			oFolder = new CFolderModel();
			oFolder.parse({
				Name: sFolderName
			});
			this.folders.push(oFolder);
		}
		oFolder.increaseUploadingFiles();
	}
};

/**
 * Finds attachment by uid. Calls it's function to start upload.
 *
 * @param {string} sFileUid
 */
CFilesView.prototype.onFileUploadStart = function (sFileUid)
{
	var oFile = this.getUploadFileByUid(sFileUid);

	if (oFile)
	{
		oFile.onUploadStart();
	}
};

/**
 * Finds attachment by uid. Calls it's function to progress upload.
 *
 * @param {string} sFileUid
 * @param {number} iUploadedSize
 * @param {number} iTotalSize
 */
CFilesView.prototype.onFileUploadProgress = function (sFileUid, iUploadedSize, iTotalSize)
{
	if (this.searchPattern() === '')
	{
		var oFile = this.getUploadFileByUid(sFileUid);

		if (oFile)
		{
			oFile.onUploadProgress(iUploadedSize, iTotalSize);
		}
	}
};

/**
 * Finds attachment by uid. Calls it's function to complete upload.
 *
 * @param {string} sFileUid File identifier.
 * @param {boolean} bResponseReceived Indicates if upload was successfull.
 * @param {Object} oResult Response from the server.
 */
CFilesView.prototype.onFileUploadComplete = function (sFileUid, bResponseReceived, oResult)
{
	if (this.searchPattern() === '')
	{
		var
			oFile = this.getUploadFileByUid(sFileUid),
			bRequestFiles = false
		;
		
		if (oFile)
		{
			oFile.onUploadComplete(sFileUid, bResponseReceived, oResult);
			this.onFileWithSubfolderUploadComplete(oFile);
			this.deleteUploadFileByUid(sFileUid);
			
			if (oFile.uploadError())
			{
				this.uploadError(true);
				if (oResult && oResult.ErrorCode === Enums.Errors.CanNotUploadFileQuota)
				{
					Popups.showPopup(AlertPopup, [TextUtils.i18n('COREWEBCLIENT/ERROR_CANT_UPLOAD_FILE_QUOTA')]);
					bRequestFiles = true;
				}
				else if (oResult && oResult.ErrorCode === Enums.Errors.FileAlreadyExists)
				{
					bRequestFiles = true;
					Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_FILE_ALREADY_EXISTS'));
				}
				else if (oResult && oResult.ErrorCode === Enums.Errors.FileNotFound)
				{
					bRequestFiles = true;
					Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_FILE_NOT_FOUND'));
				}
				else
				{
					Screens.showError(oFile.statusText());
				}
			}
			else
			{
				if (oFile.path() === this.currentPath() && oFile.storageType() === this.storageType())
				{
					this.files.push(oFile);
				}
				if (this.uploadingFiles().length === 0)
				{
					Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_UPLOAD_COMPLETE'));
				}
			}
			if (this.uploadingFiles().length === 0)
			{
				bRequestFiles = true;
			}
		}
		else
		{
			bRequestFiles = true;
		}
		
		if (bRequestFiles)
		{
			this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern(), true);
		}
	}
};

/**
 * If uploaded file is from subfolder increase uploaded files count for this folder.
 * @param {Object} oFile
 */
CFilesView.prototype.onFileWithSubfolderUploadComplete = function (oFile)
{
	if (oFile.sUploadSubFolder)
	{
		var
			aPath = _.compact(oFile.sUploadSubFolder.split('/')),
			sFolderName = aPath[0],
			oFolder = _.find(this.folders(), function (oTmpFolder) {
				return oTmpFolder.fileName() === sFolderName;
			})
		;
		if (oFolder)
		{
			oFolder.increaseUploadedFiles();
		}
	}
};

/**
 * @param {Object} oFile
 * @param {Object} oEvent
 */
CFilesView.prototype.onDrop = function (oFile, oEvent)
{
	if (this.bPublic)
	{
		return;
	}

	if (oEvent && oEvent.target && this.searchPattern() === '')
	{
		var oFolder = ko.dataFor(oEvent.target);
		if (oFolder && oFolder instanceof CFolderModel)
		{
			this.dropPath(oFolder.fullPath());
		}
	}
	else
	{
		Screens.showReport(TextUtils.i18n('FILESWEBCLIENT/INFO_CANNOT_UPLOAD_SEARCH_RESULT'));
	}
};

/**
 * @param {Object} oFolder
 * @param {Object} oEvent
 * @param {Object} oUi
 */
CFilesView.prototype.filesDrop = function (oFolder, oEvent, oUi)
{
	if (oEvent)
	{
		var
			aChecked = this.selector.listCheckedAndSelected(),
			sMethod = oEvent.ctrlKey ? 'Copy' : 'Move'
		;
		
		if (this.moveItems(sMethod, oFolder, aChecked))
		{
			Utils.uiDropHelperAnim(oEvent, oUi);
		}
	}
};

/**
 * @param {string} sMethod
 * @param {object} oFolder
 * @param {array} aChecked
 * @returns {boolean}
 */
CFilesView.prototype.moveItems = function (sMethod, oFolder, aChecked)
{
	if (this.bPublic)
	{
		return false;
	}
	
	var
		sFromPath = '',
		sFromStorageType = '',
		bFromAllSame = true,
		bFolderIntoItself = false,
		sToPath = oFolder instanceof CFolderModel ? oFolder.fullPath() : '',
		aItems = [],
		sStorageType = oFolder ? (oFolder instanceof CFolderModel ? oFolder.storageType() : oFolder.type) : this.storageType(),
		oToStorage = this.getStorageByType(sStorageType),
		oFromStorage = this.getStorageByType(this.storageType()),
		bSameStorage = oToStorage.type === oFromStorage.type,
		iUsed = this.used(),
		iQuota = this.quota(),
		bAllowMove = true
	;
	
	if (bSameStorage || !bSameStorage && !oToStorage.isExternal && !oFromStorage.isExternal && Enums.FileStorageType.Shared !== oToStorage.type)
	{
		if (oToStorage.type === Enums.FileStorageType.Personal && oFromStorage.type !== Enums.FileStorageType.Personal)
		{
			bAllowMove = _.every(aChecked, function (oItem) {
				if (oItem instanceof CFileModel)
				{
					if (iQuota > 0 && iUsed + oItem.size() > iQuota)
					{
						return false;
					}
					iUsed = iUsed + oItem.size();
				}
				return true;
			});

			if (!bAllowMove)
			{
				Popups.showPopup(AlertPopup, [TextUtils.i18n('FILESWEBCLIENT/ERROR_CANT_MOVE_FILES_QUOTA_PLURAL', {}, '', aChecked.length)]);
				return false;
			}
		}
		
		_.each(aChecked, _.bind(function (oItem) {
			if (sFromPath !== '' && sFromPath !== oItem.path() || sFromStorageType !== '' && sFromStorageType !== oItem.storageType())
			{
				bFromAllSame = false;
			}
			sFromPath = oItem.path();
			sFromStorageType = oItem.storageType();
			bFolderIntoItself = oItem instanceof CFolderModel && sToPath === sFromPath + '/' + oItem.id();
			if (!bFolderIntoItself)
			{
				if (sMethod === 'Move')
				{
					if (oItem instanceof CFileModel)
					{
						this.deleteFileByName(oItem.id());
					}
					else
					{
						this.deleteFolderByName(oItem.fileName());
					}
				}
				aItems.push({
					'FromType': sFromStorageType,
					'FromPath': sFromPath,
					'Name':  oItem.id(),
					'IsFolder': oItem instanceof CFolderModel
				});
			}
		}, this));
		
		if (aItems.length > 0)
		{
			if (!bFromAllSame)
			{
				sFromStorageType = '';
				sFromPath = '';
			}
			Ajax.send(sMethod, {
				'FromType': sFromStorageType,
				'ToType': sStorageType,
				'FromPath': sFromPath,
				'ToPath': sToPath,
				'Files': aItems
			}, this.onMoveResponse, this);

			if (oFolder instanceof CFolderModel)
			{
				oFolder.recivedAnim(true);
			}

			return true;
		}
	}

	return false;
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFilesView.prototype.onMoveResponse = function (oResponse, oRequest)
{
	if (!oResponse.Result)
	{
		if (oResponse.ErrorCode === Enums.Errors.CanNotUploadFileQuota)
		{
			Popups.showPopup(AlertPopup, [TextUtils.i18n('FILESWEBCLIENT/ERROR_CANT_MOVE_FILES_QUOTA_PLURAL', {}, '', oRequest.Parameters.Files.length)]);
		}
		else
		{
			Api.showErrorByCode(oResponse, TextUtils.i18n('FILESWEBCLIENT/ERROR_FILES_MOVE_PLURAL', {}, '', oRequest.Parameters.Files.length));
		}
		this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern());
	}
	else
	{
		if (this.storageType() === oRequest.Parameters.ToType && this.currentPath() === oRequest.Parameters.ToPath)
		{
			this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern());
		}
		else
		{
			this.getQuota();
		}
	}
};

/**
 * @param {Object} oFile
 */
CFilesView.prototype.dragAndDropHelper = function (oFile)
{
	if (oFile)
	{
		oFile.checked(true);
	}

	var
		oHelper = Utils.draggableItems(),
		aItems = this.selector.listCheckedAndSelected(),
		nCount = aItems.length,
		nFilesCount = 0,
		nFoldersCount = 0,
		sText = '';
	
	_.each(aItems, function (oItem) {
		if (oItem instanceof CFolderModel)
		{
			nFoldersCount++;
		}
		else
		{
			nFilesCount++;
		}

	}, this);
	
	if (nFilesCount !== 0 && nFoldersCount !== 0)
	{
		sText = TextUtils.i18n('FILESWEBCLIENT/LABEL_DRAG_ITEMS_PLURAL', {'COUNT': nCount}, null, nCount);
	}
	else if (nFilesCount === 0)
	{
		sText = TextUtils.i18n('FILESWEBCLIENT/LABEL_DRAG_FOLDERS_PLURAL', {'COUNT': nFoldersCount}, null, nFoldersCount);
	}
	else if (nFoldersCount === 0)
	{
		sText = TextUtils.i18n('FILESWEBCLIENT/LABEL_DRAG_FILES_PLURAL', {'COUNT': nFilesCount}, null, nFilesCount);
	}
	
	$('.count-text', oHelper).text(sText);

	return oHelper;
};

CFilesView.prototype.onItemDelete = function ()
{
	var 
		aItems = this.selector.listCheckedAndSelected(),
		bAllow = aItems.every(function (oItem)  {
			return !(oItem.uploaded !== undefined && oItem.uploaded() === false || oItem.downloading !== undefined && oItem.downloading() === true);
		})
	;
	if (0 < aItems.length && bAllow)
	{
		this.executeDelete();
	}
};

CFilesView.prototype.onItemSelect = function (oItem)
{
	if (App.isMobile() && oItem instanceof CFolderModel)
	{
		this.onItemDblClick(oItem);
	}
};

/**
 * @param {CFileModel|CFolderModel} oItem
 */
CFilesView.prototype.onEnter = function (oItem)
{
	this.onItemDblClick(oItem);
};

/**
 * Executes on item double click.
 * @param {CFileModel|CFolderModel} oItem
 */
CFilesView.prototype.onItemDblClick = function (oItem)
{
	if (oItem)
	{
		var sMainAction = oItem.getMainAction();
		switch (sMainAction)
		{
			case 'view':
				if (oItem instanceof CFileModel)
				{
					if (this.onSelectClickPopupBound)
					{
						this.onSelectClickPopupBound();
					}
					else
					{
						oItem.executeAction(sMainAction);
					}
				}
				break;
			case 'list':
				if (!(oItem instanceof CFolderModel) || !oItem.isIncomplete())
				{
					this.routeFiles(oItem.storageType(), oItem.fullPath());
				}
				break;
		}
	}
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFilesView.prototype.onGetFilesResponse = function (oResponse, oRequest)
{
	var
		oResult = oResponse.Result,
		oParameters = oRequest.Parameters
	;
	
	this.bNotLoading = false;
	
	if ((oParameters.Type === this.storageType() || oParameters.Hash === Settings.PublicHash) && oParameters.Path === this.currentPath())
	{
		if (oResult)
		{
			var
				aNewFolderList = [],
				aNewFileList = []
			;

			_.each(oResult.Items, function (oData) {
				if (oData.IsFolder)
				{
					var oFolder = new CFolderModel();
					oFolder.parse(oData);
					this.checkIfFolderUploading(oFolder);
					aNewFolderList.push(oFolder);
				}
				else
				{
					var oFile = new CFileModel(oData, this.bInPopup);

					if (oFile.oExtendedProps && oFile.oExtendedProps.Loading)
					{ // if file still loading - show warning in status
						oFile.uploadError(true);
						oFile.statusText(TextUtils.i18n('COREWEBCLIENT/LABEL_FILE_LOADING'));
					}
					oFile.index(aNewFileList.length);
					aNewFileList.push(oFile);
				}
			}, this);
			
			// save status of files that are being loaded
			_.each(this.files(), function (oTmpFile, iFileIndex, aFiles) {
				if (oTmpFile.downloading())
				{
					var iNewIndex = _.findIndex(aNewFileList, function (oNewTmpFile) {
						return oTmpFile.fileName() === oNewTmpFile.fileName();
					});
					if (iNewIndex !== -1)
					{
						aFiles[iFileIndex].index(aNewFileList[iNewIndex].index());
						aNewFileList[iNewIndex] = aFiles[iFileIndex];
					}
				}
			});

			this.folders(aNewFolderList);
			this.files(aNewFileList);

			this.newSearchPattern(oParameters.Pattern || '');
			this.searchPattern(oParameters.Pattern || '');

			this.loadedFiles(true);
			clearTimeout(this.timerId);

			this.parseQuota(oResult.Quota);

			if (_.isArray(oResult.Path))
			{
				this.pathItems.removeAll();
				_.each(oResult.Path.reverse(), _.bind(function (oPathItem) {
					var oFolder = new CFolderModel();
					oFolder.parse(oPathItem);
					this.pathItems.push(oFolder);
				}, this));
			}
			this.loading(false);
			//If the current path does not contain information about access, we obtain such information from the response, if possible
			if (oResult.Access && this.pathItems().length > 0)
			{
				if (!this.pathItems()[this.pathItems().length - 1].oExtendedProps)
				{
					this.pathItems()[this.pathItems().length - 1].oExtendedProps = {
						'Access': oResult.Access
					};
					this.pathItems.valueHasMutated(); // for triggering in other modules
				}
				else if (!this.pathItems()[this.pathItems().length - 1].oExtendedProps.Access)
				{
					this.pathItems()[this.pathItems().length - 1].oExtendedProps.Access = oResult.Access;
					this.pathItems.valueHasMutated(); // for triggering in other modules
				}
			}
		}
		else
		{
			if (oResponse.ErrorCode !== Enums.Errors.NotDisplayedError)
			{
				this.loading(false);
				this.error(true);
			}
		}
	}
};

/**
 * Checks if folder has uploding files and marks it as uploading.
 * @param {Object} oFolder
 */
CFilesView.prototype.checkIfFolderUploading = function (oFolder) {
	_.each(this.uploadingFiles(), function (oFile) {
		if (oFile.sUploadSubFolder)
		{
			var
				aPath = _.compact(oFile.sUploadSubFolder.split('/')),
				sFolderName = aPath[0]
			;
			if (oFolder.fileName() === sFolderName)
			{
				oFolder.increaseUploadingFiles();
			}
		}
	});
};

/**
 * Runs after getting quota information from the server. Fill quota values.
 * 
 * @param {Object} oQuota
 */
CFilesView.prototype.parseQuota = function (oQuota)
{
	if (oQuota)
	{
		this.quota(oQuota.Limit);
		this.used(oQuota.Used);
	}
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFilesView.prototype.onDeleteResponse = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		this.expungeFileItems();
		this.getQuota();
	}
	else
	{
		Api.showErrorByCode(oResponse);
		this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern());
	}
};

CFilesView.prototype.executeRename = function ()
{
	var
		oItem = _.first(this.selector.listCheckedAndSelected()),
		bSeparateExtension = Settings.EditFileNameWithoutExtension && oItem instanceof CFileModel,
			sName = bSeparateExtension ? Utils.getFileNameWithoutExtension(oItem.fileName()) : oItem.fileName(),
			sExtension = bSeparateExtension ? Utils.getFileExtension(oItem.fileName()) : ''
	;
	
	if (!this.bPublic && oItem)
	{
		Popups.showPopup(RenamePopup, [sName, _.bind(this.renameItem, this, sExtension)]);
	}
};

/**
 * @param {string} sExtension
 * @param {string} sNamePart
 * @returns {string}
 */
CFilesView.prototype.renameItem = function (sExtension, sNamePart)
{
	var
		sName = (sExtension === '') ? sNamePart : sNamePart + '.' + sExtension,
		oItem = _.first(this.selector.listCheckedAndSelected())
	;
	
	if (!Utils.validateFileOrFolderName(sName))
	{
		return oItem instanceof CFolderModel ?
			TextUtils.i18n('FILESWEBCLIENT/ERROR_INVALID_FOLDER_NAME') : TextUtils.i18n('FILESWEBCLIENT/ERROR_INVALID_FILE_NAME');
	}
	else
	{
		Ajax.send('Rename', {
				'Type': oItem.storageType(),
				'Path': oItem.path(),
				'Name': oItem.id() || oItem.fileName(),
				'NewName': sName,
				'IsLink': oItem.bIsLink ? 1 : 0,
				'IsFolder': oItem instanceof CFolderModel
			}, this.onRenameResponse, this
		);
	}
	
	return '';
};

CFilesView.prototype.getFileIfOnlyOneSelected = function ()
{
	var aItems = this.selector.listCheckedAndSelected();
	return (1 === aItems.length && aItems[0] instanceof CFileModel) ? aItems[0] : null;
};

CFilesView.prototype.executeDownload = function ()
{
	var oFile = this.getFileIfOnlyOneSelected();
	if (oFile)
	{
		oFile.executeAction('download');
	}
};

CFilesView.prototype.executeShare = function ()
{
	var oItem = _.first(this.selector.listCheckedAndSelected());
	
	if (!this.bPublic && oItem)
	{
		Popups.showPopup(SharePopup, [oItem]);
	}
};

CFilesView.prototype.executeSend = function ()
{
	var
		aItems = this.selector.listCheckedAndSelected(),
		aFileItems = _.filter(aItems, function (oItem) {
			return oItem instanceof CFileModel;
		}, this),
		aFilesData = _.map(aFileItems, function (oItem) {
			return {
				'Storage': oItem.storageType(),
				'Path': oItem.path(),
				'Name': oItem.fileName(),
				'Id': oItem.id()
			};
		})
	;
	
	if (this.bAllowSendEmails && aFileItems.length > 0)
	{
		Ajax.send('SaveFilesAsTempFiles', { 'Files': aFilesData }, function (oResponse) {
			if (oResponse.Result)
			{
				ComposeMessageWithAttachments(oResponse.Result);
			}
		}, this);
	}
};

/**
 * @param {Object} oItem
 */
CFilesView.prototype.onShareIconClick = function (oItem)
{
	if (oItem)
	{
		Popups.showPopup(SharePopup, [oItem]);
	}
};

/**
 * @param {Object} oItem
 */
CFilesView.prototype.onSecureIconClick = function (oItem)
{
	if (oItem && _.isFunction(oItem.onSecureIconClick))
	{
		oItem.onSecureIconClick(oItem);
	}
};

/**
 * @param {Object} oItem
 */
CFilesView.prototype.onFileShareIconClick = function (oItem)
{
	if (FilesSharePopup && oItem)
	{
		Popups.showPopup(FilesSharePopup, [oItem]);
	}
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFilesView.prototype.onRenameResponse = function (oResponse, oRequest)
{
	if (!oResponse.Result)
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('FILESWEBCLIENT/ERROR_FILE_RENAME'));
	}
	
	this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern(), true);
};

CFilesView.prototype.refresh = function ()
{
	this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern(), true);
};

CFilesView.prototype.executeDelete = function ()
{
	var
		aChecked = this.selector.listCheckedAndSelected() || [],
		iCheckedCount = aChecked.length,
		bHasFolder = !!_.find(aChecked, function (oItem) {
			return oItem instanceof CFolderModel;
		}),
		bHasFile = !!_.find(aChecked, function (oItem) {
			return !(oItem instanceof CFolderModel);
		}),
		sConfirm = ''
	;
	
	if (bHasFolder && bHasFile)
	{
		sConfirm = TextUtils.i18n('FILESWEBCLIENT/CONFIRM_DELETE_ITEMS_PLURAL', {'COUNT': iCheckedCount}, null, iCheckedCount);
	}
	else if (bHasFolder)
	{
		sConfirm = TextUtils.i18n('FILESWEBCLIENT/CONFIRM_DELETE_FOLDERS_PLURAL', {'COUNT': iCheckedCount}, null, iCheckedCount);
	}
	else
	{
		sConfirm = TextUtils.i18n('FILESWEBCLIENT/CONFIRM_DELETE_FILES_PLURAL', {'COUNT': iCheckedCount}, null, iCheckedCount);
	}
	
	if (!this.bPublic && iCheckedCount > 0)
	{
		this.selector.useKeyboardKeys(false);
		Popups.showPopup(ConfirmPopup, [sConfirm, _.bind(this.deleteItems, this, aChecked), '', TextUtils.i18n('COREWEBCLIENT/ACTION_DELETE')]);
	}
};

CFilesView.prototype.onShow = function ()
{
	this.loaded(true);
	
	if (!this.bPublic)
	{
		this.requestStorages();
	}

	this.selector.useKeyboardKeys(true);

	if (this.oJua)
	{
		this.oJua.setDragAndDropEnabledStatus(true);
	}
};

CFilesView.prototype.onHide = function ()
{
	this.selector.useKeyboardKeys(false);
	if (this.oJua)
	{
		this.oJua.setDragAndDropEnabledStatus(false);
	}
};

CFilesView.prototype.getQuota = function ()
{
	Ajax.send('GetQuota',
		{
			'Type': this.storageType()
		},
		function (oResponse) {
			if (oResponse.Result)
			{
				this.parseQuota(oResponse.Result);
			}
		},
		this
	);
};

/**
 * @param {string} sStorageType
 */
CFilesView.prototype.getStorageByType = function (sStorageType)
{
	return _.find(this.storages(), function (oStorage) { 
		return oStorage.type === sStorageType; 
	});	
};

/**
 * Requests storages from the server.
 */
CFilesView.prototype.requestStorages = function ()
{
	Ajax.send('GetStorages', null, this.onGetStoragesResponse, this);
};

/**
 * Parses server response to a request of storages.
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFilesView.prototype.onGetStoragesResponse = function (oResponse, oRequest)
{
	var oResult = oResponse.Result;
	if (oResult)
	{
		_.each(oResult, function(oStorage) {
			if (oStorage.Type && !this.getStorageByType(oStorage.Type))
			{
				this.storages.push({
					isExternal: oStorage.IsExternal,
					type: oStorage.Type,
					displayName: oStorage.DisplayName,
					droppable: Types.pBool(oStorage.IsDroppable, true)
				});
			}
		}, this);
		
		this.expungeExternalStorages(_.map(oResult, function(oStorage){
			return oStorage.Type;
		}, this));
	}
	if (!this.getStorageByType(this.storageType()))
	{
		this.storageType(Enums.FileStorageType.Personal);
		this.pathItems.removeAll();
	}
	
	if (this.bInPopup)
	{
		this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern(), true);
	}
};

/**
 * Clears file/folder list and displays loading message.
 */
CFilesView.prototype.showLoading = function ()
{
	this.folders([]);
	this.files([]);
	this.loading(true);
};

/**
 * Sets routing hash.
 * @param {string} sStorage Storage type.
 * @param {string=} sFullPath = '' Path to files/folders to display.
 * @param {string=} sSearch = '' Search string.
 * @param {boolean=} bNotLoading = false Indicates if loading message should be displayed with delay.
 */
CFilesView.prototype.routeFiles = function (sStorage, sFullPath, sSearch, bNotLoading)
{
	var
		bSame = false,
		bPathRequired = false
	;
	
	if (this.bPublic)
	{
		bSame = Routing.setHash(LinksUtils.getFiles('', sFullPath, ''));
		if (bSame)
		{
			this.showLoading();
			Ajax.send('GetPublicFiles', {
					'Hash': Settings.PublicHash,
					'Path': this.currentPath()
				}, this.onGetFilesResponse, this
			);
		}
	}
	else
	{
		this.bNotLoading = bNotLoading;
		if (this.bInPopup)
		{
			this.onUserRoute(LinksUtils.getParsedParams(sStorage, sFullPath, sSearch));
		}
		else
		{
			bSame = Routing.setHash(LinksUtils.getFiles(sStorage, sFullPath, sSearch));
			if (bSame)
			{
				this.showLoading();
				bPathRequired = this.currentPath() !== '' && this.pathItems().length === 0;
				Ajax.send('GetFiles', {
						'Type': this.storageType(),
						'Path': this.currentPath(),
						'Pattern': this.searchPattern(),
						'PathRequired': bPathRequired
					}, this.onGetFilesResponse, this
				);
				if (bPathRequired)
				{
					this.showLoading();
				}
			}
		}
	}
};

/**
 * Adds path item to path item list.
 * @param {string} sStorage Storage type.
 * @param {string} sPath Path of item.
 * @param {string} sName Name of item.
 */
CFilesView.prototype.addPathItems = function (sStorage, sPath, sName)
{
	var oFolder = new CFolderModel();
	oFolder.storageType(sStorage);
	oFolder.displayName(sName);
	oFolder.fileName(sName);
	oFolder.path(sPath);
	oFolder.fullPath(sPath);
	this.pathItems.unshift(oFolder);
};

/**
 * Requests files after routing parse.
 * @param {array} aParams
 */
CFilesView.prototype.onRoute = function (aParams)
{
	var oParams = LinksUtils.parseFiles(aParams);
	
	if (this.bPublic)
	{
		this.onPublicRoute(oParams);
	}
	else
	{
		this.onUserRoute(oParams);
	}
};

/**
 * Requests user files after routing parse.
 * @param {object} oParams
 */
CFilesView.prototype.onUserRoute = function (oParams)
{
	var
		bStorageFound = this.storages().length === 0 || !!_.find(this.storages(), function (oStorage) {
			return oStorage.type === oParams.Storage;
		}),
		sStorage = bStorageFound ? oParams.Storage : (this.storages().length > 0 ? this.storages()[0].type : ''),
		sPath = oParams.Path,
		aPath = oParams.PathParts.reverse(),
		oFolder = _.find(this.folders(), function (oFld) {
			return oFld.fullPath() === sPath;
		}),
		iPathItemIndex = _.findIndex(this.pathItems(), function (oItem) {
			return oItem.fullPath() === sPath;
		}),
		aNewPathItems = [],
		bPathRequired = false
	;
	
	this.error(false);
	
	this.storageType(sStorage);
	this.currentPath(sPath);
	this.loadedFiles(false);
	
	if (iPathItemIndex !== -1)
	{
		_.each(this.pathItems(), function (oItem, iIndex) {
			if (iIndex <= iPathItemIndex)
			{
				aNewPathItems.push(oItem);
			}
		});
		this.pathItems.removeAll();
		this.pathItems(aNewPathItems);
	}
	else if (oFolder)
	{
		this.pathItems.push(oFolder);
	}
	else if (sStorage !== 'google' || sPath === '')
	{
		this.pathItems.removeAll();
		_.each(aPath, _.bind(function (sPathItem) {
			var iItemPos = sPath.lastIndexOf(sPathItem);
			this.addPathItems(sStorage, sPath, sPathItem);
			sPath = sPath.substr(0, iItemPos);
		}, this));
	}
	else
	{
		bPathRequired = true;
	}
	
	if (this.bNotLoading && (this.files().length > 0 || this.folders().length > 0))
	{
		this.timerId = setTimeout(_.bind(function() {
			if (!this.loadedFiles() && !this.error())
			{
				this.showLoading();
			}
		}, this), 3000);				
	}
	else
	{
		this.showLoading();
	}
	
	Ajax.send('GetFiles', {
			'Type': sStorage,
			'Path': oParams.Path,
			'Pattern': Types.pString(oParams.Search),
			'PathRequired': bPathRequired
		}, this.onGetFilesResponse, this
	);
};

/**
 * Requests public files after routing parse.
 * @param {object} oParams
 */
CFilesView.prototype.onPublicRoute = function (oParams)
{
	var 
		sPath = oParams.Path,
		aPath = oParams.PathParts.reverse(),
		sFirstPathItem = ''
	;
	
	this.currentPath(sPath);
	
	this.pathItems.removeAll();
	_.each(aPath, _.bind(function (sPathItem) {
		var iItemPos = sPath.lastIndexOf(sPathItem);
		this.addPathItems(oParams.Storage, sPath, sPathItem);
		sPath = sPath.substr(0, iItemPos);
		sFirstPathItem = sPathItem;
	}, this));
	if (sFirstPathItem !== this.rootPath())
	{
		this.addPathItems(oParams.Storage, '', this.rootPath());
	}
	
	this.showLoading();
	
	Ajax.send('GetPublicFiles', {
			'Hash': Settings.PublicHash,
			'Path': this.currentPath()
		}, this.onGetFilesResponse, this
	);
};

/**
 * @param {Array} aChecked
 * @param {boolean} bOkAnswer
 */
CFilesView.prototype.deleteItems = function (aChecked, bOkAnswer)
{
	var 
		sStorageType = this.storageType(),
		sPath = this.currentPath()
	;
	if (bOkAnswer && 0 < aChecked.length)
	{
		var aItems = _.compact(_.map(aChecked, function (oItem) {
			if (oItem.id() !== '')
			{
				oItem.deleted(true);
				sStorageType = oItem.storageType();
				return {
					'Path': oItem.path(),  
					'Name': oItem.id(),
					'IsFolder': oItem instanceof CFolderModel
				};
			}
			return null;
		}));
		if (aItems.length)
		{
			Ajax.send('Delete', {
					'Type': sStorageType,
					'Path': sPath,
					'Items': aItems
				}, this.onDeleteResponse, this
			);
		}
	}		
};

/**
 * @param {string} sName
 * 
 * @return {?}
 */
CFilesView.prototype.getFileByName = function (sName)
{
	return _.find(this.files(), function (oItem) {
		return oItem.fileName() === sName;
	});
};

/**
 * @param {object} oFile
 */
CFilesView.prototype.addFileToCurrentFolder = function (oFile)
{
	if (this.searchPattern() === '')
	{
		this.files.push(oFile);
	}
};

/**
 * @param {string} sName
 */
CFilesView.prototype.deleteFileByName = function (sName)
{
	this.files(_.filter(this.files(), function (oItem) {
		return oItem.id() !== sName;
	}));
};

/**
 * @param {string} sName
 */
CFilesView.prototype.deleteFolderByName = function (sName)
{
	this.folders(_.filter(this.folders(), function (oItem) {
		return oItem.fileName() !== sName;
	}));
};

CFilesView.prototype.expungeFileItems = function ()
{
	this.folders(_.filter(this.folders(), function (oFolder) {
		return !oFolder.deleted();
	}, this));
	this.files(_.filter(this.files(), function (oFile) {
		return !oFile.deleted();
	}, this));
};

/**
 * @param {array} aStorageTypes
 */
CFilesView.prototype.expungeExternalStorages = function (aStorageTypes)
{
	this.storages(_.filter(this.storages(), function (oStorage) {
		return !oStorage.isExternal || _.include(aStorageTypes, oStorage.type);
	},this));
};

/**
 * @param {string} sFileUid
 * 
 * @return {?}
 */
CFilesView.prototype.getUploadFileByUid = function (sFileUid)
{
	return _.find(this.uploadingFiles(), function(oItem){
		return oItem.uploadUid() === sFileUid;
	});	
};

/**
 * @param {string} sFileUid
 */
CFilesView.prototype.deleteUploadFileByUid = function (sFileUid)
{
	this.uploadingFiles(_.filter(this.uploadingFiles(), function (oItem) {
		return oItem.uploadUid() !== sFileUid;
	}));
};

/**
 * @return {Array}
 */
CFilesView.prototype.getUploadingFiles = function ()
{
	return _.filter(this.uploadingFiles(), _.bind(function (oItem) {
		return oItem.path() === this.currentPath() && oItem.storageType() === this.storageType();
	}, this));	
};

/**
 * @param {string} sFileUid
 */
CFilesView.prototype.onCancelUpload = function (sFileUid)
{
	this.deleteUploadFileByUid(sFileUid);
	if (this.oJua)
	{
		this.oJua.cancel(sFileUid);
	}
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFilesView.prototype.onCreateFolderResponse = function (oResponse, oRequest)
{
	if (!oResponse.Result)
	{
		Api.showErrorByCode(oResponse);
	}
	this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern(), true);
};

/**
 * @param {string} sFolderName
 */
CFilesView.prototype.createFolder = function (sFolderName)
{
	sFolderName = $.trim(sFolderName);
	if (!Utils.validateFileOrFolderName(sFolderName))
	{
		return TextUtils.i18n('FILESWEBCLIENT/ERROR_INVALID_FOLDER_NAME');
	}
	else
	{
		Ajax.send('CreateFolder', {
				'Type': this.storageType(),
				'Path': this.currentPath(),
				'FolderName': sFolderName
			}, this.onCreateFolderResponse, this
		);
	}

	return '';
};

CFilesView.prototype.executeCreateFolder = function ()
{
	Popups.showPopup(CreateFolderPopup, [_.bind(this.createFolder, this)]);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CFilesView.prototype.onCreateLinkResponse = function (oResponse, oRequest)
{
	this.routeFiles(this.storageType(), this.currentPath(), this.searchPattern(), true);
};

/**
 * @param {Object} oFileItem
 */
CFilesView.prototype.createLink = function (oFileItem)
{
	Ajax.send('CreateLink', {
		'Type': this.storageType(),
		'Path': this.currentPath(),
		'Link': oFileItem.sLinkUrl,
		'Name': oFileItem.fileName()
	}, this.onCreateLinkResponse, this);
};

CFilesView.prototype.executeCreateShortcut = function ()
{
	var fCallBack = _.bind(this.createLink, this);

	Popups.showPopup(CreateLinkPopup, [fCallBack]);
	
};


CFilesView.prototype.onSearch = function ()
{
	this.routeFiles(this.storageType(), this.currentPath(), this.newSearchPattern());
};

CFilesView.prototype.clearSearch = function ()
{
	this.routeFiles(this.storageType(), this.currentPath());
};

CFilesView.prototype.getCurrentFolder = function ()
{
	var oFolder = new CFolderModel();
	oFolder.fullPath(this.currentPath());
	oFolder.storageType(this.storageType());
	return oFolder;
};

CFilesView.prototype.registerToolbarButtons = function (aToolbarButtons)
{
	if (Types.isNonEmptyArray(aToolbarButtons))
	{
		_.each(aToolbarButtons, _.bind(function (oToolbarButtons) {
			if (_.isFunction(oToolbarButtons.useFilesViewData))
			{
				oToolbarButtons.useFilesViewData(this);
			}
		}, this));
		this.addToolbarButtons(_.union(this.addToolbarButtons(), aToolbarButtons));
	}
};

CFilesView.prototype.onFileRemove = function (sFileUploadUid, oFile)
{
	var 
		/**
		 * Send request for deleting file with sFileName
		 * @param {String} sFileUploadUid
		 * @param {String} sFileName
		 */
		fOnUploadCancelCallback = _.bind(function (sFileUploadUid, sFileName) {
			var aItems = [{
				'Path': this.currentPath(),  
				'Name': sFileName,
				'IsFolder': false
			}];
			Ajax.send('Delete', {
					'Type': this.storageType(),
					'Path': this.currentPath(),
					'Items': aItems
				},
				//Update file list after deleting file
				_.bind(function () {
					var bPathRequired = this.currentPath() !== '' && this.pathItems().length === 0;

					Ajax.send('GetFiles', {
							'Type': this.storageType(),
							'Path': this.currentPath(),
							'Pattern': this.searchPattern(),
							'PathRequired': bPathRequired
						}, this.onGetFilesResponse, this
					);
				}, this)
			);
			this.onCancelUpload(sFileUploadUid);
		}, this)
	;
	if (oFile.downloading())
	{
		App.broadcastEvent('CFilesView::FileDownloadCancel', {oFile: oFile});
	}
	else if (!oFile.uploaded() && sFileUploadUid)
	{
		var bEventCaught = App.broadcastEvent('CFilesView::FileUploadCancel', {sFileUploadUid: sFileUploadUid, sFileUploadName: oFile.fileName(), fOnUploadCancelCallback: fOnUploadCancelCallback});	
		if (!bEventCaught)
		{
			fOnUploadCancelCallback(sFileUploadUid, oFile.fileName());
		}
	}
};

CFilesView.prototype.disableButton = function (koButtonModules, sModuleName)
{
	if (koButtonModules.indexOf(sModuleName) === -1)
	{
		koButtonModules.push(sModuleName);
	}
};

CFilesView.prototype.enableButton = function (koButtonModules, sModuleName)
{
	koButtonModules.remove(sModuleName);
};

module.exports = CFilesView;


/***/ }),

/***/ "kbJU":
/*!********************************************!*\
  !*** ./modules/FilesWebclient/js/enums.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	Enums = {}
;

/**
 * @enum {number}
 */
Enums.FileStorageType = {
	'Personal': 'personal',
	'Corporate': 'corporate',
	'Shared': 'shared',
	'GoogleDrive': 'google',
	'Dropbox': 'dropbox',
	'Encrypted': 'encrypted'
};

/**
 * @enum {number}
 */
Enums.FileStorageLinkType = {
	'Unknown': 0,
	'GoogleDrive': 1,
	'Dropbox': 2,
	'YouTube': 3,
	'Vimeo': 4,
	'SoundCloud': 5
};

if (typeof window.Enums === 'undefined')
{
	window.Enums = {};
}

_.extendOwn(window.Enums, Enums);

/***/ }),

/***/ "kwPS":
/*!***********************************************!*\
  !*** ./modules/CoreWebclient/js/CSelector.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "HLSX"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh")
;

/**
 * @param {Function} list (knockout)
 * @param {Function=} fSelectCallback
 * @param {Function=} fDeleteCallback
 * @param {Function=} fDblClickCallback
 * @param {Function=} fEnterCallback
 * @param {Function=} multiplyLineFactor (knockout)
 * @param {boolean=} bResetCheckedOnClick = false
 * @param {boolean=} bCheckOnSelect = false
 * @param {boolean=} bUnselectOnCtrl = false
 * @param {boolean=} bDisableMultiplySelection = false
 * @param {boolean=} bChangeOnSelect = true
 * @constructor
 */
function CSelector(list, fSelectCallback, fDeleteCallback, fDblClickCallback, fEnterCallback, multiplyLineFactor,
	bResetCheckedOnClick, bCheckOnSelect, bUnselectOnCtrl, bDisableMultiplySelection, bChangeOnSelect)
{
	this.fSelectCallback = fSelectCallback || function() {};
	this.fDeleteCallback = fDeleteCallback || function() {};
	this.fDblClickCallback = (!App.isMobile() && fDblClickCallback) ? fDblClickCallback : function() {};
	this.fEnterCallback = fEnterCallback || function() {};
	this.bResetCheckedOnClick = !!bResetCheckedOnClick;
	this.bCheckOnSelect = !!bCheckOnSelect;
	this.bUnselectOnCtrl = !!bUnselectOnCtrl;
	this.bDisableMultiplySelection = !!bDisableMultiplySelection;
	this.bChangeOnSelect = (typeof bChangeOnSelect === 'undefined') ? true : !!bChangeOnSelect;
	
	this.useKeyboardKeys = ko.observable(false);

	this.list = ko.observableArray([]);

	if (list && list['subscribe'])
	{
		list['subscribe'](function (mValue) {
			this.list(mValue);
		}, this);
	}
	
	this.multiplyLineFactor = multiplyLineFactor;
	
	this.oLast = null;
	this.oListScope = null;
	this.oScrollScope = null;

	this.iTimer = 0;
	this.iFactor = 1;

	this.KeyUp = Enums.Key.Up;
	this.KeyDown = Enums.Key.Down;
	this.KeyLeft = Enums.Key.Up;
	this.KeyRight = Enums.Key.Down;

	if (this.multiplyLineFactor)
	{
		if (this.multiplyLineFactor.subscribe)
		{
			this.multiplyLineFactor.subscribe(function (iValue) {
				this.iFactor = 0 < iValue ? iValue : 1;
			}, this);
		}
		else
		{
			this.iFactor = Types.pInt(this.multiplyLineFactor);
		}

		this.KeyUp = Enums.Key.Up;
		this.KeyDown = Enums.Key.Down;
		this.KeyLeft = Enums.Key.Left;
		this.KeyRight = Enums.Key.Right;

		if ($('html').hasClass('rtl'))
		{
			this.KeyLeft = Enums.Key.Right;
			this.KeyRight = Enums.Key.Left;
		}
	}

	this.sActionSelector = '';
	this.sSelectableSelector = '';
	this.sCheckboxSelector = '';

	var self = this;

	// reading returns a list of checked items.
	// recording (bool) puts all checked, or unchecked.
	this.listChecked = ko.computed({
		'read': function () {
			var aList = _.filter(this.list(), function (oItem) {
				var
					bC = oItem && oItem.checked && oItem.checked(),
					bS = oItem && oItem.selected && oItem.selected()
				;

				return bC || (self.bCheckOnSelect && bS);
			});

			return aList;
		},
		'write': function (bValue) {
			bValue = !!bValue;
			_.each(this.list(), function (oItem) {
				oItem.checked(bValue);
			});
			this.list.valueHasMutated();
		},
		'owner': this
	});

	this.checkAll = ko.computed({
		'read': function () {
			return 0 < this.listChecked().length;
		},

		'write': function (bValue) {
			this.listChecked(!!bValue);
		},
		'owner': this
	});

	this.selectorHook = ko.observable(null);

	this.selectorHook.subscribe(function () {
		var oPrev = this.selectorHook();
		if (oPrev && _.isFunction(oPrev.selected))
		{
			oPrev.selected(false);
		}
	}, this, 'beforeChange');

	this.selectorHook.subscribe(function (oGroup) {
		if (oGroup)
		{
			oGroup.selected(true);
		}
	}, this);

	this.itemSelected = ko.computed({

		'read': this.selectorHook,

		'write': function (oItemToSelect) {

			this.selectorHook(oItemToSelect);

			if (oItemToSelect)
			{
				self.scrollToSelected();
				this.oLast = oItemToSelect;
			}
		},
		'owner': this
	});

	this.list.subscribe(function (aList) {
		if (_.isArray(aList))
		{
			var	oSelected = this.itemSelected();
			if (oSelected)
			{
				if (!_.find(aList, function (oItem) {
					return oSelected === oItem;
				}))
				{
					this.itemSelected(null);
				}
			}
		}
		else
		{
			this.itemSelected(null);
		}
	}, this);

	this.listCheckedOrSelected = ko.computed({
		'read': function () {
			var
				oSelected = this.itemSelected(),
				aChecked = this.listChecked()
			;
			return 0 < aChecked.length ? aChecked : (oSelected ? [oSelected] : []);
		},
		'write': function (bValue) {
			if (!bValue)
			{
				this.itemSelected(null);
				this.listChecked(false);
			}
			else
			{
				this.listChecked(true);
			}
		},
		'owner': this
	});

	this.listCheckedAndSelected = ko.computed({
		'read': function () {
			var
				aResult = [],
				oSelected = this.itemSelected(),
				aChecked = this.listChecked()
			;

			if (aChecked)
			{
				aResult = aChecked.slice(0);
			}

			if (oSelected && _.indexOf(aChecked, oSelected) === -1)
			{
				aResult.push(oSelected);
			}

			return aResult;
		},
		'write': function (bValue) {
			if (!bValue)
			{
				this.itemSelected(null);
				this.listChecked(false);
			}
			else
			{
				this.listChecked(true);
			}
		},
		'owner': this
	});

	this.isIncompleteChecked = ko.computed(function () {
		var
			iM = this.list().length,
			iC = this.listChecked().length
		;
		return 0 < iM && 0 < iC && iM > iC;
	}, this);

	this.onKeydownBound = _.bind(this.onKeydown, this);
}

CSelector.prototype.iTimer = 0;
CSelector.prototype.bResetCheckedOnClick = false;
CSelector.prototype.bCheckOnSelect = false;
CSelector.prototype.bUnselectOnCtrl = false;
CSelector.prototype.bDisableMultiplySelection = false;

CSelector.prototype.getLastOrSelected = function ()
{
	var
		iCheckedCount = 0,
		oLastSelected = null
	;
	
	_.each(this.list(), function (oItem) {
		if (oItem.checked())
		{
			iCheckedCount++;
		}

		if (oItem.selected())
		{
			oLastSelected = oItem;
		}
	});

	return 0 === iCheckedCount && oLastSelected ? oLastSelected : this.oLast;
};

/**
 * @param {string} sActionSelector css-selector for the active for pressing regions of the list
 * @param {string} sSelectableSelector css-selector to the item that was selected
 * @param {string} sCheckboxSelector css-selector to the element that checkbox in the list
 * @param {*} oListScope
 * @param {*} oScrollScope
 */
CSelector.prototype.initOnApplyBindings = function (sActionSelector, sSelectableSelector, sCheckboxSelector, oListScope, oScrollScope)
{
	$(document).on('keydown', this.onKeydownBound);

	this.oListScope = oListScope;
	this.oScrollScope = oScrollScope;
	this.sActionSelector = sActionSelector;
	this.sSelectableSelector = sSelectableSelector;
	this.sCheckboxSelector = sCheckboxSelector;

	var
		self = this,

		fEventClickFunction = function (oLast, oItem, oEvent) {

			var
				iIndex = 0,
				iLength = 0,
				oListItem = null,
				bChangeRange = false,
				bIsInRange = false,
				aList = [],
				bChecked = false
			;

			oItem = oItem ? oItem : null;
			if (oEvent && oEvent.shiftKey)
			{
				if (null !== oItem && null !== oLast && oItem !== oLast)
				{
					aList = self.list();
					bChecked = oItem.checked();

					for (iIndex = 0, iLength = aList.length; iIndex < iLength; iIndex++)
					{
						oListItem = aList[iIndex];

						bChangeRange = false;
						if (oListItem === oLast || oListItem === oItem)
						{
							bChangeRange = true;
						}

						if (bChangeRange)
						{
							bIsInRange = !bIsInRange;
						}

						if (bIsInRange || bChangeRange)
						{
							oListItem.checked(bChecked);
						}
					}
				}
			}

			if (oItem)
			{
				self.oLast = oItem;
			}
		}
	;

	$(this.oListScope).on('dblclick', sActionSelector, function (oEvent) {
		var oItem = ko.dataFor(this);
		if (oItem && oEvent && !oEvent.ctrlKey && !oEvent.altKey && !oEvent.shiftKey)
		{
			self.onDblClick(oItem);
		}
	});

	if (Browser.mobileDevice)
	{
		$(this.oListScope).on('touchstart', sActionSelector, function (e) {

			if (!e)
			{
				return;
			}

			var
				t2 = e.timeStamp,
				t1 = $(this).data('lastTouch') || t2,
				dt = t2 - t1,
				fingers = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches.length : 0
			;

			$(this).data('lastTouch', t2);
			if (!dt || dt > 250 || fingers > 1)
			{
				return;
			}

			e.preventDefault();
			$(this).trigger('dblclick');
		});
	}

	$(this.oListScope).on('click', sActionSelector, function (oEvent) {

		var
			bClick = true,
			oSelected = null,
			oLast = self.getLastOrSelected(),
			oItem = ko.dataFor(this)
		;

		if (oItem && oEvent)
		{
			if (oEvent.shiftKey)
			{
				bClick = false;
				if (!self.bDisableMultiplySelection)
				{
					if (null === self.oLast)
					{
						self.oLast = oItem;
					}


					oItem.checked(!oItem.checked());
					fEventClickFunction(oLast, oItem, oEvent);
				}
			}
			else if (oEvent.ctrlKey)
			{
				bClick = false;
				if (!self.bDisableMultiplySelection)
				{
					self.oLast = oItem;
					oSelected = self.itemSelected();
					if (oSelected && !oSelected.checked() && !oItem.checked())
					{
						oSelected.checked(true);
					}

					if (self.bUnselectOnCtrl && oItem === self.itemSelected())
					{
						oItem.checked(!oItem.selected());
						self.itemSelected(null);
					}
					else
					{
						oItem.checked(!oItem.checked());
					}
				}
			}

			if (bClick)
			{
				self.selectionFunc(oItem);
			}
		}
	});

	$(this.oListScope).on('click', sCheckboxSelector, function (oEvent) {

		var oItem = ko.dataFor(this);
		if (oItem && oEvent && !self.bDisableMultiplySelection)
		{
			if (oEvent.shiftKey)
			{
				if (null === self.oLast)
				{
					self.oLast = oItem;
				}

				fEventClickFunction(self.getLastOrSelected(), oItem, oEvent);
			}
			else
			{
				self.oLast = oItem;
			}
		}

		if (oEvent && oEvent.stopPropagation)
		{
			oEvent.stopPropagation();
		}
	});

	$(this.oListScope).on('dblclick', sCheckboxSelector, function (oEvent) {
		if (oEvent && oEvent.stopPropagation)
		{
			oEvent.stopPropagation();
		}
	});
};

/**
 * @param {Object} oSelected
 * @param {number} iEventKeyCode
 * 
 * @return {Object}
 */
CSelector.prototype.getResultSelection = function (oSelected, iEventKeyCode)
{
	var
		self = this,
		bStop = false,
		bNext = false,
		oResult = null,
		iPageStep = this.iFactor,
		bMultiply = !!this.multiplyLineFactor,
		iIndex = 0,
		iLen = 0,
		aList = []
	;

	if (!oSelected && -1 < $.inArray(iEventKeyCode, [this.KeyUp, this.KeyDown, this.KeyLeft, this.KeyRight,
		Enums.Key.PageUp, Enums.Key.PageDown, Enums.Key.Home, Enums.Key.End]))
	{
		aList = this.list();
		if (aList && 0 < aList.length)
		{
			if (-1 < $.inArray(iEventKeyCode, [this.KeyDown, this.KeyRight, Enums.Key.PageUp, Enums.Key.Home]))
			{
				oResult = aList[0];
			}
			else if (-1 < $.inArray(iEventKeyCode, [this.KeyUp, this.KeyLeft, Enums.Key.PageDown, Enums.Key.End]))
			{
				oResult = aList[aList.length - 1];
			}
		}
	}
	else if (oSelected)
	{
		aList = this.list();
		iLen = aList ? aList.length : 0;

		if (0 < iLen)
		{
			if (
				Enums.Key.Home === iEventKeyCode || Enums.Key.PageUp === iEventKeyCode ||
				Enums.Key.End === iEventKeyCode || Enums.Key.PageDown === iEventKeyCode ||
				(bMultiply && (Enums.Key.Left === iEventKeyCode || Enums.Key.Right === iEventKeyCode)) ||
				(!bMultiply && (Enums.Key.Up === iEventKeyCode || Enums.Key.Down === iEventKeyCode))
			)
			{
				_.each(aList, function (oItem) {
					if (!bStop)
					{
						switch (iEventKeyCode) {
							case self.KeyUp:
							case self.KeyLeft:
								if (oSelected === oItem)
								{
									bStop = true;
								}
								else
								{
									oResult = oItem;
								}
								break;
							case Enums.Key.Home:
							case Enums.Key.PageUp:
								oResult = oItem;
								bStop = true;
								break;
							case self.KeyDown:
							case self.KeyRight:
								if (bNext)
								{
									oResult = oItem;
									bStop = true;
								}
								else if (oSelected === oItem)
								{
									bNext = true;
								}
								break;
							case Enums.Key.End:
							case Enums.Key.PageDown:
								oResult = oItem;
								break;
						}
					}
				});
			}
			else if (bMultiply && this.KeyDown === iEventKeyCode)
			{
				for (; iIndex < iLen; iIndex++)
				{
					if (oSelected === aList[iIndex])
					{
						iIndex += iPageStep;
						if (iLen - 1 < iIndex)
						{
							iIndex -= iPageStep;
						}

						oResult = aList[iIndex];
						break;
					}
				}
			}
			else if (bMultiply && this.KeyUp === iEventKeyCode)
			{
				for (iIndex = iLen; iIndex >= 0; iIndex--)
				{
					if (oSelected === aList[iIndex])
					{
						iIndex -= iPageStep;
						if (0 > iIndex)
						{
							iIndex += iPageStep;
						}

						oResult = aList[iIndex];
						break;
					}
				}
			}
		}
	}

	return oResult;
};

/**
 * @param {Object} oResult
 * @param {Object} oSelected
 * @param {number} iEventKeyCode
 */
CSelector.prototype.shiftClickResult = function (oResult, oSelected, iEventKeyCode)
{
	if (oSelected)
	{
		var
			bMultiply = !!this.multiplyLineFactor,
			bInRange = false,
			bSelected = false
		;

		if (-1 < $.inArray(iEventKeyCode,
			bMultiply ? [Enums.Key.Left, Enums.Key.Right] : [Enums.Key.Up, Enums.Key.Down]))
		{
			oSelected.checked(!oSelected.checked());
		}
		else if (-1 < $.inArray(iEventKeyCode, bMultiply ?
			[Enums.Key.Up, Enums.Key.Down, Enums.Key.PageUp, Enums.Key.PageDown, Enums.Key.Home, Enums.Key.End] :
			[Enums.Key.Left, Enums.Key.Right, Enums.Key.PageUp, Enums.Key.PageDown, Enums.Key.Home, Enums.Key.End]
		))
		{
			bSelected = !oSelected.checked();

			_.each(this.list(), function (oItem) {
				var Add = false;
				if (oItem === oResult || oSelected === oItem)
				{
					bInRange = !bInRange;
					Add = true;
				}

				if (bInRange || Add)
				{
					oItem.checked(bSelected);
					Add = false;
				}
			});
			
			if (bMultiply && oResult && (iEventKeyCode === Enums.Key.Up || iEventKeyCode === Enums.Key.Down))
			{
				oResult.checked(!oResult.checked());
			}
		}
	}	
};

/**
 * @param {number} iEventKeyCode
 * @param {boolean} bShiftKey
 */
CSelector.prototype.clickNewSelectPosition = function (iEventKeyCode, bShiftKey)
{
	var
		oSelected = this.itemSelected(),
		oResult = this.getResultSelection(oSelected, iEventKeyCode)
	;

	if (oResult)
	{
		if (bShiftKey)
		{
			this.shiftClickResult(oResult, oSelected, iEventKeyCode);
		}
		this.selectionFunc(oResult);
	}
};

/**
 * @param {Object} oEvent
 * 
 * @return {boolean}
 */
CSelector.prototype.onKeydown = function (oEvent)
{
	var
		bResult = true,
		iCode = 0
	;

	if (this.useKeyboardKeys() && oEvent && !Utils.isTextFieldFocused() && !Popups.hasOpenedMaximizedPopups())
	{
		iCode = oEvent.keyCode;
		if (!oEvent.ctrlKey &&
			(
				this.KeyUp === iCode || this.KeyDown === iCode ||
				this.KeyLeft === iCode || this.KeyRight === iCode ||
				Enums.Key.PageUp === iCode || Enums.Key.PageDown === iCode ||
				Enums.Key.Home === iCode || Enums.Key.End === iCode
			)
		)
		{
			this.clickNewSelectPosition(iCode, oEvent.shiftKey);
			bResult = false;
		}
		else if (Enums.Key.Del === iCode && !oEvent.ctrlKey && !oEvent.shiftKey)
		{
			if (0 < this.list().length)
			{
				this.onDelete();
				bResult = false;
			}
		}
		else if (Enums.Key.Enter === iCode)
		{
			if (0 < this.list().length && !oEvent.ctrlKey)
			{
				this.onEnter(this.itemSelected());
				bResult = false;
			}
		}
		else if (oEvent.ctrlKey && !oEvent.altKey && !oEvent.shiftKey && Enums.Key.a === iCode)
		{
			this.checkAll(!(this.checkAll() && !this.isIncompleteChecked()));
			bResult = false;
		}
	}

	return bResult;
};

CSelector.prototype.onDelete = function ()
{
	this.fDeleteCallback.call(this, this.listCheckedOrSelected());
};

/**
 * @param {Object} oItem
 */
CSelector.prototype.onEnter = function (oItem)
{
	if (oItem)
	{
		this.fEnterCallback.call(this, oItem);
	}
};

/**
 * @param {Object} oItem
 */
CSelector.prototype.selectionFunc = function (oItem)
{
	if (this.bChangeOnSelect)
	{
		this.itemSelected(null);
	}
	if (this.bResetCheckedOnClick)
	{
		this.listChecked(false);
	}
	if (this.bChangeOnSelect)
	{
		this.itemSelected(oItem);
	}
	this.fSelectCallback.call(this, oItem);
};

/**
 * @param {Object} oItem
 */
CSelector.prototype.onDblClick = function (oItem)
{
	this.fDblClickCallback.call(this, oItem);
};

CSelector.prototype.koCheckAll = function ()
{
	return ko.computed({
		'read': this.checkAll,
		'write': this.checkAll,
		'owner': this
	});
};

CSelector.prototype.koCheckAllIncomplete = function ()
{
	return ko.computed({
		'read': this.isIncompleteChecked,
		'write': this.isIncompleteChecked,
		'owner': this
	});
};

/**
 * @return {boolean}
 */
CSelector.prototype.scrollToSelected = function ()
{
	if (!this.oListScope || !this.oScrollScope)
	{
		return false;
	}

	var
		iOffset = 20,
		oSelected = $(this.sSelectableSelector, this.oScrollScope),
		oPos = oSelected.position(),
		iVisibleHeight = this.oScrollScope.height(),
		iScrollTop = this.oScrollScope.scrollTop(),
		iSelectedHeight = oSelected.outerHeight(),
		bSelectedVisible = oPos && (oPos.top >= iScrollTop) && (oPos.top <= (iScrollTop + iVisibleHeight - iSelectedHeight))
	;

	if (oPos && !bSelectedVisible)
	{
		if ((oPos.top < (iScrollTop + iVisibleHeight)) && ((oPos.top + iSelectedHeight) > (iScrollTop + iVisibleHeight)))
		{
			// selected item is partially visible from below
			// make it visible at bottom with offset
			this.oScrollScope.scrollTop(oPos.top + iSelectedHeight + iOffset - iVisibleHeight);
		}
		else
		{
			// make selected item visible at top with offset
			this.oScrollScope.scrollTop(oPos.top - iOffset);
		}

		return true;
	}

	return false;
};

module.exports = CSelector;


/***/ }),

/***/ "mjrp":
/*!******************************************!*\
  !*** ./modules/CoreWebclient/js/CJua.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	queue = __webpack_require__(/*! modules/CoreWebclient/js/vendors/queue.js */ "w+bY"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
	
	iDefLimit = UserSettings.MultipleFilesUploadLimit;
;
/**
 * @param {*} mValue
 * @return {boolean}
 */
function isUndefined(mValue)
{
	return 'undefined' === typeof mValue;
}

/**
 * @param {*} oParent
 * @param {*} oDescendant
 *
 * @return {boolean}
 */
function contains(oParent, oDescendant)
{
	var bResult = false;
	if (oParent && oDescendant)
	{
		if (oParent === oDescendant)
		{
			bResult = true;
		}
		else if (oParent.contains)
		{
			bResult = oParent.contains(oDescendant);
		}
		else
		{
			/*jshint bitwise: false*/
			bResult = oDescendant.compareDocumentPosition ?
				!!(oDescendant.compareDocumentPosition(oParent) & 8) : false;
			/*jshint bitwise: true*/
		}
	}

	return bResult;
}

function mainClearTimeout(iTimer)
{
	if (0 < iTimer)
	{
		clearTimeout(iTimer);
	}

	iTimer = 0;
}

/**
 * @param {Event} oEvent
 * @return {?Event}
 */
function getEvent(oEvent)
{
	oEvent = (oEvent && (oEvent.originalEvent ?
		oEvent.originalEvent : oEvent)) || window.event;

	return oEvent.dataTransfer ? oEvent : null;
}

/**
 * @param {Object} oValues
 * @param {string} sKey
 * @param {?} mDefault
 * @return {?}
 */
function getValue(oValues, sKey, mDefault)
{
	return (!oValues || !sKey || isUndefined(oValues[sKey])) ? mDefault : oValues[sKey];
}

/**
 * @param {Object} oOwner
 * @param {string} sPublicName
 * @param {*} mObject
 */
function setValue(oOwner, sPublicName, mObject)
{
	oOwner[sPublicName] = mObject;
}

/**
 * @param {Function} fFunction
 * @param {Object=} oScope
 * @return {Function}
 */
function scopeBind(fFunction, oScope)
{
	return function () {
		return fFunction.apply(isUndefined(oScope) ? null : oScope,
			Array.prototype.slice.call(arguments));
	};
}

/**
 * @param {number=} iLen
 * @return {string}
 */
function fakeMd5(iLen)
{
	var
		sResult = '',
		sLine = '0123456789abcdefghijklmnopqrstuvwxyz'
	;

	iLen = isUndefined(iLen) ? 32 : Types.pInt(iLen);

	while (sResult.length < iLen)
	{
		sResult += sLine.substr(Math.round(Math.random() * sLine.length), 1);
	}

	return sResult;
}

/**
 * @return {string}
 */
function getNewUid()
{
	return 'jua-uid-' + fakeMd5(16) + '-' + (new Date()).getTime().toString();
}

/**
 * @param {*} oFile
 * @param {string=} sPath
 * @return {Object}
 */
function getDataFromFile(oFile, sPath)
{
	var
		sFileName = isUndefined(oFile.fileName) ? (isUndefined(oFile.name) ? null : oFile.name) : oFile.fileName,
		iSize = isUndefined(oFile.fileSize) ? (isUndefined(oFile.size) ? null : oFile.size) : oFile.fileSize,
		sType = isUndefined(oFile.type) ? null : oFile.type
	;

	return {
		'FileName': sFileName,
		'Size': iSize,
		'Type': sType,
		'Folder': isUndefined(sPath) ? '' : sPath,
		'File' : oFile
	};
}

/**
 * @param {*} aItems
 * @param {Function} fFileCallback
 * @param {boolean=} bEntry = false
 * @param {boolean=} bAllowFolderDragAndDrop = true
 * @param {number=} iLimit = 20
 * @param {Function=} fLimitCallback
 */
function getDataFromFiles(aItems, fFileCallback, bEntry, bAllowFolderDragAndDrop, iLimit, fLimitCallback)
{
	var
		iInputLimit = 0,
		iLen = 0,
		iIndex = 0,
		oItem = null,
		oEntry = null,
		bUseLimit = false,
		bCallLimit = false,
		fTraverseFileTree = function (oItem, sPath, fCallback, fLimitCallbackProxy) {

			if (oItem && !isUndefined(oItem['name']))
			{
				sPath = sPath || '';
				if (oItem['isFile'])
				{
					oItem.file(function (oFile) {
						if (!bUseLimit || 0 <= --iLimit)
						{
							fCallback(getDataFromFile(oFile, sPath));
						}
						else if (bUseLimit && !bCallLimit)
						{
							if (0 > iLimit && fLimitCallback)
							{
								bCallLimit = true;
								fLimitCallback(iInputLimit);
							}
						}
					});
				}
				else if (bAllowFolderDragAndDrop && oItem['isDirectory'] && oItem['createReader'])
				{
					var
						oDirReader = oItem['createReader'](),
						iIndex = 0,
						iLen = 0
					;

					if (oDirReader && oDirReader['readEntries'])
					{
						oDirReader['readEntries'](function (aEntries) {
							if (aEntries && Types.isNonEmptyArray(aEntries))
							{
								for (iIndex = 0, iLen = aEntries.length; iIndex < iLen; iIndex++)
								{
									fTraverseFileTree(aEntries[iIndex], sPath + oItem['name'] + '/', fCallback, fLimitCallbackProxy);
								}
							}
						});
					}
				}
			}
		}
	;

	bAllowFolderDragAndDrop = isUndefined(bAllowFolderDragAndDrop) ? true : !!bAllowFolderDragAndDrop;

	bEntry = isUndefined(bEntry) ? false : !!bEntry;
	iLimit = isUndefined(iLimit) ? iDefLimit : Types.pInt(iLimit);
	iInputLimit = iLimit;
	bUseLimit = 0 < iLimit;

	aItems = aItems && 0 < aItems.length ? aItems : null;
	if (aItems)
	{
		for (iIndex = 0, iLen = aItems.length; iIndex < iLen; iIndex++)
		{
			oItem = aItems[iIndex];
			if (oItem)
			{
				if (bEntry)
				{
					if ('file' === oItem['kind'] && oItem['webkitGetAsEntry'])
					{
						oEntry = oItem['webkitGetAsEntry']();
						if (oEntry)
						{
							fTraverseFileTree(oEntry, '', fFileCallback, fLimitCallback);
						}
					}
				}
				else
				{
					if (!bUseLimit || 0 <= --iLimit)
					{
						fFileCallback(getDataFromFile(oItem));
					}
					else if (bUseLimit && !bCallLimit)
					{
						if (0 > iLimit && fLimitCallback)
						{
							bCallLimit = true;
							fLimitCallback(iInputLimit);
						}
					}
				}
			}
		}
	}
}

/**
 * @param {*} oInput
 * @param {Function} fFileCallback
 * @param {number=} iLimit = 20
 * @param {Function=} fLimitCallback
 */
function getDataFromInput(oInput, fFileCallback, iLimit, fLimitCallback)
{
	var aFiles = oInput && oInput.files && 0 < oInput.files.length ? oInput.files : null;
	if (aFiles)
	{
		getDataFromFiles(aFiles, fFileCallback, false, false, iLimit, fLimitCallback);
	}
	else
	{
		fFileCallback({
			'FileName': oInput.value.split('\\').pop().split('/').pop(),
			'Size': null,
			'Type': null,
			'Folder': '',
			'File' : null
		});
	}
}

function eventContainsFiles(oEvent)
{
	var bResult = false;
	if (oEvent && oEvent.dataTransfer && oEvent.dataTransfer.types && oEvent.dataTransfer.types.length)
	{
		var
			iIindex = 0,
			iLen = oEvent.dataTransfer.types.length
		;

		for (; iIindex < iLen; iIindex++)
		{
			if (oEvent.dataTransfer.types[iIindex].toLowerCase() === 'files')
			{
				bResult = true;
				break;
			}
		}
	}

	return bResult;
}

/**
 * @param {Event} oEvent
 * @param {Function} fFileCallback
 * @param {number=} iLimit = 20
 * @param {Function=} fLimitCallback
 * @param {boolean=} bAllowFolderDragAndDrop = true
 */
function getDataFromDragEvent(oEvent, fFileCallback, iLimit, fLimitCallback, bAllowFolderDragAndDrop)
{
	var
		aItems = null,
		aFiles = null
	;

	oEvent = getEvent(oEvent);
	if (oEvent)
	{
		aItems = (oEvent.dataTransfer ? getValue(oEvent.dataTransfer, 'items', null) : null) || getValue(oEvent, 'items', null);
		if (aItems && 0 < aItems.length && aItems[0] && aItems[0]['webkitGetAsEntry'])
		{
			getDataFromFiles(aItems, fFileCallback, true, bAllowFolderDragAndDrop, iLimit, fLimitCallback);
		}
		else if (eventContainsFiles(oEvent))
		{
			aFiles = (getValue(oEvent, 'files', null) || (oEvent.dataTransfer ?
				getValue(oEvent.dataTransfer, 'files', null) : null));

			if (aFiles && 0 < aFiles.length)
			{
				getDataFromFiles(aFiles, fFileCallback, false, false, iLimit, fLimitCallback);
			}
		}
	}
}

function createNextLabel()
{
	return $('<label style="' +
'position: absolute; background-color:#fff; right: 0px; top: 0px; left: 0px; bottom: 0px; margin: 0px; padding: 0px; cursor: pointer;' +
	'"></label>').css({
		'opacity': 0
	});
}

/**
 * @param {string} sInputPos
 * @param {string=} sAccept = ''
 * @return {?Object}
 */
function createNextInput(sInputPos, sAccept)
{
	if (sAccept !== '')
	{
		sAccept = ' accept="' + sAccept + '"';
	}
	return $('<input type="file" tabindex="-1" hidefocus="hidefocus" style="position: absolute; ' + sInputPos + ': -9999px;"' + sAccept + ' />');
}

/**
 * @param {string=} sName
 * @param {boolean=} bMultiple = true
 * @param {string=} sInputPos = 'left'
 * @param {string=} sAccept = ''
 * @return {?Object}
 */
function getNewInput(sName, bMultiple, sInputPos, sAccept)
{
	sName = isUndefined(sName) ? '' : sName.toString();
	sInputPos = isUndefined(sInputPos) ? 'left' : sInputPos.toString();
	sAccept = isUndefined(sAccept) ? '' : sAccept.toString();

	var oLocal = createNextInput(sInputPos, sAccept);
	if (0 < sName.length)
	{
		oLocal.attr('name', sName);
	}

	if (isUndefined(bMultiple) ? true : bMultiple)
	{
		oLocal.prop('multiple', true);
	}

	return oLocal;
}

/**
 * @param {?} mStringOrFunction
 * @param {Array=} aFunctionParams
 * @return {string}
 */
function getStringOrCallFunction(mStringOrFunction, aFunctionParams)
{
	return Types.pString(_.isFunction(mStringOrFunction) ? 
		mStringOrFunction.apply(null, _.isArray(aFunctionParams) ? aFunctionParams : []) :
		mStringOrFunction);
}

/**
 * @constructor
 * @param {CJua} oJua
 * @param {Object} oOptions
 */
function AjaxDriver(oJua, oOptions)
{
	this.oXhrs = {};
	this.oUids = {};
	this.oJua = oJua;
	this.oOptions = oOptions;
}

/**
 * @type {Object}
 */
AjaxDriver.prototype.oXhrs = {};

/**
 * @type {Object}
 */
AjaxDriver.prototype.oUids = {};

/**
 * @type {?CJua}
 */
AjaxDriver.prototype.oJua = null;

/**
 * @type {Object}
 */
AjaxDriver.prototype.oOptions = {};

/**
 * @return {boolean}
 */
AjaxDriver.prototype.isDragAndDropSupported = function ()
{
	return true;
};

/**
 * @param {string} sUid
 */
AjaxDriver.prototype.regTaskUid = function (sUid)
{
	this.oUids[sUid] = true;
};

/**
 * @param {string} sUid
 * @param {object} oFileInfo
 * @param {object} oParsedHiddenParameters
 * @param {function} fCallback
 * @param {boolean} bSkipCompleteFunction
 * @param {boolean} bUseResponce
 * @param {number} iProgressOffset
 * @returns {Boolean}
 */
AjaxDriver.prototype.uploadTask = function (sUid, oFileInfo, oParsedHiddenParameters, fCallback, bSkipCompleteFunction, bUseResponce, iProgressOffset)
{
	if (false === this.oUids[sUid] || !oFileInfo || !oFileInfo['File'])
	{
		fCallback(null, sUid);
		return false;
	}

	try
	{
		var
			self = this,
			oXhr = new XMLHttpRequest(),
			oFormData = new FormData(),
			sAction = getValue(this.oOptions, 'action', ''),
			aHidden = _.clone(getValue(this.oOptions, 'hidden', {})),
			fStartFunction = this.oJua.getEvent('onStart'),
			fCompleteFunction = this.oJua.getEvent('onComplete'),
			fProgressFunction = this.oJua.getEvent('onProgress')
		;

		oXhr.open('POST', sAction, true);
		oXhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie('AuthToken'));
		oXhr.setRequestHeader('X-Client', 'WebClient');
		
		if (fProgressFunction && oXhr.upload)
		{
			oXhr.upload.onprogress = function (oEvent) {
				if (oEvent && oEvent.lengthComputable && !isUndefined(oEvent.loaded) && !isUndefined(oEvent.total))
				{
					if (typeof iProgressOffset === 'undefined')
					{
						fProgressFunction(sUid, oEvent.loaded, oEvent.total);
					}
					else
					{
						fProgressFunction(sUid, (iProgressOffset + oEvent.loaded) > oFileInfo.Size ? oFileInfo.Size : iProgressOffset + oEvent.loaded, oFileInfo.Size);
					}
				}
			};
		}

		oXhr.onreadystatechange = function () {
			if (4 === oXhr.readyState && 200 === oXhr.status)
			{
				if (fCompleteFunction && !bSkipCompleteFunction)
				{
					var
						bResult = false,
						oResult = null
					;

					try
					{
						oResult = $.parseJSON(oXhr.responseText);
						bResult = true;
					}
					catch (oException)
					{
						oResult = null;
					}

					fCompleteFunction(sUid, bResult, oResult);
				}

				if (!isUndefined(self.oXhrs[sUid]))
				{
					self.oXhrs[sUid] = null;
				}

				if (bUseResponce)
				{
					fCallback(oXhr.responseText, sUid);
				}
				else
				{
					fCallback(null, sUid);
				}
			}
			else
			{
				if (4 === oXhr.readyState)
				{
					fCompleteFunction(sUid, false, null);
					fCallback(null, sUid);
				}
			}
		};

		if (fStartFunction)
		{
			fStartFunction(sUid);
		}

		oFormData.append('jua-post-type', 'ajax');
		oFormData.append(getValue(this.oOptions, 'name', 'juaFile'), oFileInfo['File'], oFileInfo['FileName']);
		
		//extending jua hidden parameters with file hidden parameters
		oParsedHiddenParameters =  _.extend(oParsedHiddenParameters, oFileInfo.Hidden || {});
		aHidden.Parameters = JSON.stringify(oParsedHiddenParameters);
		$.each(aHidden, function (sKey, mValue) {
			oFormData.append(sKey, getStringOrCallFunction(mValue, [oFileInfo]));
		});

		oXhr.send(oFormData);

		this.oXhrs[sUid] = oXhr;
		return true;
	}
	catch (oError)
	{
		if (window.console)
		{
			window.console.error(oError);
		}
	}

	fCallback(null, sUid);
	return false;
};

AjaxDriver.prototype.generateNewInput = function (oClickElement)
{
	var
		self = this,
		oLabel = null,
		oInput = null
	;

	if (oClickElement)
	{
		oInput = getNewInput('', !getValue(this.oOptions, 'disableMultiple', false), getValue(this.oOptions, 'hiddenElementsPosition', 'left'), getValue(this.oOptions, 'accept', ''));
		oLabel = createNextLabel();
		oLabel.append(oInput);

		$(oClickElement).append(oLabel);

		oInput
			.on('click', function (event) {

				if (!self.oJua.bEnableButton)
				{
					event.preventDefault();
					return;
				}
				var fOn = self.oJua.getEvent('onDialog');
				if (fOn)
				{
					fOn();
				}
			})
			.on('change', function () {
				getDataFromInput(this, function (oFile) {
						self.oJua.addNewFile(oFile);
						self.generateNewInput(oClickElement);

						setTimeout(function () {
							oLabel.remove();
						}, 10);
					},
					getValue(self.oOptions, 'multipleSizeLimit', iDefLimit),
					self.oJua.getEvent('onLimitReached')
				);
			})
		;
	}
};

AjaxDriver.prototype.cancel = function (sUid)
{
	this.oUids[sUid] = false;
	if (this.oXhrs[sUid])
	{
		try
		{
			if (this.oXhrs[sUid].abort)
			{
				this.oXhrs[sUid].abort();
			}
		}
		catch (oError)
		{
		}

		this.oXhrs[sUid] = null;
	}
};

/**
 * @constructor
 * @param {CJua} oJua
 * @param {Object} oOptions
 */
function IframeDriver(oJua, oOptions)
{
	this.oUids = {};
	this.oForms = {};
	this.oJua = oJua;
	this.oOptions = oOptions;
}

/**
 * @type {Object}
 */
IframeDriver.prototype.oUids = {};

/**
 * @type {Object}
 */
IframeDriver.prototype.oForms = {};

/**
 * @type {?CJua}
 */
IframeDriver.prototype.oJua = null;

/**
 * @type {Object}
 */
IframeDriver.prototype.oOptions = {};

/**
 * @return {boolean}
 */
IframeDriver.prototype.isDragAndDropSupported = function ()
{
	return false;
};

/**
 * @param {string} sUid
 */
IframeDriver.prototype.regTaskUid = function (sUid)
{
	this.oUids[sUid] = true;
};

/**
 * @param {string} sUid
 * @param {object} oFileInfo
 * @param {object} oParsedHiddenParameters
 * @param {function} fCallback
 * @param {boolean} bSkipCompleteFunction
 * @param {boolean} bUseResponce
 * @param {number} iProgressOffset
 * @returns {Boolean}
 */
IframeDriver.prototype.uploadTask = function (sUid, oFileInfo, oParsedHiddenParameters, fCallback, bSkipCompleteFunction, bUseResponce, iProgressOffset)
{
	if (false === this.oUids[sUid])
	{
		fCallback(null, sUid);
		return false;
	}

	var
		oForm = this.oForms[sUid],
		aHidden = _.clone(getValue(this.oOptions, 'hidden', {})),
		fStartFunction = this.oJua.getEvent('onStart'),
		fCompleteFunction = this.oJua.getEvent('onComplete')
	;

	if (oForm)
	{
		oForm.append($('<input type="hidden" />').attr('name', 'jua-post-type').val('iframe'));
		
		//extending jua hidden parameters with file hidden parameters
		oParsedHiddenParameters =  _.extend(oParsedHiddenParameters, oFileInfo.Hidden || {});
		aHidden.Parameters = JSON.stringify(oParsedHiddenParameters);
		$.each(aHidden, function (sKey, sValue) {
			oForm.append($('<input type="hidden" />').attr('name', sKey).val(getStringOrCallFunction(sValue, [oFileInfo])));
		});

		oForm.trigger('submit');
		if (fStartFunction)
		{
			fStartFunction(sUid);
		}

		oForm.find('iframe').on('load', function (oEvent) {

			var
				bResult = false,
				oIframeDoc = null,
				oResult = {}
			;

			if (fCompleteFunction)
			{
				try
				{
					oIframeDoc = this.contentDocument ? this.contentDocument: this.contentWindow.document;
					oResult = $.parseJSON(oIframeDoc.body.innerHTML);
					bResult = true;
				}
				catch (oErr)
				{
					oResult = {};
				}

				fCompleteFunction(sUid, bResult, oResult);
			}

			fCallback(null, sUid);

			window.setTimeout(function () {
				oForm.remove();
			}, 100);
		});
	}
	else
	{
		fCallback(null, sUid);
	}

	return true;
};

IframeDriver.prototype.generateNewInput = function (oClickElement)
{
	var
		self = this,
		sUid = '',
		oInput = null,
		oIframe = null,
		sAction = getValue(this.oOptions, 'action', ''),
		oForm = null,
		sPos = getValue(this.oOptions, 'hiddenElementsPosition', 'left')
	;

	if (oClickElement)
	{
		sUid = getNewUid();

		oInput = getNewInput(getValue(this.oOptions, 'name', 'juaFile'), !getValue(this.oOptions, 'disableMultiple', false), getValue(this.oOptions, 'hiddenElementsPosition', 'left'), getValue(this.oOptions, 'accept', ''));

		oForm = $('<form action="' + sAction + '" target="iframe-' + sUid + '" ' +
' method="POST" enctype="multipart/form-data" style="display: block; cursor: pointer;"></form>');

		oIframe = $('<iframe name="iframe-' + sUid + '" tabindex="-1" src="javascript:void(0);" ' +
' style="position: absolute; top: -1000px; ' + sPos + ': -1000px; cursor: pointer;" />').css({'opacity': 0});

		oForm.append(createNextLabel().append(oInput)).append(oIframe);

		$(oClickElement).append(oForm);

		this.oForms[sUid] = oForm;

		oInput
			.on('click', function (event) {
				if (!self.oJua.bEnableButton)
				{
					event.preventDefault();
					return;
				}
				var fOn = self.oJua.getEvent('onDialog');
				if (fOn)
				{
					fOn();
				}
			})
			.on('change', function () {
				getDataFromInput(this, function (oFile) {
						if (oFile)
						{
							var sPos = getValue(self.oOptions, 'hiddenElementsPosition', 'left');

							oForm.css({
								'position': 'absolute',
								'top': -1000
							});

							oForm.css(sPos, -1000);

							self.oJua.addFile(sUid, oFile);
							self.generateNewInput(oClickElement);
						}

					},
					getValue(self.oOptions, 'multipleSizeLimit', iDefLimit),
					self.oJua.getEvent('onLimitReached')
				);
			})
		;
	}
};

IframeDriver.prototype.cancel = function (sUid)
{
	this.oUids[sUid] = false;
	if (this.oForms[sUid])
	{
		this.oForms[sUid].remove();
		this.oForms[sUid] = false;
	}
};

/**
 * @constructor
 * @param {Object=} oOptions
 */
function CJua(oOptions)
{
	oOptions = isUndefined(oOptions) ? {} : oOptions;

	var self = this;

	self.bEnableDnD = true;
	self.bEnableButton = true;

	self.oEvents = {
		'onDialog': null,
		'onSelect': null,
		'onStart': null,
		'onComplete': null,
		'onCompleteAll': null,
		'onProgress': null,
		'onDragEnter': null,
		'onDragLeave': null,
		'onDrop': null,
		'onBodyDragEnter': null,
		'onBodyDragLeave': null,
		'onLimitReached': function () {
			Popups.showPopup(AlertPopup, [TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_NUMBER_LIMIT_PLURAL', {
				'NUMBERLIMIT': iDefLimit
			}, null, iDefLimit)]);
		}
	};

	self.oOptions = _.extend({
		'action': '',
		'name': '',
		'hidden': {},
		'queueSize': 10,
		'clickElement': false,
		'dragAndDropElement': false,
		'dragAndDropBodyElement': false,
		'disableAjaxUpload': false,
		'disableFolderDragAndDrop': true,
		'disableDragAndDrop': false,
		'disableMultiple': false,
		'disableDocumentDropPrevent': false,
		'disableAutoUploadOnDrop': false,
		'multipleSizeLimit': iDefLimit,
		'hiddenElementsPosition': 'left'
	}, oOptions);
	
	self.oQueue = queue(Types.pInt(getValue(self.oOptions, 'queueSize', 10)));
	if (self.runEvent('onCompleteAll'))
	{
		self.oQueue.await(function () {
			self.runEvent('onCompleteAll');
		});
	}

	self.oDriver = self.isAjaxUploaderSupported() && !getValue(self.oOptions, 'disableAjaxUpload', false) ?
		new AjaxDriver(self, self.oOptions) : new IframeDriver(self, self.oOptions);

	self.oClickElement = getValue(self.oOptions, 'clickElement', null);

	if (self.oClickElement)
	{
		$(self.oClickElement).css({
			'position': 'relative',
			'overflow': 'hidden'
		});

		if ('inline' === $(this.oClickElement).css('display'))
		{
			$(this.oClickElement).css('display', 'inline-block');
		}

		this.oDriver.generateNewInput(this.oClickElement);
	}

	if (this.oDriver.isDragAndDropSupported() && getValue(this.oOptions, 'dragAndDropElement', false) &&
		!getValue(this.oOptions, 'disableAjaxUpload', false))
	{
		(function (self) {
			var
				$doc = $(document),
				oBigDropZone = $(getValue(self.oOptions, 'dragAndDropBodyElement', false) || $doc),
				oDragAndDropElement = getValue(self.oOptions, 'dragAndDropElement', false),
				fHandleDragOver = function (oEvent) {
					if (self.bEnableDnD && oEvent)
					{
						oEvent = getEvent(oEvent);
						if (oEvent && oEvent.dataTransfer && eventContainsFiles(oEvent))
						{
							try
							{
								var sEffect = oEvent.dataTransfer.effectAllowed;

								mainClearTimeout(self.iDocTimer);

								oEvent.dataTransfer.dropEffect = (sEffect === 'move' || sEffect === 'linkMove') ? 'move' : 'copy';

								oEvent.stopPropagation();
								oEvent.preventDefault();

								oBigDropZone.trigger('dragover', oEvent);
							}
							catch (oExc) {}
						}
					}
				},
				fHandleDrop = function (oEvent) {
					if (self.bEnableDnD && oEvent)
					{
						oEvent = getEvent(oEvent);
						if (oEvent && eventContainsFiles(oEvent))
						{
							oEvent.preventDefault();

							getDataFromDragEvent(
								oEvent,
								function (oFile) {
									if (oFile)
									{
										if (getValue(self.oOptions, 'disableAutoUploadOnDrop', false)) {
											self.runEvent('onDrop', [
												oFile,
												oEvent,
												function () {
													self.addNewFile(oFile);
													mainClearTimeout(self.iDocTimer);
												}
											]);
										}
										else
										{
											self.runEvent('onDrop', [oFile, oEvent]);
											self.addNewFile(oFile);
											mainClearTimeout(self.iDocTimer);
										}
									}
								},
								getValue(self.oOptions, 'multipleSizeLimit', iDefLimit),
								self.getEvent('onLimitReached'),
								!getValue(self.oOptions, 'disableFolderDragAndDrop', true)
							);
						}
					}

					self.runEvent('onDragLeave', [oEvent]);
				},
				fHandleDragEnter = function (oEvent) {
					if (self.bEnableDnD && oEvent)
					{
						oEvent = getEvent(oEvent);
						if (oEvent && eventContainsFiles(oEvent))
						{
							mainClearTimeout(self.iDocTimer);

							oEvent.preventDefault();
							self.runEvent('onDragEnter', [oDragAndDropElement, oEvent]);
						}
					}
				},
				fHandleDragLeave = function (oEvent) {
					if (self.bEnableDnD && oEvent)
					{
						oEvent = getEvent(oEvent);
						if (oEvent)
						{
							var oRelatedTarget = document['elementFromPoint'] ? document['elementFromPoint'](oEvent['clientX'], oEvent['clientY']) : null;
							if (oRelatedTarget && contains(this, oRelatedTarget))
							{
								return;
							}

							mainClearTimeout(self.iDocTimer);
							self.runEvent('onDragLeave', [oDragAndDropElement, oEvent]);
						}

						return;
					}
				}
			;

			if (oDragAndDropElement)
			{
				if (!getValue(self.oOptions, 'disableDocumentDropPrevent', false))
				{
					$doc.on('dragover', function (oEvent) {
						if (self.bEnableDnD && oEvent)
						{
							oEvent = getEvent(oEvent);
							if (oEvent && oEvent.dataTransfer && eventContainsFiles(oEvent))
							{
								try
								{
									oEvent.dataTransfer.dropEffect = 'none';
									oEvent.preventDefault();
								}
								catch (oExc) {}
							}
						}
					});
				}

				if (oBigDropZone && oBigDropZone[0])
				{
					oBigDropZone
						.on('dragover', function (oEvent) {
							if (self.bEnableDnD && oEvent)
							{
								mainClearTimeout(self.iDocTimer);
							}
						})
						.on('dragenter', function (oEvent) {
							if (self.bEnableDnD && oEvent)
							{
								oEvent = getEvent(oEvent);
								if (oEvent && eventContainsFiles(oEvent))
								{
									mainClearTimeout(self.iDocTimer);
									oEvent.preventDefault();

									self.runEvent('onBodyDragEnter', [oEvent]);
								}
							}
						})
						.on('dragleave', function (oEvent) {
							if (self.bEnableDnD && oEvent)
							{
								oEvent = getEvent(oEvent);
								if (oEvent)
								{
									mainClearTimeout(self.iDocTimer);
									self.iDocTimer = setTimeout(function () {
										self.runEvent('onBodyDragLeave', [oEvent]);
									}, 200);
								}
							}
						})
						.on('drop', function (oEvent) {
							if (self.bEnableDnD && oEvent)
							{
								oEvent = getEvent(oEvent);
								if (oEvent)
								{
									var bFiles = eventContainsFiles(oEvent);
									if (bFiles)
									{
										oEvent.preventDefault();
									}

									self.runEvent('onBodyDragLeave', [oEvent]);

									return !bFiles;
								}
							}

							return false;
						})
					;
				}

				$(oDragAndDropElement)
					.bind('dragenter', fHandleDragEnter)
					.bind('dragover', fHandleDragOver)
					.bind('dragleave', fHandleDragLeave)
					.bind('drop', fHandleDrop)
				;
			}

		}(self));
	}
	else
	{
		self.bEnableDnD = false;
	}

	setValue(self, 'on', self.on);
	setValue(self, 'cancel', self.cancel);
	setValue(self, 'isDragAndDropSupported', self.isDragAndDropSupported);
	setValue(self, 'isAjaxUploaderSupported', self.isAjaxUploaderSupported);
	setValue(self, 'setDragAndDropEnabledStatus', self.setDragAndDropEnabledStatus);
}

/**
 * @type {boolean}
 */
CJua.prototype.bEnableDnD = true;

/**
 * @type {number}
 */
CJua.prototype.iDocTimer = 0;

/**
 * @type {Object}
 */
CJua.prototype.oOptions = {};

/**
 * @type {Object}
 */
CJua.prototype.oEvents = {};

/**
 * @type {?Object}
 */
CJua.prototype.oQueue = null;

/**
 * @type {?Object}
 */
CJua.prototype.oDriver = null;

/**
 * @param {string} sName
 * @param {Function} fFunc
 */
CJua.prototype.on = function (sName, fFunc)
{
	this.oEvents[sName] = fFunc;
	return this;
};

/**
 * @param {string} sName
 * @param {string=} aArgs
 */
CJua.prototype.runEvent = function (sName, aArgs)
{
	if (this.oEvents[sName])
	{
		this.oEvents[sName].apply(null, aArgs || []);
	}
};

/**
 * @param {string} sName
 */
CJua.prototype.getEvent = function (sName)
{
	return this.oEvents[sName] || null;
};

/**
 * @param {string} sUid
 */
CJua.prototype.cancel = function (sUid)
{
	this.oDriver.cancel(sUid);
};

/**
 * @return {boolean}
 */
CJua.prototype.isAjaxUploaderSupported = function ()
{
	return (function () {
		var oInput = document.createElement('input');
		oInput.type = 'file';
		return !!('XMLHttpRequest' in window && 'multiple' in oInput && 'FormData' in window && (new XMLHttpRequest()).upload && true);
	}());
};

/**
 * @param {boolean} bEnabled
 */
CJua.prototype.setDragAndDropEnabledStatus = function (bEnabled)
{
	this.bEnableDnD = !!bEnabled;
};

/**
 * @return {boolean}
 */
CJua.prototype.isDragAndDropSupported = function ()
{
	return this.oDriver.isDragAndDropSupported();
};

/**
 * @param {Object} oFileInfo
 */
CJua.prototype.addNewFile = function (oFileInfo)
{
	this.addFile(getNewUid(), oFileInfo);
};

/**
 * @param {string} sUid
 * @param {Object} oFileInfo
 */
CJua.prototype.addFile = function (sUid, oFileInfo)
{
	var
		fOnSelect = this.getEvent('onSelect'),
		fOnChunkReadyCallback = null,
		bBreakUpload = false,
		aHidden = getValue(this.oOptions, 'hidden', {}),
		fCompleteFunction = this.getEvent('onComplete'),
		fRegularUploadFileCallback = _.bind(function (sUid, oFileInfo) {
			var
				aHidden = getValue(this.oOptions, 'hidden', {}),
				oParsedHiddenParameters = JSON.parse(getStringOrCallFunction(aHidden.Parameters, [oFileInfo]))
			;
			this.oDriver.regTaskUid(sUid);
			this.oQueue.defer(scopeBind(this.oDriver.uploadTask, this.oDriver), sUid, oFileInfo, oParsedHiddenParameters);
		}, this),
		fCancelFunction = this.getEvent('onCancel')
	;
	if (oFileInfo && (!fOnSelect || (false !== fOnSelect(sUid, oFileInfo))))
	{
		// fOnChunkReadyCallback runs when chunk ready for uploading
		fOnChunkReadyCallback = _.bind(function (sUid, oFileInfo, fProcessNextChunkCallback, iCurrChunk, iChunkNumber, iProgressOffset) {
			var fOnUploadCallback = null;
			// fOnUploadCallback runs when server have responded for upload
			fOnUploadCallback = function (sResponse, sFileUploadUid)
			{
				var oResponse = null;
				
				try
				{ // Suppress exceptions in the connection failure case 
					oResponse = $.parseJSON(sResponse);
				}
				catch (err)
				{
				}

				if (oResponse && oResponse.Result && !oResponse.Result.Error && !oResponse.ErrorCode)
				{//if response contains result and have no errors
					fProcessNextChunkCallback(sUid, fOnChunkReadyCallback);
				}
				else if (oResponse && oResponse.Result && oResponse.Result.Error)
				{
					App.broadcastEvent('Jua::FileUploadingError');
					fCompleteFunction(sFileUploadUid, false, {ErrorCode: oResponse.Result.Error});
				}
				else if (oResponse && oResponse.ErrorCode)
				{
					App.broadcastEvent('Jua::FileUploadingError');
					fCompleteFunction(sFileUploadUid, false, {ErrorCode: oResponse.ErrorCode});
				}
				else
				{
					App.broadcastEvent('Jua::FileUploadingError');
					fCompleteFunction(sFileUploadUid, false);
				}
			};
			
			var
				aHidden = getValue(this.oOptions, 'hidden', {}),
				oParsedHiddenParameters = JSON.parse(getStringOrCallFunction(aHidden.Parameters, [oFileInfo]))
			;
			this.oDriver.regTaskUid(sUid);
			this.oDriver.uploadTask(sUid, oFileInfo, oParsedHiddenParameters, fOnUploadCallback, iCurrChunk < iChunkNumber, true, iProgressOffset);
		}, this);
		var
			isUploadAvailable = ko.observable(true),
			oParsedHiddenParameters = JSON.parse(getStringOrCallFunction(aHidden.Parameters, [oFileInfo]))
		;
		App.broadcastEvent('Jua::FileUpload::isUploadAvailable', {
			isUploadAvailable: isUploadAvailable,
			sModuleName: aHidden.Module,
			sUid: sUid,
			oFileInfo: oFileInfo
		});
		if (isUploadAvailable())
		{
			bBreakUpload = App.broadcastEvent('Jua::FileUpload::before', {
				sUid: sUid,
				oFileInfo: oFileInfo,
				fOnChunkReadyCallback: fOnChunkReadyCallback,
				sModuleName: aHidden.Module,
				fRegularUploadFileCallback: fRegularUploadFileCallback,
				fCancelFunction: fCancelFunction,
				sStorageType: oParsedHiddenParameters.Type
			});

			if (bBreakUpload === false)
			{
				fRegularUploadFileCallback(sUid, oFileInfo);
			}
		}
		else if(_.isFunction(fCancelFunction))
		{
			fCancelFunction(sUid);
		}
	}
	else
	{
		this.oDriver.cancel(sUid);
	}
};

/**
 * @param {string} sName
 * @param {mixed} mValue
 */
CJua.prototype.setOption = function (sName, mValue)
{
	this.oOptions[sName] = mValue;
};

module.exports = CJua;


/***/ }),

/***/ "p2SF":
/*!**************************************************!*\
  !*** ./modules/FilesWebclient/js/utils/Links.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	
	Settings = __webpack_require__(/*! modules/FilesWebclient/js/Settings.js */ "Jq2H"),
	
	sSrchPref = 's.',
	sPthPref = 'p.',
	
	LinksUtils = {}
;

/**
 * Returns true if parameter contains path value.
 * @param {string} sTemp
 * @return {boolean}
 */
function IsPathParam(sTemp)
{
	return (sPthPref === sTemp.substr(0, sPthPref.length));
};

/**
 * Returns true if parameter contains search value.
 * @param {string} sTemp
 * @return {boolean}
 */
function IsSearchParam(sTemp)
{
	return (sSrchPref === sTemp.substr(0, sSrchPref.length));
};

/**
 * @param {string=} sStorage
 * @param {string=} sPath
 * @param {string=} sSearch
 * @returns {Array}
 */
LinksUtils.getFiles = function (sStorage, sPath, sSearch)
{
	var aParams = [Settings.HashModuleName];
	
	if (sStorage && sStorage !== '')
	{
		aParams.push(sStorage);
	}
	
	if (sPath && sPath !== '')
	{
		aParams.push(sPthPref + sPath);
	}
	
	if (sSearch && sSearch !== '')
	{
		aParams.push(sSrchPref + sSearch);
	}
	
	return aParams;
};

/**
 * @param {Array} aParam
 * 
 * @return {Object}
 */
LinksUtils.parseFiles = function (aParam)
{
	var
		iIndex = 0,
		sStorage = 'personal',
		sPath = '',
		sSearch = ''
	;

	if (Types.isNonEmptyArray(aParam))
	{
		if (aParam.length > iIndex && !IsPathParam(aParam[iIndex]))
		{
			sStorage = Types.pString(aParam[iIndex]);
			iIndex++;
		}
		
		if (aParam.length > iIndex && IsPathParam(aParam[iIndex]))
		{
			sPath = Types.pString(aParam[iIndex].substr(sPthPref.length));
			iIndex++;
		}
		
		if (aParam.length > iIndex && IsSearchParam(aParam[iIndex]))
		{
			sSearch = Types.pString(aParam[iIndex].substr(sSrchPref.length));
		}
	}
	
	return LinksUtils.getParsedParams(sStorage, sPath, sSearch);
};

LinksUtils.getParsedParams = function (sStorage, sPath, sSearch)
{
	var
		aPath = [],
		sName = ''
	;
	
	if (Types.isNonEmptyString(sPath))
	{
		aPath = _.without(sPath.split(/(?:\/|\$ZIP\:)/g), '');
		sName = aPath[aPath.length - 1];
	}
	else
	{
		sPath = '';
	}
	
	return {
		'Storage': sStorage,
		'Path': sPath,
		'PathParts': aPath,
		'Name': sName,
		'Search': sSearch
	};
};

module.exports = LinksUtils;


/***/ }),

/***/ "qsz4":
/*!*********************************************************!*\
  !*** ./modules/FilesWebclient/js/popups/RenamePopup.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CRenamePopup()
{
	CAbstractPopup.call(this);
	
	this.fCallback = null;
	
	this.name = ko.observable('');
	this.focused = ko.observable(false);
	this.error = ko.observable('');
	this.name.subscribe(function () {
		this.error('');
	}, this);
}

_.extendOwn(CRenamePopup.prototype, CAbstractPopup.prototype);

CRenamePopup.prototype.PopupTemplate = 'FilesWebclient_RenamePopup';

/**
 * @param {string} sName
 * @param {function} fCallback
 */
CRenamePopup.prototype.onOpen = function (sName, fCallback)
{
	this.fCallback = fCallback;
	
	this.name(sName);
	this.focused(true);
	this.error('');
};

CRenamePopup.prototype.onOKClick = function ()
{
	this.error('');
	
	if ($.isFunction(this.fCallback))
	{
		var sError = this.fCallback(this.name());
		if (sError)
		{
			this.error(sError);
		}
		else
		{
			this.closePopup();
		}
	}
	else
	{
		this.closePopup();
	}
};

module.exports = new CRenamePopup();

/***/ }),

/***/ "szb4":
/*!**********************************************!*\
  !*** ./modules/FilesWebclient/js/manager.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	__webpack_require__(/*! modules/FilesWebclient/js/enums.js */ "kbJU");

	var
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),

		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),

		Settings = __webpack_require__(/*! modules/FilesWebclient/js/Settings.js */ "Jq2H"),

		HeaderItemView = null,
		
		bAdminUser = App.getUserRole() === Enums.UserRole.SuperAdmin,
		bTenantAdmin = App.getUserRole() === Enums.UserRole.TenantAdmin,
		
		aToolbarButtons = [],
		oFilesView = null,
		oPersonalFilesAdminSectionView = null
	;
	
	Settings.init(oAppData);

	if (!ModulesManager.isModuleAvailable(Settings.ServerModuleName) || !App.isPublic() && Settings.Storages.length === 0)
	{
		return null;
	}
	
	if (App.isPublic())
	{
		return {
			getScreens: function () {
				var oScreens = {};
				oScreens[Settings.HashModuleName] = function () {
					var CFilesView = __webpack_require__(/*! modules/FilesWebclient/js/views/CFilesView.js */ "dtb0");
					return new CFilesView();
				};
				return oScreens;
			}
		};
	}
	else if (bAdminUser || App.isUserNormalOrTenant())
	{
		if (bAdminUser)
		{
			return {
				start: function (ModulesManager) {
					ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
						function(resolve) {
							__webpack_require__.e(/*! require.ensure | admin-bundle */ 13).then((function() {
									resolve(__webpack_require__(/*! modules/FilesWebclient/js/views/FilesAdminSettingsView.js */ "DnLV"));
								}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
						},
						Settings.HashModuleName,
						TextUtils.i18n('FILESWEBCLIENT/LABEL_SETTINGS_TAB')
					]);
/*						
					if (Settings.ShowPersonalFilesAdminSection)
					{
						ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTabSection', [
								function () {
									if (!oPersonalFilesAdminSectionView)
									{
										oPersonalFilesAdminSectionView = require('modules/FilesWebclient/js/views/FilesPersonalAdminSettingsView.js');
									}
									return oPersonalFilesAdminSectionView;
								},
								'files'
							]
						);
					}
*/					
					// if (Settings.ShowCorporateFilesAdminSection)
					// {
					// 	ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTabSection', [
					// 			function () { return require('modules/FilesWebclient/js/views/FilesCorporateAdminSettingsView.js'); },
					// 			'files'
					// 		]
					// 	);
					// }
				},
				hidePersonalFilesAdminSection: function() {
					if (Settings.ShowPersonalFilesAdminSection)
					{
						if (!oPersonalFilesAdminSectionView)
						{
							oPersonalFilesAdminSectionView = __webpack_require__(/*! modules/FilesWebclient/js/views/FilesPersonalAdminSettingsView.js */ "TX6J");
						}
						oPersonalFilesAdminSectionView.hide();
					}
				}
			};
		}
		else if (App.isUserNormalOrTenant())
		{
			if (App.isNewTab())
			{
				return {
					getSelectFilesPopup: function () {
						return __webpack_require__(/*! modules/FilesWebclient/js/popups/SelectFilesPopup.js */ "vsjN");
					}
				};
			}
			else
			{
				return {
					start: function (ModulesManager) {

						if (bTenantAdmin)
						{
							ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
								function(resolve) {
									__webpack_require__.e(/*! require.ensure | admin-bundle */ 13).then((function() {
											resolve(__webpack_require__(/*! modules/FilesWebclient/js/views/FilesAdminSettingsView.js */ "DnLV"));
										}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
								},
								Settings.HashModuleName,
								TextUtils.i18n('FILESWEBCLIENT/LABEL_SETTINGS_TAB')
							]);
						}

						if (Settings.ShowCommonSettings || Settings.ShowFilesApps)
						{
							ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
								function () { return __webpack_require__(/*! modules/FilesWebclient/js/views/FilesSettingsFormView.js */ "c3Cn"); },
								Settings.HashModuleName,
								TextUtils.i18n('FILESWEBCLIENT/LABEL_SETTINGS_TAB')
							]);
						}
					},
					getScreens: function () {
						var oScreens = {};
						oScreens[Settings.HashModuleName] = function () {
							var CFilesView = __webpack_require__(/*! modules/FilesWebclient/js/views/CFilesView.js */ "dtb0");
							oFilesView = new CFilesView();
							oFilesView.registerToolbarButtons(aToolbarButtons);
							aToolbarButtons = [];
							return oFilesView;
						};
						return oScreens;
					},
					getHeaderItem: function () {
						if (HeaderItemView === null)
						{
							var
								CHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "Ig+v"),
								sTabTitle = Settings.CustomTabTitle !== '' ? Settings.CustomTabTitle : TextUtils.i18n('FILESWEBCLIENT/ACTION_SHOW_FILES')
							;

							HeaderItemView = new CHeaderItemView(sTabTitle);
						}

						return {
							item: HeaderItemView,
							name: Settings.HashModuleName
						};
					},
					getSelectFilesPopup: function () {
						return __webpack_require__(/*! modules/FilesWebclient/js/popups/SelectFilesPopup.js */ "vsjN");
					},
					getMobileSyncSettingsView: function () {
						return __webpack_require__(/*! modules/FilesWebclient/js/views/MobileSyncSettingsView.js */ "AGjx");
					},
					getFileConstructor: function (oFile) {
						return __webpack_require__(/*! modules/FilesWebclient/js/models/CFileModel.js */ "Pg7U");
					},
					addFileToCurrentFolder: function (oFile) {
						if (oFilesView)
						{
							oFilesView.addFileToCurrentFolder(oFile);
						}
					},
					refresh: function () {
						if (oFilesView)
						{
							oFilesView.refresh();
						}
					},
					registerToolbarButtons: function (oToolbarButtons) {
						if (oFilesView)
						{
							oFilesView.registerToolbarButtons([oToolbarButtons]);
						}
						else
						{
							aToolbarButtons.push(oToolbarButtons);
						}
					}
				};
			}
		}
	}
	
	return null;
};


/***/ }),

/***/ "vsjN":
/*!**************************************************************!*\
  !*** ./modules/FilesWebclient/js/popups/SelectFilesPopup.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	
	CFilesView = __webpack_require__(/*! modules/FilesWebclient/js/views/CFilesView.js */ "dtb0"),
	CFileModel = __webpack_require__(/*! modules/FilesWebclient/js/models/CFileModel.js */ "Pg7U")
;

/**
 * @constructor
 */
function CSelectFilesPopup()
{
	CAbstractPopup.call(this);
	
	this.oFilesView = new CFilesView(true);
	this.oFilesView.onSelectClickPopupBound = _.bind(this.onSelectClick, this);
	this.fCallback = null;
}

_.extendOwn(CSelectFilesPopup.prototype, CAbstractPopup.prototype);

CSelectFilesPopup.prototype.PopupTemplate = 'FilesWebclient_SelectFilesPopup';

/**
 * @param {Function} fCallback
 */
CSelectFilesPopup.prototype.onOpen = function (fCallback)
{
	if ($.isFunction(fCallback))
	{
		this.fCallback = fCallback;
	}
	this.oFilesView.onShow();
};

CSelectFilesPopup.prototype.onBind = function ()
{
	this.oFilesView.onBind(this.$popupDom);
};

CSelectFilesPopup.prototype.onSelectClick = function ()
{
	var
		aItems = this.oFilesView.selector.listCheckedAndSelected(),
		aFileItems = _.filter(aItems, function (oItem) {
			return oItem instanceof CFileModel;
		}, this)
	;
	
	if (this.fCallback)
	{
		this.fCallback(aFileItems);
	}
	
	this.closePopup();
};

module.exports = new CSelectFilesPopup();

/***/ }),

/***/ "w+bY":
/*!***************************************************!*\
  !*** ./modules/CoreWebclient/js/vendors/queue.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!function(){function n(n){function e(){for(;i=a<c.length&&n>p;){var u=a++,e=c[u],o=t.call(e,1);o.push(l(u)),++p,e[0].apply(null,o)}}function l(n){return function(u,t){--p,null==s&&(null!=u?(s=u,a=d=0/0,o()):(c[n]=t,--d?i||e():o()))}}function o(){null!=s?m(s):f?m(s,c):m.apply(null,[s].concat(c))}var r,i,f,c=[],a=0,p=0,d=0,s=null,m=u;return n||(n=1/0),r={defer:function(){return s||(c.push(arguments),++d,e()),r},await:function(n){return m=n,f=!1,d||o(),r},awaitAll:function(n){return m=n,f=!0,d||o(),r}}}function u(){}var t=[].slice;n.version="1.0.7", true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return n}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):undefined}();


/***/ })

}]);