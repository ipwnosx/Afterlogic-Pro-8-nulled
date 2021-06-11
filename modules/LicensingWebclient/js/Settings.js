'use strict';

var
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: 'Licensing',
	HashModuleName: 'licensing',
	
	LicenseKey: '',
	TrialKeyLink: '',
	PermanentKeyLink: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var 
			oModuleDataSection = oAppData['%ModuleName%'],
			oServerModuleDataSection = oAppData[this.ServerModuleName]
		;
		
		if (!_.isEmpty(oServerModuleDataSection))
		{
			this.LicenseKey = Types.pString(oServerModuleDataSection.LicenseKey, this.LicenseKey);
		}
		
		if (!_.isEmpty(oModuleDataSection))
		{
			this.TrialKeyLink = Types.pString(oModuleDataSection.TrialKeyLink, this.TrialKeyLink);
			this.PermanentKeyLink = Types.pString(oModuleDataSection.PermanentKeyLink, this.PermanentKeyLink);
		}
	},
	
	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {string} sLicenseKey
	 */
	update: function (sLicenseKey)
	{
		this.LicenseKey = sLicenseKey;
	}
};
