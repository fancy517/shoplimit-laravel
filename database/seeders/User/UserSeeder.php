<?php

namespace Database\Seeders\User;

use App\Models\Shopper\Shopper;
use App\Models\Shopper\Status;
use App\Models\Store\Location\Location;
use App\Models\Store\Store;
use App\Models\User\Team;
use App\Models\User\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Class UserSeeder
 * @package Database\Seeders\User
 */
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     * @throws \Exception
     */
    public function run()
    {
        User::factory()
            ->count(1)
            ->create([
            'name' => config('store.admin.name', 'Grocery Store Employee'),
            'email' => config('store.admin.email', 'admin@store.com'),
            'password' => Hash::make(
                config('store.admin.password', 'password')
            )
        ])->each(function ($user){

            Team::factory()
                ->count(1)
                ->create([
                'user_id' => $user->id,
                'name' => 'Grocery Store Team',
                'personal_team' => true
            ]);

            Store::factory()
                ->count(3)
                ->hasAttached($user)
                ->create()
                ->each(function ($store) use ($user){

                    Location::factory()
                        ->count( random_int( 1, 5) )
                        ->hasAttached($user)
                        ->create([
                            'store_id' => $store->id
                        ])
                        ->each(function ($location) use ($user){

                            $shopperStatus = Status::all();

                            foreach ( $shopperStatus as $status ){

                                /**
                                 * Active Shoppers
                                 */
                                if( $status->name === 'Active' ){
                                    Shopper::factory()
                                        ->count( random_int( 5, 50) )
                                        ->active()
                                        ->create([
                                        'location_id' => $location->id,
                                        'status_id' => $status->id
                                    ]);
                                }

                                /**
                                 * Completed Shoppers
                                 */
                                if( $status->name === 'Completed' ){

                                    Shopper::factory()
                                        ->count( random_int( 5, 50) )
                                        ->completed()
                                        ->create([
                                        'location_id' => $location->id,
                                        'status_id' => $status->id,
                                        'user_id' => $user->id
                                    ]);
                                }

                                /**
                                 * Pending Shoppers
                                 */
                                if( $status->name === 'Pending' ){
                                    Shopper::factory()
                                        ->count( random_int( 5, 50) )
                                        ->pending()
                                        ->create([
                                        'location_id' => $location->id,
                                        'status_id' => $status->id
                                    ]);
                                }

                            }

                        });

                });

        });
    }
}
