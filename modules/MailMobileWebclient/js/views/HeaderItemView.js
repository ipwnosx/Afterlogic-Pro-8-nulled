'use strict';

var
	_ = require('underscore'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	CAbstractHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js'),
			
	AccountList = require('modules/MailWebclient/js/AccountList.js')
;

function CHeaderItemView()
{
	CAbstractHeaderItemView.call(this, TextUtils.i18n('%MODULENAME%/ACTION_SHOW_MAIL'));
	
	this.accounts = AccountList.collection;
}

_.extendOwn(CHeaderItemView.prototype, CAbstractHeaderItemView.prototype);

CHeaderItemView.prototype.ViewTemplate = '%ModuleName%_HeaderItemView';

var HeaderItemView = new CHeaderItemView();

HeaderItemView.allowChangeTitle(true);

module.exports = HeaderItemView;
