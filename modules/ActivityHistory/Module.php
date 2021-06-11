<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\ActivityHistory;

/**
 * System module provides hash-based object storage.
 *
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractModule
{
	public $oManager = null;

	/***** private functions *****/
	/**
	 * Initializes module.
	 *
	 * @ignore
	 */
	public function init()
	{
		$this->oManager = new Manager($this);
		$this->subscribeEvent('Core::CreateTables::after', array($this, 'onAfterCreateTables'));
		$this->subscribeEvent('AddToActivityHistory', array($this, 'onAddToActivityHistory'));
		$this->subscribeEvent('Files::Delete::after', array($this, 'onAfterFilesDelete'));
		$this->subscribeEvent('Files::DeletePublicLink::after', array($this, 'onAfterFilesDeletePublicLink'));
		$this->subscribeEvent('CreatePublicLink::after', array($this, 'onAfterFilesCreatePublicLink'));
		$this->subscribeEvent('OpenPgpFilesWebclient::ValidatePublicLinkPassword::after', array($this, 'onAfterValidatePublicLinkPassword'));
		$this->aDeniedMethodsByWebApi = [];
	}

	/**
	 * Creates tables required for module work. Called by event subscribe.
	 *
	 * @ignore
	 * @param array $aParams Parameters
	 */
	public function onAfterCreateTables($aParams, &$mResult)
	{
		if ($mResult)
		{
			$mResult = $this->oManager->createTablesFromFile();
		}
	}

	public function onAddToActivityHistory($aParams, &$mResult)
	{
		$iUserId = 0;
		if  (is_numeric($aParams['UserId']))
		{
			$iUserId = $aParams['UserId'];
		}
		else
		{
			$oUser = \Aurora\Modules\Core\Module::getInstance()->GetUserByPublicId($aParams['UserId']);
			if ($oUser)
			{
				$iUserId = $oUser->EntityId;
			}
		}
		$sGuestPublicId = isset($aParams['GuestPublicId']) ? $aParams['GuestPublicId'] : null;
		$this->Create($iUserId, $aParams['ResourceType'], $aParams['ResourceId'], $aParams['Action'], $sGuestPublicId);
	}

	public function onAfterFilesDelete(&$aArgs, &$mResult)
	{
		$iUserId = $aArgs['UserId'];
		$sStorage = $aArgs['Type'];
		$aItems = $aArgs['Items'];

		foreach ($aItems as $aItem)
		{
			$sResourceId = $sStorage . '/' . \ltrim(\ltrim($aItem['Path'], '/') . '/' . \ltrim($aItem['Name'], '/'), '/');
			$this->Delete($iUserId, 'file', $sResourceId);
		}
	}

	public function onAfterFilesCreatePublicLink(&$aArgs, &$mResult)
	{
		$iUserId = $aArgs['UserId'];
		$sStorage = $aArgs['Type'];

		$sResourceId = $sStorage . '/' . \ltrim(\ltrim($aArgs['Path'], '/') . '/' . \ltrim($aArgs['Name'], '/'), '/');
		$this->Create($iUserId, 'file', $sResourceId, 'create-public-link');
	}
	
	public function onAfterValidatePublicLinkPassword(&$aArgs, &$mResult)
	{
		if (!$mResult)
		{
			$this->CreateFromHash($aArgs['Hash'], 'wrong-password');
		}
	}

	public function onAfterFilesDeletePublicLink(&$aArgs, &$mResult)
	{
		$iUserId = $aArgs['UserId'];
		$sStorage = $aArgs['Type'];

		$sResourceId = $sStorage . '/' . \ltrim(\ltrim($aArgs['Path'], '/') . '/' . \ltrim($aArgs['Name'], '/'), '/');
		$this->Delete($iUserId, 'file', $sResourceId);
	}

	protected function CheckAccess(&$UserId)
	{
		$bAccessDenied = true;

		$oAuthenticatedUser = \Aurora\System\Api::getAuthenticatedUser();

		if ($UserId === null)
		{
			$iUserId = $oAuthenticatedUser->EntityId;
		}
		else
		{
			$iUserId = (int) $UserId;

			$iUserRole = $oAuthenticatedUser instanceof \Aurora\Modules\Core\Classes\User ? $oAuthenticatedUser->Role : \Aurora\System\Enums\UserRole::Anonymous;
			switch ($iUserRole)
			{
				case (\Aurora\System\Enums\UserRole::SuperAdmin):
					// everything is allowed for SuperAdmin
					$UserId = $iUserId;
					$bAccessDenied = false;
					break;
				case (\Aurora\System\Enums\UserRole::TenantAdmin):
					// everything is allowed for TenantAdmin
					$oUser = \Aurora\Modules\Core\Module::getInstance()->GetUser($iUserId);
					if ($oUser instanceof \Aurora\Modules\Core\Classes\User)
					{
						if ($oAuthenticatedUser->IdTenant === $oUser->IdTenant)
						{
							$UserId = $iUserId;
							$bAccessDenied = false;
						}
					}
					break;
				case (\Aurora\System\Enums\UserRole::NormalUser):
					// User identifier shoud be checked
					if ($iUserId === $oAuthenticatedUser->EntityId)
					{
						$UserId = $iUserId;
						$bAccessDenied = false;
					}
					break;
				case (\Aurora\System\Enums\UserRole::Customer):
				case (\Aurora\System\Enums\UserRole::Anonymous):
					// everything is forbidden for Customer and Anonymous users
					break;
			}
			if ($bAccessDenied)
			{
				throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
			}
		}
	}
	/***** private functions *****/

	/***** public functions might be called with web API *****/
	/**
	 */
	public function Create($UserId, $ResourceType, $ResourceId, $Action, $GuestPublicId = null)
	{
		\Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

		$IpAddress = "";
		if (!empty($_SERVER['HTTP_CLIENT_IP']))
		{
			$IpAddress = $_SERVER['HTTP_CLIENT_IP'];
		}
		elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
		{
			$IpAddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
		}
		else
		{
			$IpAddress = $_SERVER['REMOTE_ADDR'];
		}

		if (!isset($GuestPublicId))
		{
			$oUser = \Aurora\System\Api::getAuthenticatedUser();
			if ($oUser)
			{
				$GuestPublicId = $oUser->PublicId;
			}
		}
		return $this->oManager->Create($UserId, $ResourceType, $ResourceId, $IpAddress, $Action, time(), $GuestPublicId);
	}

	public function CreateFromHash($Hash, $EventName)
	{
		$oMin = \Aurora\Modules\Min\Module::getInstance();
		$mMin = $oMin->GetMinByHash($Hash);
		if (isset($mMin['UserId']) && isset($mMin['Type']) && isset($mMin['Path']) && isset($mMin['Name']))
		{
			$mUserId = $mMin['UserId'];
			if (is_string($mUserId))
			{
				$oUser = \Aurora\Modules\Core\Module::getInstance()->GetUserByPublicId($mUserId);
				if ($oUser instanceof \Aurora\Modules\Core\Classes\User)
				{
					$mUserId = $oUser->EntityId;
				}
			}
			if (is_int($mUserId))
			{
				$sStorage = $mMin['Type'];
				$sResourceId = $sStorage . '/' . \ltrim(\ltrim($mMin['Path'], '/') . '/' . \ltrim($mMin['Name'], '/'), '/');
				$this->Create($mUserId, 'file', $sResourceId, $EventName);
			}
		}
	}

	/**
	 */
	public function GetList($UserId, $ResourceType, $ResourceId, $Offset = 0, $Limit = 0)
	{
		\Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);
		$this->CheckAccess($UserId);
		return [
			'Items' => $this->oManager->GetList($UserId, $ResourceType, $ResourceId, $Offset, $Limit),
			'Count' => $this->oManager->GetListCount($UserId, $ResourceType, $ResourceId)
		];
	}

	/**
	 */
    public function Delete($UserId, $ResourceType, $ResourceId)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);
		$this->CheckAccess($UserId);
        return $this->oManager->Delete($UserId, $ResourceType, $ResourceId);
    }
	/***** public functions might be called with web API *****/
}
