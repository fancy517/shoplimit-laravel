<?php

namespace App\Http\Controllers;

/**
 * Class ClosureController
 * @package App\Http\Controllers
 */
class ClosureController extends Controller
{
    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function index()
    {
        return redirect()->route('dashboard');
    }
}
