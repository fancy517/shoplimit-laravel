<?php

namespace App\Repositories\Shopper;

use App\Models\Shopper\Status;
use App\Repositories\BaseRepository;

/**
 * Class StatusRepository
 * @package App\Repositories\Shopper
 */
class StatusRepository extends BaseRepository
{
    /**
     * @var Status
     */
    protected $status;

    /**
     * StatusRepository constructor.
     * @param Status $status
     */
    public function __construct(Status $status)
    {
        $this->status = $status;
        parent::__construct($this->status);
    }
}
