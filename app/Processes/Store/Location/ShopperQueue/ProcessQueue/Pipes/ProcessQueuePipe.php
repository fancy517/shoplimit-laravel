<?php

namespace App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes;

use App\Processes\Pipe;
use App\Processes\Store\Location\ShopperQueue\ProcessQueue\ShopperQueueServicePipeline;
use Closure;

/**
 * Class ProcessQueuePipe
 * @package App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes
 */
class ProcessQueuePipe extends ShopperQueueServicePipeline implements Pipe
{
    /**
     * @param $content
     * @param Closure $next
     * @return mixed
     */
    public function handle($content, Closure $next)
    {
        if( !isset($content['process_count']) || $content['process_count'] === 0 ){
            return $next($content);
        }

        /**
         * @desc Get active shopper status id
         */
        $pendingStatus = $this->getPendingStatusId();

        /**
         * @desc Continue if location or status not set
         */
        if( !isset($content['location']['id'], $pendingStatus['id']) ){
            return $next($content);
        }

        $pendingShoppers = $this->pendingShoppers(
            $content['location']['id'],
            $pendingStatus['id'],
            $content['process_count']
        );

        $this->activatePendingShoppers( $pendingShoppers, $content['active_status_id'] );

        return $next($content);
    }

    /**
     * @param int $propertyId
     * @param int $statusId
     * @param int $limit
     * @return mixed
     */
    private function pendingShoppers(int $propertyId, int $statusId, int $limit)
    {
        return $this->shopper->all(
            null,
            [
                'location_id' => $propertyId,
                'status_id' => $statusId
            ],
            null,
            null,
            [
                'check_in' => 'asc'
            ],
            null,
            $limit
        );
    }

    /**
     * @return mixed
     */
    private function getPendingStatusId()
    {
        return $this->status->show(
            [
                'name' => 'Pending'
            ]
        );
    }

    /**
     * @param $shoppers
     * @param int $activeStatusId
     */
    private function activatePendingShoppers($shoppers, int $activeStatusId): void
    {
        if( is_iterable($shoppers) ){
            foreach ($shoppers as $shopper){
                $this->shopper->update(
                    $shopper['id'],
                    [
                        'status_id' => $activeStatusId
                    ]
                );
            }
        }
    }
}
