(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[14],{

/***/ "1+iQ":
/*!*****************************************!*\
  !*** ./modules/SharedFiles/js/enums.js ***!
  \*****************************************/
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
Enums.SharedFileAccess = {
	'Full': 0,
	'Write': 1,
	'Read': 2
};

if (typeof window.Enums === 'undefined')
{
	window.Enums = {};
}

_.extendOwn(window.Enums, Enums);


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

/***/ "eywM":
/*!*****************************************************!*\
  !*** ./modules/SharedFiles/js/views/ButtonsView.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
	
	FilesSharePopup = __webpack_require__(/*! modules/SharedFiles/js/popups/FilesSharePopup.js */ "oTCo")
;

/**
 * @constructor
 */
function ButtonsView()
{
	this.shareTooltip = ko.computed(function () {
		return TextUtils.i18n('SHAREDFILES/ACTION_SHARE');
	}, this);
	this.storageType = null;
	this.isUploadEnabled = ko.observable(false);
}

ButtonsView.prototype.ViewTemplate = 'SharedFiles_ButtonsView';

ButtonsView.prototype.useFilesViewData = function (oFilesView)
{
	this.selectedItem = oFilesView.selector.itemSelected;
	this.storageType = oFilesView.storageType;
	oFilesView.pathItems.subscribe(function () {
		var
			iPathItemsLength = oFilesView.pathItems().length,
			oLastPathItem = oFilesView.pathItems()[iPathItemsLength - 1] || false
		;

		//Disable toolbar buttons for "root" directory of Shared files
		//and for folders with access level "Read"
		if (!this.isSharedStorage()
			|| (iPathItemsLength !== 0
				&& oLastPathItem.oExtendedProps
				&& oLastPathItem.oExtendedProps.Access
				&& oLastPathItem.oExtendedProps.Access === Enums.SharedFileAccess.Write
			)
		)
		{
			oFilesView.enableButton(oFilesView.createFolderButtonModules, 'SharedFiles');
			oFilesView.enableButton(oFilesView.renameButtonModules, 'SharedFiles');
			oFilesView.enableButton(oFilesView.shortcutButtonModules, 'SharedFiles');
			this.isUploadEnabled(true);
		}
		else
		{
			oFilesView.disableButton(oFilesView.createFolderButtonModules, 'SharedFiles');
			oFilesView.disableButton(oFilesView.renameButtonModules, 'SharedFiles');
			oFilesView.disableButton(oFilesView.shortcutButtonModules, 'SharedFiles');
			this.isUploadEnabled(false);
		}
		//Disable delete buttons for folders with access level "Read"
		if (this.isSharedStorage()
			&& iPathItemsLength !== 0
			&& oLastPathItem.oExtendedProps
			&& oLastPathItem.oExtendedProps.Access
			&& oLastPathItem.oExtendedProps.Access !== Enums.SharedFileAccess.Write
		)
		{
			oFilesView.disableButton(oFilesView.deleteButtonModules, 'SharedFiles');
		}
		else
		{
			oFilesView.enableButton(oFilesView.deleteButtonModules, 'SharedFiles');
		}
	}, this);
	this.shareCommand = Utils.createCommand(
		this,
		function () {
			if (this.selectedItem().IS_FILE && this.selectedItem().bIsSecure() && this.selectedItem().oExtendedProps && !this.selectedItem().oExtendedProps.ParanoidKey)
			{
				Popups.showPopup(AlertPopup, [TextUtils.i18n('SHAREDFILES/INFO_SHARING_NOT_SUPPORTED'), null, TextUtils.i18n('SHAREDFILES/TITLE_SHARE_FILE')]);
			}
			else
			{
				Popups.showPopup(FilesSharePopup, [this.selectedItem()]);
			}
		},
		function () {
			// Conditions for button activity:
			// Personal: one file or one folder
			// Encrypted: one file only
			// Corporate: nothing
			// Shared: nothing
			return (
				!oFilesView.isZipFolder()
				&& this.selectedItem() !== null
				&& oFilesView.selector.listCheckedAndSelected().length === 1
				&& oFilesView.checkedReadyForOperations()
				&& (
					oFilesView.storageType() === Enums.FileStorageType.Personal
					|| oFilesView.storageType() === Enums.FileStorageType.Encrypted && this.selectedItem().IS_FILE
				)
			);
		}
	);
};

ButtonsView.prototype.isSharedStorage = function ()
{
	return this.storageType() === Enums.FileStorageType.Shared;
};

module.exports = new ButtonsView();


/***/ }),

