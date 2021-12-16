<?php

namespace App\Traits\Database;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

/**
 * Trait UuidTrait
 * @package App\Traits\Database
 */
trait UuidTrait
{
    /**
     * @return string
     */
    public function generateUuid(): string
    {
        return (string) Str::uuid();
    }

    /**
     * @param string $model
     * @param string $column
     * @return string
     * @throws Exception
     */
    public function generateDbUuid(string $model, string $column = 'uuid'): string
    {
        try{

            do {
                $uuid = $this->generateUuid();
            } while (
                DB::table($model)->where($column, '=', $uuid)->first() instanceof DB
            );

            return $uuid;

        }catch (Exception $exception){
            return $exception->getMessage();
        }
    }

    /**
     * @param Model $model
     * @param string $column
     * @return string
     */
    public function generateModelUuid(Model $model, string $column = 'uuid'): string
    {
        try{

            do {
                $uuid = $this->generateUuid();
            } while (
                $model->where($column, '=', $uuid)->first() instanceof Model
            );

            return $uuid;

        }catch (Exception $exception){
            return $exception->getMessage();
        }
    }
}
