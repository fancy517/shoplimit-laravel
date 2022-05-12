<?php

namespace App\Http\Controllers\Store\Location;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\Location\LocationCreateRequest;
use App\Http\Requests\Store\Location\LocationQueueRequest;
use App\Http\Requests\Store\Location\LocationStoreRequest;
use App\Models\Store\Location\Location;
use App\Services\Store\Location\LocationService;
use Illuminate\Http\Request;
use App\Models\Shopper\Shopper;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class LocationController
 * @package App\Http\Controllers\Store
 */
class LocationController extends Controller
{
    /**
     * @var LocationService
     */
    protected $location;

    /**
     * LocationController constructor.
     * @param LocationService $location
     */
    public function __construct(LocationService $location)
    {
        $this->location = $location;
    }

    /**
     * @param Location $location
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function public(Location $location)
    {
        return view('stores.location.public')
            ->with('location', $location);
    }

    /**
     * @param LocationCreateRequest $request
     * @param string $storeUuid
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function create(LocationCreateRequest $request, string $storeUuid)
    {
        return view('stores.location.create')
            ->with('store', $storeUuid);
    }

    /**
     * @param LocationStoreRequest $request
     * @param string $storeUuid
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(LocationStoreRequest $request, string $storeUuid): \Illuminate\Http\RedirectResponse
    {
        $this->location->create([
            'location_name' => $request->location_name,
            'shopper_limit' => $request->shopper_limit,
            'store_id' => $storeUuid
        ]);

        return redirect()->route('store.store', ['store' => $storeUuid]);
    }

    /**
     * @param LocationQueueRequest $request
     * @param string $storeUuid
     * @param string $locationUuid
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function queue(LocationQueueRequest $request, string $storeUuid, string $locationUuid)
    {
        $location = $this->location->show(
            [
                'uuid' => $locationUuid
            ],
            [
                'Shoppers',
                'Shoppers.Status'
            ]
        );

        $shoppers = null;

        if( isset($location['shoppers']) && count($location['shoppers']) >= 1 ){
            $shoppers = $this->location->getShoppers($location['shoppers']);
        }
        return view('stores.location.queue')
            ->with('storeUuid', $storeUuid)
            ->with('locationUuid', $locationUuid)
            ->with('location', $location)
            ->with('shoppers', $shoppers);
    }
    public function checkout(Request $request, $storeUuid, $locationUuid) {
        try {
            $shopper = Shopper::findOrFail($request->input('shopper_id'));
            $shopper->status_id = 2;
            $shopper->save();
            $location = Location::where('uuid', $locationUuid)->firstOrFail();
            $location->acceptShoppers();
        } catch (ModelNotFoundExeption $th) {
        }
        return redirect()->route('store.location.queue', ['storeUuid'=>$storeUuid, 'locationUuid'=>$locationUuid]);
    }

    public function addshopper (Request $request, $storeUuid, $locationUuid) {
        try {
            $location = Location::where('uuid', $locationUuid)->firstOrFail();
        } catch (ModelNotFoundException $th) {
            //throw $th;
        }
        try {
            $shopper = Shopper::where('email', $request->input('email'))->firstOrFail();
        } catch (ModelNotFoundException $th) {
            $shopper = new Shopper();
        }
        $shopper->status_id = 3;
        $shopper->first_name = $request->input('first_name');
        $shopper->last_name = $request->input('last_name');
        $shopper->email = $request->input('email');
        $shopper->location_id = $location->id;
        $shopper->check_in = now()->format('Y-m-d H:i:s');
        $shopper->save();
        return redirect()->route('store.location.queue', ['storeUuid'=>$storeUuid, 'locationUuid'=>$locationUuid]);
    }
}
