<?php

namespace App\Processes;

use Closure;

/**
 * Interface Pipe
 * @package App\Processes
 */
interface Pipe
{
    /**
     * @param $content
     * @param Closure $next
     * @return mixed
     */
    public function handle($content, Closure $next);
}
