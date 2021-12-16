<?php

namespace Database\Seeders;

use Database\Seeders\Shopper\StatusSeeder;
use Database\Seeders\User\UserSeeder;
use Illuminate\Database\Seeder;

/**
 * Class DatabaseSeeder
 * @package Database\Seeders
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        $this->call([
            StatusSeeder::class,
            UserSeeder::class
        ]);
    }
}
