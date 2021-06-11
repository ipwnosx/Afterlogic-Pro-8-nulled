<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MobileAppsWebclient;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2020, Afterlogic Corp.
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
	/***** public functions might be called with web API *****/
	/**
	 * Obtains list of module settings for authenticated user.
	 *
	 * @return array
	 */
	public function GetSettings()
	{
		\Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

		return array(
			'FilesSectionName' => $this->getConfig('FilesSectionName', ''),
			'ShowFilesServerUrlApp' => $this->getConfig('ShowFilesServerUrlApp', false),
			'ShowFilesAndroidApp' => $this->getConfig('ShowFilesAndroidApp', false),
			'FilesAndroidAppLink' => $this->getConfig('FilesAndroidAppLink', ''),
			'ShowFilesIosApp' => $this->getConfig('ShowFilesIosApp', false),
			'FilesIosAppLink' => $this->getConfig('FilesIosAppLink', ''),
			'ShowFilesWinApp' => $this->getConfig('ShowFilesWinApp', false),
			'FilesWinAppLink' => $this->getConfig('FilesWinAppLink', ''),
			'MailSectionName' => $this->getConfig('MailSectionName', ''),
			'ShowMailServerUrlApp' => $this->getConfig('ShowMailServerUrlApp', false),
			'ShowMailAndroidApp' => $this->getConfig('ShowMailAndroidApp', false),
			'MailAndroidAppLink' => $this->getConfig('MailAndroidAppLink', ''),
			'ShowMailIosApp' => $this->getConfig('ShowMailIosApp', false),
			'MailIosAppLink' => $this->getConfig('MailIosAppLink', ''),
		);
	}
}
