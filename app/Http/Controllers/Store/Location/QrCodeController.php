<?php

namespace App\Http\Controllers\Store\Location;

use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Http\Controllers\Controller;

/**
 * Class QrCodeController
 * @package App\Http\Controllers\Store\Location
 */
class QrCodeController extends Controller
{
    /**
     * @desc A QR Code Store Locations Can Use In Their Check-In Line
     *
     * @param string $uuid
     * @return mixed
     */
    public function qrCode(string $uuid)
    {
        return QrCode::size(200)->generate( route('public.location', $uuid) );
    }
}
