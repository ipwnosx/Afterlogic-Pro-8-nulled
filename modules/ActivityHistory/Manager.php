<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\ActivityHistory;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 */
class Manager extends \Aurora\System\Managers\AbstractManagerWithStorage
{
	public function __construct(\Aurora\System\Module\AbstractModule $oModule = null)
	{
		parent::__construct($oModule, new Storages\Db\Storage($this));
	}

	/**
	 * @param string $sHashID
	 * @param array $aParams
	 *
	 * @return string|bool
	 */
	public function Create($UserId, $ResourceType, $ResourceId, $IpAddress, $Action, $Time, $GuestPublicId)
	{
		$mResult = false;
		try
		{
			$mResult = $this->oStorage->create($UserId, $ResourceType, $ResourceId, $IpAddress, $Action, $Time, $GuestPublicId);
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}
		return $mResult;
	}

	/**
	 * @param string $sHashID
	 *
	 * @return array|bool
	 */
	public function GetList($UserId, $ResourceType, $ResourceId, $Offset, $Limit)
	{
		$mResult = false;
		try
		{
			$mResult = $this->oStorage->getList($UserId, $ResourceType, $ResourceId, $Offset, $Limit);
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}
		return $mResult;
	}

	/**
	 * @param string $sHashID
	 *
	 * @return array|bool
	 */
	public function GetListCount($UserId, $ResourceType, $ResourceId)
	{
		$mResult = false;
		try
		{
			$mResult = $this->oStorage->getListCount($UserId, $ResourceType, $ResourceId);
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}
		return $mResult;
	}

	public function Delete($UserId, $ResourceType, $ResourceId)
	{
		$mResult = false;
		try
		{
			$mResult = $this->oStorage->delete($UserId, $ResourceType, $ResourceId);
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}
		return $mResult;
	}
	
	/**
	 * Creates tables required for module work by executing create.sql file.
	 * 
	 * @return boolean
	 */
	public function createTablesFromFile()
	{
		$bResult = false;
		
		try
		{
			$sFilePath = dirname(__FILE__) . '/Storages/Db/sql/create.sql';
			$bResult = \Aurora\System\Managers\Db::getInstance()->executeSqlFile($sFilePath);
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}

		return $bResult;
	}
}
