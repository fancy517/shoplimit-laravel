<?php

namespace App\Providers;

use App\Models\{
    Shopper\Shopper as ShopperModel,
    Shopper\Status as StatusModel,
    Store\Location\Location as LocationModel,
    Store\Store as StoreModel,
    User\User as UserModel
};

use App\Observers\{
    Shopper\ShopperObserver,
    Shopper\StatusObserver,
    Store\Location\LocationObserver,
    Store\StoreObserver,
    User\UserObserver
};

use Illuminate\Support\ServiceProvider;

class ObserverServiceProvider extends ServiceProvider
{
    /**
     * @var string[]
     */
    protected $modelObserverMap = [
        ShopperModel::class => ShopperObserver::class,
        StatusModel::class => StatusObserver::class,
        LocationModel::class => LocationObserver::class,
        StoreModel::class => StoreObserver::class,
        UserModel::class => UserObserver::class
    ];

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(): void
    {
        foreach ($this->modelObserverMap as $model => $observer)
        {
            $model::observe($observer);
        }
    }
}
