<?php

namespace App\Processes\Store\Location\ShopperQueue\ProcessQueue;

use App\Services\Shopper\ShopperService;
use App\Services\Shopper\StatusService;
use App\Services\Store\Location\LocationService;

/**
 * Class ShopperQueueServicePipeline
 * @package App\Processes\Store\Location\ShopperQueue\ProcessQueue
 */
class ShopperQueueServicePipeline
{
    /**
     * @var LocationService
     */
    protected $location;

    /**
     * @var ShopperService
     */
    protected $shopper;

    /**
     * @var StatusService
     */
    protected $status;

    /**
     * ShopperQueueServicePipeline constructor.
     * @param LocationService $location
     * @param ShopperService $shopper
     * @param StatusService $status
     */
    public function __construct(
        LocationService $location,
        ShopperService $shopper,
        StatusService $status
    )
    {
        $this->location = $location;
        $this->shopper = $shopper;
        $this->status = $status;
    }
}
