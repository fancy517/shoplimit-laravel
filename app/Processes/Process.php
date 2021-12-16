<?php

namespace App\Processes;

/**
 * Interface Process
 * @package App\Processes
 */
interface Process
{
    /**
     * @return array
     */
    public function loadPipes(): array;

    /**
     * @param array $data
     * @return mixed
     */
    public function run(array $data);
}
