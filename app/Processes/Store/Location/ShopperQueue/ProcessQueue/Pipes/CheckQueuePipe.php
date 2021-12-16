<?php


namespace App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes;


use App\Processes\Pipe;
use App\Processes\Store\Location\ShopperQueue\ProcessQueue\ShopperQueueServicePipeline;
use Closure;

/**
 * Class CheckQueuePipe
 * @package App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes
 */
class CheckQueuePipe extends ShopperQueueServicePipeline implements Pipe
{
    /**
     * @param $content
     * @param Closure $next
     * @return mixed
     */
    public function handle($content, Closure $next)
    {
        /**
         * @desc Set process queue count to 0
         */
        $content['process_count'] = 0;

        /**
         * @desc Get active shopper status id
         */
        $activeStatus = $this->getActiveStatusId();

        /**
         * @desc Continue if location or status not set
         */
        if( !isset($content['location']['id'], $activeStatus['id']) ){
            return $next($content);
        }

        /**
         * @desc Pass active status id to next pipe
         */
        $content['active_status_id'] = $activeStatus['id'];

        /**
         * @desc Get active queue count
         */
        $activeQueueCount = $this->activeQueueCount($content['location']['id'], $activeStatus['id']);

        /**
         * @desc Compare active queue count with shopper limit amount
         */
        $content['process_count'] = $this->calculateQueue($content['location']['shopper_limit'], $activeQueueCount);

        return $next($content);
    }

    /**
     * @return mixed
     */
    private function getActiveStatusId()
    {
        return $this->status->show(
            [
                'name' => 'Active'
            ]
        );
    }

    /**
     * @param int $propertyId
     * @param $statusId
     * @return mixed
     */
    private function activeQueueCount(int $propertyId, $statusId)
    {
        return $this->shopper->count(
            [
                'location_id' => $propertyId,
                'status_id' => $statusId
            ]
        );
    }

    /**
     * @param $limit
     * @param $queue
     * @return int
     */
    private function calculateQueue($limit, $queue): int
    {
        if( is_int($limit) && is_int($queue) && $queue < $limit ) {
            return $limit - $queue;
        }

        return 0;
    }
}
