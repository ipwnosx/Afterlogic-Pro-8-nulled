'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	moment = require('moment'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	CDateModel = require('%PathToCoreWebclientModule%/js/models/CDateModel.js'),
	CPageSwitcherView = require('%PathToCoreWebclientModule%/js/views/CPageSwitcherView.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),

	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
	ConfirmPopup = require('%PathToCoreWebclientModule%/js/popups/ConfirmPopup.js')
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

CShowHistoryPopup.prototype.PopupTemplate = '%ModuleName%_ShowHistoryPopup';

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
		Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_GET_HISTORY'));
	}
	this.isLoading(false);
};

CShowHistoryPopup.prototype.confirmClearHistory = function ()
{
	Popups.showPopup(ConfirmPopup, [TextUtils.i18n('%MODULENAME%/CONFIRM_CLEAR_HISTORY'), _.bind(function (bClearHistory) {
		if (bClearHistory)
		{
			this.clearHistory();
		}
	}, this), '', TextUtils.i18n('%MODULENAME%/ACTION_CLEAR_HISTORY')]);
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
		Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_CLEAR_HISTORY'));
	}
	else
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('%MODULENAME%/ERROR_CLEAR_HISTORY'));
	}
	this.isLoading(false);
};

module.exports = new CShowHistoryPopup();