/***/ "oTCo":
/*!**********************************************************!*\
  !*** ./modules/SharedFiles/js/popups/FilesSharePopup.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	AddressUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Address.js */ "Ol7c"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),

	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),

	CFileModel = __webpack_require__(/*! modules/FilesWebclient/js/models/CFileModel.js */ "Pg7U"),

	ShowHistoryPopup = ModulesManager.run('ActivityHistory', 'getShowHistoryPopup')
;

/**
 * @constructor
 */
function FilesSharePopup()
{
	CAbstractPopup.call(this);

	this.guestsDom = ko.observable();
	this.guestsDom.subscribe(function () {
		this.initInputosaurus(this.guestsDom, this.guests, this.guestsLock);
	}, this);
	this.ownersDom = ko.observable();
	this.ownersDom.subscribe(function () {
		this.initInputosaurus(this.ownersDom, this.owners, this.ownersLock);
	}, this);

	this.guestsLock = ko.observable(false);
	this.guests = ko.observable('').extend({'reversible': true});
	this.guests.subscribe(function () {
		if (!this.guestsLock())
		{
			$(this.guestsDom()).val(this.guests());
			$(this.guestsDom()).inputosaurus('refresh');
		}
	}, this);
	this.ownersLock = ko.observable(false);
	this.owners = ko.observable('').extend({'reversible': true});
	this.owners.subscribe(function () {
		if (!this.ownersLock())
		{
			$(this.ownersDom()).val(this.owners());
			$(this.ownersDom()).inputosaurus('refresh');
		}
	}, this);

	this.owner = ko.observable('');
	this.storage = ko.observable('');
	this.path = ko.observable('');
	this.id = ko.observable('');
	this.shares = ko.observableArray([]);

	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.whomAnimate = ko.observable('');

	this.newShare = ko.observable('');
	this.newShareFocus = ko.observable(false);
	this.newShareAccess = ko.observable(Enums.SharedFileAccess.Read);
	this.sharedToAll = ko.observable(false);
	this.sharedToAllAccess = ko.observable(Enums.SharedFileAccess.Read);
	this.canAdd = ko.observable(false);
	this.aAccess = [
		{'value': Enums.SharedFileAccess.Read, 'display': TextUtils.i18n('SHAREDFILES/LABEL_READ_ACCESS')},
		{'value': Enums.SharedFileAccess.Write, 'display': TextUtils.i18n('SHAREDFILES/LABEL_WRITE_ACCESS')}
	];
	this.oFileItem = ko.observable(null);
	this.bSaving = ko.observable(false);
	this.sDialogHintText = ko.observable('');

	this.bAllowShowHistory = !!ShowHistoryPopup;
}

_.extendOwn(FilesSharePopup.prototype, CAbstractPopup.prototype);

FilesSharePopup.prototype.PopupTemplate = 'SharedFiles_FilesSharePopup';

/**
 *
 * @param {Object} oFileItem
 */
FilesSharePopup.prototype.onOpen = function (oFileItem)
{
	if (!_.isUndefined(oFileItem))
	{
		this.oFileItem(oFileItem);
		this.storage(oFileItem.storageType());
		this.path(oFileItem.path());
		this.id(oFileItem.id());
		this.sDialogHintText('');
		App.broadcastEvent(
			'SharedFiles::OpenFilesSharePopup',
			{
				'DialogHintText': this.sDialogHintText,
				'IsDir': !(this.oFileItem() instanceof CFileModel)
			}
		);
		if (oFileItem.oExtendedProps && oFileItem.oExtendedProps.Shares)
		{
			this.populateShares(oFileItem.oExtendedProps.Shares);
		}
		else
		{
			this.populateShares([]);
		}
	}
};

FilesSharePopup.prototype.onSaveClick = function ()
{
	if (this.validateShare())
	{
		this.bSaving(true);
		this.updateShare(this.storage(), this.path(), this.id(), this.getShares());
	}
};

