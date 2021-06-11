(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[29],{

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

/***/ "8UTp":
/*!***************************************************************!*\
  !*** ./modules/ActivityHistory/js/popups/ShowHistoryPopup.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),

	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	CDateModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CDateModel.js */ "5hOJ"),
	CPageSwitcherView = __webpack_require__(/*! modules/CoreWebclient/js/views/CPageSwitcherView.js */ "fIp0"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),

	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "20Ah")
;

/**
 * @constructor
 */
function CShowHistoryPopup()
{
	CAbstractPopup.call(this);

	this.popupHeading = ko.observable('');
	this.item = null;
	
	this.historyItems = ko.observableArray([]);
	this.isLoading = ko.observable(true);
	this.isEmptyHistory = ko.computed(function () {
		return !this.isLoading() && this.historyItems().length === 0;
	}, this);

	this.iEventsPerPage = 10;
	this.oPageSwitcher = new CPageSwitcherView(0, this.iEventsPerPage);
	this.oPageSwitcher.currentPage.subscribe(function () {
		this.requestEvents();
	}, this);
	this.iCurrentPage = 0;
}

_.extendOwn(CShowHistoryPopup.prototype, CAbstractPopup.prototype);

CShowHistoryPopup.prototype.PopupTemplate = 'ActivityHistory_ShowHistoryPopup';

/**
 * @param {Object} oItem
 */
CShowHistoryPopup.prototype.onOpen = function (sPopupHeading, oItem)
{
	this.item = oItem;
	this.popupHeading(sPopupHeading);
	this.historyItems([]);
	this.isLoading(true);
	this.oPageSwitcher.setPage(1, this.iEventsPerPage);
	this.requestEvents();
};

CShowHistoryPopup.prototype.requestEvents = function ()
{
	Ajax.send('ActivityHistory',
		'GetList',
		{
			'ResourceType': 'file',
			'ResourceId': this.item.storageType() + this.item.fullPath(),
			'Offset': (this.oPageSwitcher.currentPage() - 1) * this.iEventsPerPage,
			'Limit': this.iEventsPerPage
		},
		this.onGetActivityHistory,
		this
	);
};

CShowHistoryPopup.prototype.onGetActivityHistory = function (oResponse, oRequest)
{
	if (oResponse.Result && _.isArray(oResponse.Result.Items))
	{
		var aEvents = [];
		_.each(oResponse.Result.Items, function (oItem) {
			var oDateModel = new CDateModel();
			oDateModel.parse(oItem.Timestamp);
			aEvents.push({
				time: oDateModel.getFullDate(),
				action: oItem.Action,
				userPublicId: oItem.GuestPublicId,
				ip: oItem.IpAddress,
			});
		});
		this.historyItems(aEvents);
		this.oPageSwitcher.setCount(oResponse.Result.Count);
	}
	else
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('ACTIVITYHISTORY/ERROR_GET_HISTORY'));
	}
	this.isLoading(false);
};

CShowHistoryPopup.prototype.confirmClearHistory = function ()
{
	Popups.showPopup(ConfirmPopup, [TextUtils.i18n('ACTIVITYHISTORY/CONFIRM_CLEAR_HISTORY'), _.bind(function (bClearHistory) {
		if (bClearHistory)
		{
			this.clearHistory();
		}
	}, this), '', TextUtils.i18n('ACTIVITYHISTORY/ACTION_CLEAR_HISTORY')]);
};

CShowHistoryPopup.prototype.clearHistory = function ()
{
	Ajax.send('ActivityHistory',
		'Delete',
		{
			'ResourceType': 'file',
			'ResourceId': this.item.storageType() + this.item.fullPath(),
		},
		this.onDeleteActivityHistory,
		this
	);
};

CShowHistoryPopup.prototype.onDeleteActivityHistory = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		this.historyItems([]);
		this.oPageSwitcher.setCount(0);
		Screens.showReport(TextUtils.i18n('ACTIVITYHISTORY/REPORT_CLEAR_HISTORY'));
	}
	else
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('ACTIVITYHISTORY/ERROR_CLEAR_HISTORY'));
	}
	this.isLoading(false);
};

module.exports = new CShowHistoryPopup();

/***/ }),

/***/ "ELDR":
/*!***********************************************!*\
  !*** ./modules/ActivityHistory/js/manager.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	return {
		getShowHistoryPopup: function () {
			return __webpack_require__(/*! modules/ActivityHistory/js/popups/ShowHistoryPopup.js */ "8UTp");
		}
	};
};


/***/ }),

/***/ "fIp0":
/*!*************************************************************!*\
  !*** ./modules/CoreWebclient/js/views/CPageSwitcherView.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5")
;

/**
 * @constructor
 * @param {number} iCount
 * @param {number} iPerPage
 */
