<?php

namespace App\Observers\Shopper;

use App\Models\Shopper\Status;
use App\Observers\BaseObserver;

/**
 * Class StatusObserver
 * @package App\Observers\Shopper
 */
class StatusObserver extends BaseObserver
{
    /**
     * Handle the Status "created" event.
     *
     * @param  \App\Models\Shopper\Status  $status
     * @return void
     */
    public function created(Status $status): void
    {
        //
    }

    /**
     * Handle the Status "updated" event.
     *
     * @param  \App\Models\Shopper\Status  $status
     * @return void
     */
    public function updated(Status $status): void
    {
        //
    }

    /**
     * Handle the Status "deleted" event.
     *
     * @param  \App\Models\Shopper\Status  $status
     * @return void
     */
    public function deleted(Status $status): void
    {
        //
    }

    /**
     * Handle the Status "restored" event.
     *
     * @param  \App\Models\Shopper\Status  $status
     * @return void
     */
    public function restored(Status $status): void
    {
        //
    }

    /**
     * Handle the Status "force deleted" event.
     *
     * @param  \App\Models\Shopper\Status  $status
     * @return void
     */
    public function forceDeleted(Status $status): void
    {
        //
    }
}
