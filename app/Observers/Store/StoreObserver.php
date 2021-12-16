<?php

namespace App\Observers\Store;

use App\Models\Store\Store;
use App\Observers\BaseObserver;
use Illuminate\Support\Facades\Auth;

/**
 * Class StoreObserver
 * @package App\Observers\Store
 */
class StoreObserver extends BaseObserver
{
    /**
     * Handle the Store "created" event.
     *
     * @param  \App\Models\Store\Store  $store
     * @return void
     */
    public function created(Store $store): void
    {
        if( Auth::check() ){
            $store->users()->attach([
                Auth::user()->id
            ]);
        }
    }

    /**
     * Handle the Store "updated" event.
     *
     * @param  \App\Models\Store\Store  $store
     * @return void
     */
    public function updated(Store $store): void
    {
        //
    }

    /**
     * Handle the Store "deleted" event.
     *
     * @param  \App\Models\Store\Store  $store
     * @return void
     */
    public function deleted(Store $store): void
    {
        //
    }

    /**
     * Handle the Store "restored" event.
     *
     * @param  \App\Models\Store\Store  $store
     * @return void
     */
    public function restored(Store $store): void
    {
        //
    }

    /**
     * Handle the Store "force deleted" event.
     *
     * @param  \App\Models\Store\Store  $store
     * @return void
     */
    public function forceDeleted(Store $store): void
    {
        //
    }
}
