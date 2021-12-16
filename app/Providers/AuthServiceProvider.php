<?php

namespace App\Providers;

use App\Models\{
    Store\Location\Location as LocationModel,
    Store\Store as StoreModel,
    Team as TeamModel
};

use App\Policies\{
    Store\Location\LocationPolicy,
    Store\StorePolicy,
    TeamPolicy
};

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        LocationModel::class => LocationPolicy::class,
        StoreModel::class => StorePolicy::class,
        TeamModel::class => TeamPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
