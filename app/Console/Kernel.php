<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Shopper\Shopper;
use App\Models\Store\location\Location;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $checkInLowLimit = now()->modify('-2 hours')->format('Y-m-d H:i:s');
            Shopper::where('check_in', '<', $checkInLowLimit)
                ->where('status_id', 1)
                ->update(['status_id'=> 2, 'check_out' => now()]);
            $locations = Location::all();
            foreach ($locations as $loc) {
                $loc->acceptShoppers();
            }
        })->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
