<?php

namespace App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes;

use App\Processes\Pipe;
use Closure;

/**
 * Class FinishedQueuePipe
 * @package App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes
 */
class FinishedQueuePipe implements Pipe
{
    /**
     * @param $content
     * @param Closure $next
     * @return mixed
     */
    public function handle($content, Closure $next)
    {
        return $next('Shopper Queue Processed');
    }
}