function CPageSwitcherView(iCount, iPerPage)
{
	this.bShown = false;
	
	this.currentPage = ko.observable(1);
	this.count = ko.observable(iCount);
	this.perPage = ko.observable(iPerPage);
	this.firstPage = ko.observable(1);
	this.lastPage = ko.observable(1);

	this.pagesCount = ko.computed(function () {
		var iCount = this.perPage() > 0 ? Math.ceil(this.count() / this.perPage()) : 0;
		return (iCount > 0) ? iCount : 1;
	}, this);

	ko.computed(function () {

		var
			iAllLimit = 20,
			iLimit = 4,
			iPagesCount = this.pagesCount(),
			iCurrentPage = this.currentPage(),
			iStart = iCurrentPage,
			iEnd = iCurrentPage
		;

		if (iPagesCount > 1)
		{
			while (true)
			{
				iAllLimit--;
				
				if (1 < iStart)
				{
					iStart--;
					iLimit--;
				}

				if (0 === iLimit)
				{
					break;
				}

				if (iPagesCount > iEnd)
				{
					iEnd++;
					iLimit--;
				}

				if (0 === iLimit)
				{
					break;
				}

				if (0 === iAllLimit)
				{
					break;
				}
			}
		}

		this.firstPage(iStart);
		this.lastPage(iEnd);
		
	}, this);

	this.visibleFirst = ko.computed(function () {
		return (this.firstPage() > 1);
	}, this);

	this.visibleLast = ko.computed(function () {
		return (this.lastPage() < this.pagesCount());
	}, this);

	this.clickPage = _.bind(this.clickPage, this);

	this.pages = ko.computed(function () {
		var
			iIndex = this.firstPage(),
			aPages = []
		;

		if (this.firstPage() < this.lastPage())
		{
			for (; iIndex <= this.lastPage(); iIndex++)
			{
				aPages.push({
					number: iIndex,
					current: (iIndex === this.currentPage()),
					clickFunc: this.clickPage
				});
			}
		}

		return aPages;
	}, this);
	
	if (!App.isMobile())
	{
		this.hotKeysBind();
	}
}

CPageSwitcherView.prototype.ViewTemplate = 'CoreWebclient_PageSwitcherView';

CPageSwitcherView.prototype.hotKeysBind = function ()
{
	$(document).on('keydown', $.proxy(function(ev) {
		if (this.bShown && !Utils.isTextFieldFocused())
		{
			var sKey = ev.keyCode;
			if (ev.ctrlKey && sKey === Enums.Key.Left)
			{
				this.clickPreviousPage();
			}
			else if (ev.ctrlKey && sKey === Enums.Key.Right)
			{
				this.clickNextPage();
			}
		}
	},this));
};

CPageSwitcherView.prototype.hide = function ()
{
	this.bShown = false;
};

CPageSwitcherView.prototype.show = function ()
{
	this.bShown = true;
};

CPageSwitcherView.prototype.clear = function ()
{
	this.currentPage(1);
	this.count(0);
};

/**
 * @param {number} iCount
 */
CPageSwitcherView.prototype.setCount = function (iCount)
{
	this.count(iCount);
	if (this.currentPage() > this.pagesCount())
	{
		this.currentPage(this.pagesCount());
	}
};

/**
 * @param {number} iPage
 * @param {number} iPerPage
 */
CPageSwitcherView.prototype.setPage = function (iPage, iPerPage)
{
	this.perPage(iPerPage);
	if (iPage > this.pagesCount())
	{
		this.currentPage(this.pagesCount());
	}
	else
	{
		this.currentPage(iPage);
	}
};

/**
 * @param {Object} oPage
 */
CPageSwitcherView.prototype.clickPage = function (oPage)
{
	var iPage = oPage.number;
	if (iPage < 1)
	{
		iPage = 1;
	}
	if (iPage > this.pagesCount())
	{
		iPage = this.pagesCount();
	}
	this.currentPage(iPage);
};

CPageSwitcherView.prototype.clickFirstPage = function ()
{
	this.currentPage(1);
};

CPageSwitcherView.prototype.clickPreviousPage = function ()
{
	var iPrevPage = this.currentPage() - 1;
	if (iPrevPage < 1)
	{
		iPrevPage = 1;
	}
	this.currentPage(iPrevPage);
};

CPageSwitcherView.prototype.clickNextPage = function ()
{
	var iNextPage = this.currentPage() + 1;
	if (iNextPage > this.pagesCount())
	{
		iNextPage = this.pagesCount();
	}
	this.currentPage(iNextPage);
};

CPageSwitcherView.prototype.clickLastPage = function ()
{
	this.currentPage(this.pagesCount());
};

module.exports = CPageSwitcherView;


/***/ })

}]);