<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\ActivityHistory\Storages\Db;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 */
class Storage extends \Aurora\Modules\ActivityHistory\Storages\Storage
{
	protected $oConnection;

	protected $oCommandCreator;

	/**
	 * 
	 * @param \Aurora\System\Managers\AbstractManager $oManager
	 */
	public function __construct(\Aurora\System\Managers\AbstractManager &$oManager)
	{
		parent::__construct($oManager);

		$this->oConnection =& $oManager->GetConnection();
		$this->oCommandCreator = new CommandCreator\MySQL();
	}

	public function create($UserId, $ResourceType, $ResourceId, $IpAddress, $Action, $Time, $GuestPublicId)
	{
		$mResult = false;

		if ($this->oConnection->Execute($this->oCommandCreator->create($UserId, $ResourceType, $ResourceId, $IpAddress, $Action, $Time, $GuestPublicId)))
		{
			$mResult = true;
		}

		$this->throwDbExceptionIfExist();
		return $mResult;
	}

	public function getList($UserId, $ResourceType, $ResourceId, $Offset, $Limit)
	{
		$mResult = false;

		if ($this->oConnection->Execute($this->oCommandCreator->getList($UserId, $ResourceType, $ResourceId, $Offset, $Limit)))
		{
			$mResult = [];
			$oRow = null;
			while (false !== ($oRow = $this->oConnection->GetNextRecord()))
			{
				$oItem = new \Aurora\Modules\ActivityHistory\Classes\ActivityHistory();
				$oItem->InitByDbRow($oRow);
				$mResult[] = $oItem;
			}
		}
		$this->oConnection->FreeResult();

		$this->throwDbExceptionIfExist();
		return $mResult;
	}

	public function getListCount($UserId, $ResourceType, $ResourceId)
	{
		$iResult = 0;

		if ($this->oConnection->Execute($this->oCommandCreator->getListCount($UserId, $ResourceType, $ResourceId)))
		{
			$oRow = $this->oConnection->GetNextRecord();
			if ($oRow && isset($oRow->cnt))
			{
				$iResult = (int) $oRow->cnt;
			}
		}
		$this->oConnection->FreeResult();

		$this->throwDbExceptionIfExist();
		return $iResult;
	}

	public function delete($UserId, $ResourceType, $ResourceId)
	{
		$mResult = $this->oConnection->Execute($this->oCommandCreator->delete($UserId, $ResourceType, $ResourceId));

		$this->throwDbExceptionIfExist();
		return $mResult;
	}
}
