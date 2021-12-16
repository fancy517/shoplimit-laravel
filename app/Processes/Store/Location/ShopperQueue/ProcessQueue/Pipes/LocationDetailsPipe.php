<?php


namespace App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes;


use App\Processes\Pipe;
use App\Processes\Store\Location\ShopperQueue\ProcessQueue\ShopperQueueServicePipeline;
use Closure;

/**
 * Class LocationDetailsPipe
 * @package App\Processes\Store\Location\ShopperQueue\ProcessQueue\Pipes
 *
 * @desc Pipe to find Location Details, include Shopper Queue Limit.
 */
class LocationDetailsPipe extends ShopperQueueServicePipeline implements Pipe
{
    /**
     * @var null
     */
    protected $location = null;

    /**
     * @param $content
     * @param Closure $next
     * @return mixed
     */
    public function handle($content, Closure $next)
    {
        $this->getLocationDetails($content);

        $content['location'] = $this->location;

        return $next($content);
    }

    /**
     * @param $content
     */
    private function getLocationDetails($content): void
    {
        if( isset($content['location_id']) && is_int($content['location_id']) ){
            $this->location = $this->getLocationById($content['location_id']);
        }

        if( isset($content['location_uuid']) && is_string($content['location_uuid']) ){
            $this->location = $this->getLocationByUuid($content['location_uuid']);
        }
    }

    /**
     * @param int $id
     * @return mixed
     */
    private function getLocationById(int $id)
    {
        return $this->location->show(
            [
                'id' => $id
            ]
        );
    }

    /**
     * @param string $uuid
     * @return mixed
     */
    private function getLocationByUuid(string $uuid)
    {
        return $this->location->show(
            [
                'uuid' => $uuid
            ]
        );
    }
}
