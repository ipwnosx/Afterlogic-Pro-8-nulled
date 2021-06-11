<?php
/**
 * This code is licensed under Afterlogic Software License.
 * For full statements of the license see LICENSE file.
 */

namespace Aurora\Modules\ActivityHistory\Classes;

/**
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 *
 * @property int $Id
 * @property int $UserId
 * @property string $ResourceType
 * @property string $ResourceId
 * @property string $IpAddress
 * @property string $Action
 * @property int $Timestamp
 * @property string $GuestPublicId
 */
class ActivityHistory extends \Aurora\System\AbstractContainer
{
	public function __construct()
	{
		parent::__construct(get_class($this));

		$this->SetDefaults(array(
			'UserId'				=> 0,
			'ResourceType'			=> '',
			'ResourceId'			=> '',
			'IpAddress'				=> '',
			'Action'				=> '',
			'Timestamp'				=> 0,
			'GuestPublicId'			=> '',
		));
	}

	/**
	 * @return array
	 */
	public function getMap()
	{
		return self::getStaticMap();
	}

	/**
	 * @return array
	 */
	public static function getStaticMap()
	{
		return array(
			'UserId'	    => array('int', 'user_id', false, false),
			'ResourceType'  => array('string', 'resource_type', true, false),
			'ResourceId'    => array('string', 'resource_id', true, false),
			'IpAddress'	    => array('string', 'ip_address', true, false),
			'Action'	    => array('string', 'action', true, false),
			'Timestamp'		=> array('int', 'time'), true, false,
			'GuestPublicId'	    => array('string', 'guest_public_id', true, false),
		);
	}

	public function toResponseArray()
	{
		return [
			'UserId' => $this->UserId,
			'ResourceType' => $this->ResourceType,
			'ResourceId' => $this->ResourceId,
			'IpAddress' => $this->IpAddress,
			'Action' => $this->Action,
			'Timestamp' => $this->Timestamp,
			'GuestPublicId' => $this->GuestPublicId,
		];
	}
}
