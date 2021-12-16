<?php

use App\Http\Controllers\Store\StoreController;
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

Route::name('index')
    ->get('/index', [StoreController::class, 'index']);

Route::name('create')
    ->get('/create', [StoreController::class, 'create']);

Route::name('save')
    ->post('/create', [StoreController::class, 'store']);

Route::name('store')
    ->get('/{store}', [StoreController::class, 'show']);

Route::namespace('Location')
    ->prefix('{storeUuid}/location')
    ->name('location.')
    ->group(__DIR__ . '/Location/web.php');
