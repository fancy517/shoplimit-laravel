<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreCreateRequest;
use App\Http\Requests\Store\StoreIndexRequest;
use App\Http\Requests\Store\StoreStoreRequest;
use App\Models\Store\Store;
use App\Services\Store\StoreService;
use App\Services\User\UserService;
use Illuminate\Support\Facades\Auth;

/**
 * Class StoreController
 * @package App\Http\Controllers\Store
 */
class StoreController extends Controller
{
    /**
     * @var StoreService
     */
    protected $store;

    /**
     * @var UserService
     */
    protected $user;

    /**
     * StoreController constructor.
     * @param StoreService $store
     * @param UserService $user
     */
    public function __construct(StoreService $store, UserService $user)
    {
        $this->store = $store;
        $this->user = $user;
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index()
    {
        $user = $this->user->show(
            [
                'id' => Auth::user()->id
            ],
            ['Stores']
        );

        return view('stores.index')
            ->with('stores', $user['stores'] ?? null);
    }

    /**
     * @param Store $store
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(StoreIndexRequest $request, Store $store)
    {
        return view('stores.store')
            ->with('store', $store);
    }

    /**
     * @param StoreCreateRequest $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function create(StoreCreateRequest $request)
    {
        return view('stores.create');
    }

    /**
     * @param StoreStoreRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreStoreRequest $request): \Illuminate\Http\RedirectResponse
    {
        $this->store->create([
            'store_name' => $request->store_name
        ]);

        return redirect()->route('store.index');
    }
}