FilesSharePopup.prototype.onEscHandler = function ()
{
	this.cancelPopup();
};

FilesSharePopup.prototype.initInputosaurus = function (koDom, koAddr, koLockAddr)
{
	var
		fSuggestionsAutocompleteCallback = ModulesManager.run(
			'ContactsWebclient',
			'getSuggestionsAutocompleteCallback',
			[
				'team',
				App.getUserPublicId()
			]
		)
		|| function () {}
	;

	if (koDom() && $(koDom()).length > 0)
	{
		$(koDom()).inputosaurus({
			width: 'auto',
			parseOnBlur: true,
			autoCompleteSource: fSuggestionsAutocompleteCallback,
			change : _.bind(function (ev) {
				koLockAddr(true);
				this.setRecipient(koAddr, ev.target.value);
				koLockAddr(false);
			}, this),
			copy: _.bind(function (sVal) {
				this.inputosaurusBuffer = sVal;
			}, this),
			paste: _.bind(function () {
				var sInputosaurusBuffer = this.inputosaurusBuffer || '';
				this.inputosaurusBuffer = '';
				return sInputosaurusBuffer;
			}, this),
			mobileDevice: App.isMobile()
		});
	}
};

FilesSharePopup.prototype.setRecipient = function (koRecipient, sRecipient)
{
	if (koRecipient() === sRecipient)
	{
		koRecipient.valueHasMutated();
	}
	else
	{
		koRecipient(sRecipient);
	}
};

/**
 * Returns array of shares from popup
 * @returns {Array}
 */
FilesSharePopup.prototype.getShares = function ()
{
	return $.merge(_.map(AddressUtils.getArrayRecipients(this.guests(), false), function(oGuest){
			return {
				PublicId: oGuest.email,
				Access: Enums.SharedFileAccess.Read
			};
		}),
		_.map(AddressUtils.getArrayRecipients(this.owners(), false), function(oOwner){
			return {
				PublicId: oOwner.email,
				Access: Enums.SharedFileAccess.Write
			};
		}));
};

FilesSharePopup.prototype.populateShares = function (aShares)
{
	var
		sGuests = '',
		sOwners = ''
	;

	_.each(aShares, function (oShare) {
		if (Types.pInt(oShare.Access, Enums.SharedFileAccess.Read) === Enums.SharedFileAccess.Read && oShare.PublicId !== '')//Enums
		{
			sGuests = sGuests + oShare.PublicId + ', ';
		}
		else if (Types.pInt(oShare.Access, Enums.SharedFileAccess.Read) === Enums.SharedFileAccess.Write && oShare.PublicId !== '')//Enums
		{
			sOwners = sOwners + oShare.PublicId + ', ';
		}
	}, this);

	this.setRecipient(this.guests, sGuests);
	this.setRecipient(this.owners, sOwners);
};

FilesSharePopup.prototype.updateShare = function (sStorage, sPath, sId, aShares)
{
	var
		oParameters = {
			'Storage': sStorage,
			'Path': sPath,
			'Id': sId,
			'Shares': aShares,
			'IsDir': !(this.oFileItem() instanceof CFileModel)
		},
		fOnSuccessCallback = _.bind(function () {
			Ajax.send(
				'SharedFiles',
				'UpdateShare',
				oParameters,
				_.bind(this.onUpdateShareResponse, this)
			);
		}, this),
		fOnErrorCallback = _.bind(function () {
			this.bSaving(false);
		}, this)
	;

	var bHasSubscriber = App.broadcastEvent(
		'SharedFiles::UpdateShare::before',
		{
			Shares: aShares,
			OnSuccessCallback: fOnSuccessCallback,
			OnErrorCallback: fOnErrorCallback,
			oFileItem: this.oFileItem(),
			IsDir: !(this.oFileItem() instanceof CFileModel)
		}
	);

	if (bHasSubscriber === false)
	{
		fOnSuccessCallback();
	}
};

