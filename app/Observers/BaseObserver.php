<?php

namespace App\Observers;

use App\Traits\Database\UuidTrait;

/**
 * Class BaseObserver
 * @package App\Observers
 */
class BaseObserver implements BaseObserverInterface
{
    use UuidTrait;

    /**
     * @desc Set unique UUID for model
     * @param $model
     * @return mixed|void
     */
    public function creating($model)
    {
        $model->uuid = $this->generateModelUuid($model);
    }
}
