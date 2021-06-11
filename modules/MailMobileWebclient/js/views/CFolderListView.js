'use strict';

var
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	AccountList = require('modules/MailWebclient/js/AccountList.js'),
	MailCache = require('modules/MailWebclient/js/Cache.js'),
	Settings = require('modules/MailWebclient/js/Settings.js')
;

/**
 * @constructor
 */
function CFolderListView()
{
	this.accounts = AccountList.collection;
	
	this.folderList = MailCache.folderList;

	this.unifiedInboxAllowed = AccountList.unifiedInboxAllowed;
	this.oUnifiedInbox = MailCache.oUnifiedInbox;

	this.quotaProc = ko.observable(-1);
	this.quotaDesc = ko.observable('');

	if (UserSettings.ShowQuotaBar)
	{
		ko.computed(function () {

			MailCache.quotaChangeTrigger();

			var
				oAccount = AccountList.getCurrent(),
				iQuota = oAccount ? oAccount.quota() : 0,
				iUsed = oAccount ? oAccount.usedSpace() : 0,
				iProc = 0 < iQuota ? Math.ceil((iUsed / iQuota) * 100) : -1
			;

			iProc = 100 < iProc ? 100 : iProc;

			this.quotaProc(iProc);
			this.quotaDesc(-1 < iProc ?
				TextUtils.i18n('COREWEBCLIENT/INFO_QUOTA', {
					'PROC': iProc,
					'QUOTA': TextUtils.getFriendlySize(iQuota * 1024)
				}) : '');

		
			if (UserSettings.QuotaWarningPerc > 0 && iProc !== -1 && UserSettings.QuotaWarningPerc > (100 - iProc))
			{
				Screens.showError(TextUtils.i18n('COREWEBCLIENT/WARNING_QUOTA_ALMOST_REACHED'), true);
			}

			return true;

		}, this);
	}
}

CFolderListView.prototype.ViewTemplate = '%ModuleName%_FoldersView';

module.exports = CFolderListView;
