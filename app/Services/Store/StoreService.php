<?php

namespace App\Services\Store;

use App\Repositories\Store\StoreRepository;
use App\Services\BaseService;

/**
 * Class StoreService
 * @package App\Services\Store
 */
class StoreService extends BaseService
{
    /**
     * @var StoreRepository
     */
    protected $store;

    /**
     * StoreService constructor.
     * @param StoreRepository $store
     */
    public function __construct(StoreRepository $store)
    {
        $this->store = $store;
        parent::__construct($this->store);
    }
}
