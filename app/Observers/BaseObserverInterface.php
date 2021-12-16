<?php

namespace App\Observers;

/**
 * Interface BaseObserverInterface
 * @package App\Observers
 */
interface BaseObserverInterface
{
    /**
     * @param $model
     * @return mixed
     */
    public function creating($model);
}
