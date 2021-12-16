<?php

namespace Database\Seeders\Shopper;

use App\Models\Shopper\Status;
use Illuminate\Database\Seeder;

/**
 * Class StatusSeeder
 * @package Database\Seeders\Shopper
 */
class StatusSeeder extends Seeder
{
    /**
     * @var string[]
     */
    protected $statuses = [
        'Active',
        'Completed',
        'Pending'
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        foreach ($this->statuses as $status){
            $statusModel = new Status();
                $statusModel->name = $status;
            $statusModel->save();
        }
    }
}
