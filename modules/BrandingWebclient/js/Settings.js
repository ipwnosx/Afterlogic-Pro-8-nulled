'use strict';

var
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: '%ModuleName%',
	HashModuleName: 'branding',
	
	LoginLogo: '',
	TabsbarLogo: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['%ModuleName%'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.LoginLogo = Types.pString(oAppDataSection['LoginLogo'], this.LoginLogo);
			this.TabsbarLogo = Types.pString(oAppDataSection['TabsbarLogo'], this.TabsbarLogo);
		}
	},

	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {array} aParameters
	 */
	update: function (aParameters)
	{
		if (!_.isEmpty(aParameters))
		{
			this.LoginLogo = aParameters['LoginLogo'];
			this.TabsbarLogo = aParameters['TabsbarLogo']
		}
	}
};
