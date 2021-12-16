<?php

use App\Http\Controllers\ClosureController;
use Illuminate\Support\Facades\Route;

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
