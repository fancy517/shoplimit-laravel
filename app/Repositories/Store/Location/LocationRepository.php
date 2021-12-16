<?php

namespace App\Repositories\Store\Location;

use App\Models\Store\Location\Location;
use App\Repositories\BaseRepository;

/**
 * Class LocationRepository
 * @package App\Repositories\Store
 */
class LocationRepository extends BaseRepository
{
    /**
     * @var Location
     */
    protected $location;

    /**
     * LocationRepository constructor.
     * @param Location $location
     */
    public function __construct(Location $location)
    {
        $this->location = $location;
        parent::__construct($this->location);
    }
}
