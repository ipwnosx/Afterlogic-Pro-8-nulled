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
class CommandCreator extends \Aurora\System\Db\AbstractCommandCreator
{
	/**
	 * @return string
	 */
	public function create($UserId, $ResourceType, $ResourceId, $IpAddress, $Action, $Time, $GuestPublicId)
	{
		$sSql = 'INSERT INTO %sactivity_history (user_id, resource_type, resource_id, ip_address, action, time, guest_public_id) VALUES (%d, %s, %s, %s, %s, %d, %s)';

		return sprintf($sSql, $this->prefix(), $UserId, $this->escapeString($ResourceType), $this->escapeString($ResourceId),
			$this->escapeString($IpAddress), $this->escapeString($Action), $Time, $this->escapeString($GuestPublicId));
	}

	/**
	 * @param string $sHash
	 *
	 * @return string
	 */
	public function getList($UserId, $ResourceType, $ResourceId, $Offset = 0, $Limit = 0)
	{
		$sLimit = "";
		if ($Limit > 0)
		{
			$sLimit = sprintf("LIMIT %d, %d", $Offset, $Limit);
		}
		$sSql = 'SELECT * FROM %sactivity_history WHERE user_id = %d AND resource_type = %s AND resource_id = %s %s';

		return sprintf($sSql, $this->prefix(), $UserId, $this->escapeString($ResourceType), $this->escapeString($ResourceId), $sLimit);
	}

	/**
	 * @param string $sHash
	 *
	 * @return string
	 */
	public function getListCount($UserId, $ResourceType, $ResourceId)
	{
		$Limit = "";
		$Offset = "";
		if ($Limit > 0)
		{
			$Limit = sprintf("LIMIT %d", $Limit);
			$Offset = sprintf("OFFSET %d", $Offset);
		}
		$sSql = 'SELECT count(id) as cnt FROM %sactivity_history WHERE user_id = %d AND resource_type = %s AND resource_id = %s';

		return sprintf($sSql, $this->prefix(), $UserId, $this->escapeString($ResourceType), $this->escapeString($ResourceId), $Limit, $Offset);
	}

	/**
	 * @param string $sHash
	 *
	 * @return string
	 */
	public function delete($UserId, $ResourceType, $ResourceId)
	{
		$sSql = 'DELETE FROM %sactivity_history WHERE user_id = %d AND resource_type = %s AND resource_id = %s';

		return sprintf($sSql, $this->prefix(), $UserId, $this->escapeString($ResourceType), $this->escapeString($ResourceId));
	}
}
