<?php

use App\Http\Controllers\ClosureController;
use Illuminate\Support\Facades\Route;
use App\Models\Shopper\Shopper;
use App\Models\Store\Location\Location;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ClosureController::class, 'index']);

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::middleware(['auth:sanctum', 'verified'])
    ->namespace('Store')
    ->prefix('store')
    ->name('store.')
    ->group(__DIR__ . '/Store/web.php');

Route::namespace('Store')
    ->prefix('sign-in')
    ->name('public.')
    ->group(__DIR__ . '/Store/Location/public.php');

Route::get('/test', function () {
    $checkInLowLimit = now()->modify('-2 hours')->format('Y-m-d H:i:s');

    Shopper::where('check_in', '<', $checkInLowLimit)
        ->where('status_id', 1)
        ->update(['status_id'=> 2, 'check_out' => now()]);
    $locations = Location::all();
    foreach ($locations as $loc) {
        $loc->acceptShoppers();
    }
    return $checkInLowLimit;
});