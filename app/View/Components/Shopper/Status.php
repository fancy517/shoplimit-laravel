<?php

namespace App\View\Components\Shopper;

use Illuminate\View\Component;

class Status extends Component
{
    /**
     * @var
     */
    public $shopper;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($shopper)
    {
        $this->shopper = $shopper;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.shopper.status');
    }
}
