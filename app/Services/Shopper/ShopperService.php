<?php

namespace App\Services\Shopper;

use App\Repositories\Shopper\ShopperRepository;
use App\Services\BaseService;

/**
 * Class ShopperService
 * @package App\Services\Shopper
 */
class ShopperService extends BaseService
{
    /**
     * @var ShopperRepository
     */
    protected $shopper;

    /**
     * ShopperService constructor.
     * @param ShopperRepository $shopper
     */
    public function __construct(ShopperRepository $shopper)
    {
        $this->shopper = $shopper;
        parent::__construct($this->shopper);
    }
}
