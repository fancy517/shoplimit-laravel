<?php

namespace App\Observers\Store\Location;

use App\Models\Store\Location\Location;
use App\Observers\BaseObserver;
use App\Services\Store\StoreService;
use Illuminate\Support\Facades\Auth;

/**
 * Class LocationObserver
 * @package App\Observers\Store
 */
class LocationObserver extends BaseObserver
{
    /**
     * @var StoreService
     */
    protected $storeService;

    /**
     * LocationObserver constructor.
     * @param StoreService $storeService
     */
    public function __construct(StoreService $storeService)
    {
        $this->storeService = $storeService;
    }

    /**
     * @param $location
     * @return mixed|void
     */
    public function creating($location)
    {
        parent::creating($location);

        /**
         * @desc Abort if store uuid is missing.
         */
        if( !isset($location['store_id']) ){
            abort(403);
        }

        /**
         * @desc Find store by the provided UUID
         */
        $findStore = $this->findStore($location['store_id']);

        /**
         * @desc Assign found property id to location relation
         */
        if( isset($findStore['id']) ){
            $location->store_id = $findStore['id'];
        }

    }

    /**
     * @param string $storeUuid
     * @return mixed
     */
    private function findStore(string $storeUuid)
    {
        return $this->storeService->showByName(null, ['uuid' => $storeUuid]);
    }

    /**
     * Handle the Location "created" event.
     *
     * @param  \App\Models\Store\Location\Location  $location
     * @return void
     */
    public function created(Location $location): void
    {
        if( Auth::check() ){
            $location->users()->attach([
                Auth::user()->id
            ]);
        }
    }

    /**
     * Handle the Location "updated" event.
     *
     * @param  \App\Models\Store\Location\Location  $location
     * @return void
     */
    public function updated(Location $location): void
    {
        //
    }

    /**
     * Handle the Location "deleted" event.
     *
     * @param  \App\Models\Store\Location\Location  $location
     * @return void
     */
    public function deleted(Location $location): void
    {
        //
    }

    /**
     * Handle the Location "restored" event.
     *
     * @param  \App\Models\Store\Location\Location  $location
     * @return void
     */
    public function restored(Location $location): void
    {
        //
    }

    /**
     * Handle the Location "force deleted" event.
     *
     * @param  \App\Models\Store\Location\Location  $location
     * @return void
     */
    public function forceDeleted(Location $location): void
    {
        //
    }
}
