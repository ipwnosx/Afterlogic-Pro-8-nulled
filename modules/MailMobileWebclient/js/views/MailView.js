'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	$ = require('jquery'),
	
	Routing = require('%PathToCoreWebclientModule%/js/Routing.js'),
	MailCache = require('modules/MailWebclient/js/Cache.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	
	CFolderListView = require('modules/%ModuleName%/js/views/CFolderListView.js'),
	CMailView = require('modules/MailWebclient/js/views/CMailView.js')
;

/**
 * @constructor
 */
function CMailMobileView()
{
	CMailView.call(this);
	
	this.oFolderList = new CFolderListView();
	this.oMessageList.ViewTemplate = '%ModuleName%_MessagesView';
	this.oMessageList.oPageSwitcher.ViewTemplate = 'CoreMobileWebclient_PageSwitcherView'
	this.oBaseMessagePaneView.ViewTemplate = '%ModuleName%_MessagePaneView';
	
	this.selectedPanel = ko.observable(Enums.MobilePanel.Items);
	MailCache.currentMessage.subscribe(function () {
		this.gotoMessagePane();
	}, this);
	
	this.appsDom = null;
	this.showApps = ko.observable(false);
	
	this.init();
	
	MailCache.currentAccountId.subscribe(function () {
		this.selectedPanel(Enums.MobilePanel.Items);
	}, this);

	App.broadcastEvent('%ModuleName%::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CMailMobileView.prototype, CMailView.prototype);

CMailMobileView.prototype.ViewTemplate = '%ModuleName%_MailView';
CMailMobileView.prototype.ViewConstructorName = 'CMailMobileView';

CMailMobileView.prototype.init = function ()
{
	this.selectedPanel.subscribe(function (value) {
		var bOpen = value === Enums.MobilePanel.Groups;

		$('body').toggleClass('with-panel-left-reveal', bOpen).toggleClass('panel-closing', !bOpen);
	});
	
	var self = this;
	this.appsDom = $('#apps-list');
	this.appsDom.on('click', function () {
		self.showApps(false);
	});
	
	this.showApps.subscribe(function (value) {
		$('body').toggleClass('with-panel-right-cover', value);
	}, this);
};

CMailMobileView.prototype.togleFolderList = function (oData, oEvent, bValue)
{
	var 
		bValue = bValue || this.selectedPanel() !== Enums.MobilePanel.Groups,
		newPanel = bValue ? Enums.MobilePanel.Groups : Enums.MobilePanel.Items
	;
	this.changeSelectedPanel(newPanel);
};

CMailMobileView.prototype.gotoFolderList = function ()
{
	this.changeSelectedPanel(Enums.MobilePanel.Groups);
};

CMailMobileView.prototype.gotoMessageList = function ()
{
	this.changeSelectedPanel(Enums.MobilePanel.Items);
	
	if (MailCache.currentMessage())
	{
		Routing.replaceHashWithoutMessageUid(MailCache.currentMessage().uid());
		Routing.replaceHashWithoutMessageUid(MailCache.currentMessage().unifiedUid());
	}
	
	return true;
};

CMailMobileView.prototype.gotoMessagePane = function ()
{
	if (MailCache.currentMessage())
	{
		this.changeSelectedPanel(Enums.MobilePanel.View);
	}
	else
	{
		this.gotoMessageList();
	}
};

/**
 * @param {number} iPanel
 */
CMailMobileView.prototype.changeSelectedPanel = function (iPanel)
{
	this.selectedPanel(iPanel);
};

module.exports = new CMailMobileView();