FilesSharePopup.prototype.onUpdateShareResponse = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		//Update shares list in oFile object
		if (!this.oFileItem().oExtendedProps)
		{
			this.oFileItem().oExtendedProps = {};
		}
		this.oFileItem().oExtendedProps.Shares = [];
		_.each(this.getShares(), _.bind(function (oShare) {
			this.oFileItem().oExtendedProps.Shares.push({
				'Access': oShare.Access,
				'PublicId': oShare.PublicId
			});
		}, this));
		if (this.oFileItem().oExtendedProps.Shares.length === 0)
		{
			this.oFileItem().isShared(false);
		}
		else
		{
			this.oFileItem().isShared(true);
		}
		Screens.showReport(TextUtils.i18n('SHAREDFILES/INFO_SHARING_STATUS_UPDATED'));
	}
	else
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('SHAREDFILES/ERROR_UNKNOWN_ERROR'));
	}
	this.bSaving(false);
	this.closePopup();
	this.oFileItem(null);
};

FilesSharePopup.prototype.validateShare = function ()
{
	var
		aGuests = _.map(AddressUtils.getArrayRecipients(this.guests(), false), function(oGuest){
			return oGuest.email;
		}),
		aOwners = _.map(AddressUtils.getArrayRecipients(this.owners(), false), function(oOwner){
			return oOwner.email;
		}),
		aDuplicateUsers = _.intersection(aGuests, aOwners)
	;

	if (aDuplicateUsers.length > 0)
	{
		Screens.showError(
			TextUtils.i18n(
				'SHAREDFILES/ERROR_DUPLICATE_USERS',
				{ 'USERNAME' : aDuplicateUsers.length > 1 ? aDuplicateUsers.join(', ') : aDuplicateUsers[0]},
				null,
				aDuplicateUsers.length
			)
		);

		return false;
	}

	return true;
};

FilesSharePopup.prototype.showHistory = function () {
	if (this.bAllowShowHistory)
	{
		Popups.showPopup(ShowHistoryPopup, [TextUtils.i18n('SHAREDFILES/HEADING_HISTORY_POPUP'), this.oFileItem()]);
	}
}

module.exports = new FilesSharePopup();


/***/ }),

/***/ "uoSt":
/*!*******************************************!*\
  !*** ./modules/SharedFiles/js/manager.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		_ = __webpack_require__(/*! underscore */ "F/us"),
				
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
		
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
		
		oButtonsView = null
	;

	__webpack_require__(/*! modules/SharedFiles/js/enums.js */ "1+iQ");

	function getButtonView()
	{
		if (!oButtonsView)
		{
			oButtonsView = __webpack_require__(/*! modules/SharedFiles/js/views/ButtonsView.js */ "eywM");
		}

		return oButtonsView;
	}

	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('FilesWebclient', 'registerToolbarButtons', [getButtonView()]);
				App.subscribeEvent('FilesWebclient::ParseFile::after', function (aParams) {

					var
						oFile = aParams[0],
						bIsShared = typeof(oFile.oExtendedProps) !== 'undefined'
							&&  typeof(oFile.oExtendedProps.Shares) !== 'undefined'
							&& _.isArray(oFile.oExtendedProps.Shares)
							&& oFile.oExtendedProps.Shares.length > 0
					;

					if (bIsShared)
					{
						oFile.isShared(true);
					}
				});
				App.subscribeEvent('FilesWebclient::ParseFolder::after', function (aParams) {

					var
						oFolder = aParams[0],
						bIsShared = typeof(oFolder.oExtendedProps) !== 'undefined'
							&&  typeof(oFolder.oExtendedProps.Shares) !== 'undefined'
							&& _.isArray(oFolder.oExtendedProps.Shares)
							&& oFolder.oExtendedProps.Shares.length > 0
					;

					if (bIsShared)
					{
						oFolder.isShared(true);
					}
				});
				App.subscribeEvent('Jua::FileUpload::isUploadAvailable', function (oParams) {
					if (!getButtonView().isUploadEnabled() && oParams.sModuleName === "Files")
					{
						Screens.showError(TextUtils.i18n('SHAREDFILES/ERROR_NOT_ENOUGH_PERMISSIONS'));
						oParams.isUploadAvailable(false);
					}
				});
			},
			getFilesSharePopup: function () {
				return __webpack_require__(/*! modules/SharedFiles/js/popups/FilesSharePopup.js */ "oTCo");
			}
		};
	}

	return null;
};


/***/ })

}]);