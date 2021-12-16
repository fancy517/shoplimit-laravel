<?php

namespace App\Repositories\Store;

use App\Models\Store\Store;
use App\Repositories\BaseRepository;

/**
 * Class StoreRepository
 * @package App\Repositories\Store
 */
class StoreRepository extends BaseRepository
{
    /**
     * @var Store
     */
    protected $store;

    /**
     * StoreRepository constructor.
     * @param Store $store
     */
    public function __construct(Store $store)
    {
        $this->store = $store;
        parent::__construct($this->store);
    }
}
