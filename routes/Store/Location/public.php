<?php

use App\Http\Controllers\Store\Location\LocationController;
use App\Http\Controllers\Store\Location\QrCodeController;
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

Route::namespace('Location')
    ->group(function (){

        Route::name('qrCode')
            ->get('/qr-code/{uuid}', [QrCodeController::class, 'qrCode']);

        Route::name('location')
            ->get('/{location}', [LocationController::class, 'public']);

    });

