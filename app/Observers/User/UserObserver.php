<?php

namespace App\Observers\User;

use App\Models\User\User;
use App\Observers\BaseObserver;

/**
 * Class UserObserver
 * @package App\Observers\User
 */
class UserObserver extends BaseObserver
{
    /**
     * Handle the User "created" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function created(User $user): void
    {
        //
    }

    /**
     * Handle the User "updated" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
