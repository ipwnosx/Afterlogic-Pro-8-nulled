'use strict';

var
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: 'MobileSync',
	HashModuleName: 'mobilesync',
	ServerDavModuleName: 'Dav',
	
	ExternalHostNameOfDAVServer: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData[this.ServerDavModuleName];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.ExternalHostNameOfDAVServer = Types.pString(oAppDataSection.ExternalHostNameOfDAVServer, this.ExternalHostNameOfDAVServer);
		}
	},
	
	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {string} sExternalHostNameOfDAVServer
	 */
	update: function (sExternalHostNameOfDAVServer)
	{
		this.ExternalHostNameOfDAVServer = sExternalHostNameOfDAVServer;
	}
};
