<?php

namespace App\Services\Shopper;

use App\Repositories\Shopper\StatusRepository;
use App\Services\BaseService;

/**
 * Class StatusService
 * @package App\Services\Shopper
 */
class StatusService extends BaseService
{
    /**
     * @var StatusRepository
     */
    protected $status;

    /**
     * StatusService constructor.
     * @param StatusRepository $status
     */
    public function __construct(StatusRepository $status)
    {
        $this->status = $status;
        parent::__construct($this->status);
    }
}
