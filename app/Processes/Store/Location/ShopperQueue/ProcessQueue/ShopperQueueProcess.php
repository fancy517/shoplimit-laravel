<?php

namespace App\Processes\Store\Location\ShopperQueue\ProcessQueue;

use App\Processes\Process;
use App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes\CheckQueuePipe;
use App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes\FinishedQueuePipe;
use App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes\LocationDetailsPipe;
use App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes\ProcessQueuePipe;
use Illuminate\Pipeline\Pipeline;

/**
 * Class ShopperQueueProcess
 * @package App\Processes\Store\Location\ShopperQueue\ProcessQueue
 *
 * @desc A pipeline process for processing the shopper queue. Follow the pipes.
 * This process:
 * Pulls the property information
 * Checks the queue in relation to the property's shopper limit settings
 * If slots are available it activates next up to bat pending shoppers for those shopping slots
 *
 * Example usage:
 *
 * $process = app()->make(App\Processes\Store\Location\ShopperQueue\ProcessQueue\ShopperQueueProcess::class);
 * $process->run([ 'location_id' => 2 ]);
 *
 */
class ShopperQueueProcess implements Process
{
    /**
     * @var array
     */
    protected $pipes;

    /**
     * NetAmountReportProcess constructor.
     */
    public function __construct()
    {
        $this->pipes = $this->loadPipes();
    }

    /**
     * @return string[]
     */
    public function loadPipes(): array
    {
        return [
            LocationDetailsPipe::class,
            CheckQueuePipe::class,
            ProcessQueuePipe::class,
            FinishedQueuePipe::class
        ];
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function run(array $data)
    {
        return app(Pipeline::class)
            ->send($data)
            ->through($this->pipes)
            ->then(function ($data){
                return $data;
            });
    }
}
