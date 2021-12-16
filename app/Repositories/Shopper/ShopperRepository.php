<?php

namespace App\Repositories\Shopper;

use App\Models\Shopper\Shopper;
use App\Repositories\BaseRepository;

/**
 * Class ShopperRepository
 * @package App\Repositories\Shopper
 */
class ShopperRepository extends BaseRepository
{
    /**
     * @var Shopper
     */
    protected $shopper;

    /**
     * ShopperRepository constructor.
     * @param Shopper $shopper
     */
    public function __construct(Shopper $shopper)
    {
        $this->shopper = $shopper;
        parent::__construct($this->shopper);
    }
}
