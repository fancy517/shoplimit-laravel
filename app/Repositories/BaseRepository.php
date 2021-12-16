<?php

namespace App\Repositories;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class BaseRepository
 * @package App\Repositories
 */
class BaseRepository implements Repository
{
    /**
     * @var
     */
    protected $model;

    /**
     * BaseRepository constructor.
     * @param $model
     */
    public function __construct($model)
    {
        $this->model = $model;
    }

    /**
     * @param array|null $select
     * @param array|null $where
     * @param array|null $whereNot
     * @param array|null $with
     * @param null $orderBy
     * @param null $groupBy
     * @param int|null $limit
     * @return array|null
     */
    public function all(
        array $select = null,
        array $where = null,
        array $whereNot = null,
        array $with = null,
        $orderBy = null,
        $groupBy = null,
        int $limit = null
    ): ?array
    {
        $query = $this->model;

        /**
         * @desc Chain where clauses
         */
        if ( $select !== null && is_array($select) ){
            foreach ($select as $value){
                $query = $query->addSelect($value);
            }
        }

        /**
         * @desc Chain where clauses
         */
        if ( $where !== null && is_array($where) ){
            foreach ($where as $key => $value){
                $query = $query->where($key, '=', $value);
            }
        }

        /**
         * @desc Chain where no clauses
         */
        if ( $whereNot !== null && is_array($whereNot) ){
            foreach ($whereNot as $key => $value){
                $query = $query->where($key, '!=', $value);
            }
        }

        /**
         * @desc Chain eager loaded relationships
         */
        if ( $with !== null && is_array($with) ){
            foreach ($with as $value){
                $query = $query->with($value);
            }
        }

        /**
         * @desc Chain order by clauses
         */
        if( $orderBy !== null ){
            switch( gettype($orderBy) )
            {
                case 'string':
                    $query = $query->orderBy($orderBy);
                    break;
                case 'array':
                    foreach( $orderBy as $key => $value )
                    {
                        $query = $query->orderBy( $key, $value );
                    }
                    break;
            }
        }

        /**
         * @desc Chain order by clauses
         */
        if( $groupBy !== null ){
            switch( gettype($groupBy) )
            {
                case 'string':
                    $query = $query->groupBy($groupBy);
                    break;
                case 'array':
                    foreach( $groupBy as $value )
                    {
                        $query = $query->groupBy( $value );
                    }
                    break;
            }
        }

        /**
         * @desc Chain eager loaded relationships
         */
        if ( $limit !== null && is_int($limit) ){
            $query = $query->limit($limit);
        }

        return $this->toArray(
            $query->get()
        );
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function create(
        array $data
    )
    {
        return $this->model->create(
            $data
        );
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function insertOrIgnore(
        array $data
    )
    {
        return $this->model->insertOrIgnore(
            $data
        );
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function insertGetId(
        array $data
    )
    {
        return $this->model->insertGetId(
            $data
        );
    }

    /**
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(
        int $id,
        array $data
    ): bool
    {
        try {

            $this->model->where(
                'id', $id
            )->update($data);

            return true;

        } catch(\Exception $e) {
            Log::error($e->getMessage());
        }

        return false;
    }

    /**
     * @param int $id
     * @param string $column
     * @return bool
     */
    public function increment(
        int $id,
        string $column
    ): bool
    {
        try {

            $this->model->where(
                'id', $id
            )->update([
                $column => DB::raw($column . ' + 1')
            ]);

            return true;

        } catch(\Exception $e) {
            Log::error($e->getMessage());
        }

        return false;
    }

    /**
     * @param int $id
     */
    public function delete(
        int $id
    ): void
    {
        $this->model->where(
            'id', '=', $id
        )->delete();
    }

    /**
     * @param int $id
     */
    public function softDelete(
        int $id
    ): void
    {
        $this->model->where(
            'id', '=', $id
        )->delete();
    }

    /**
     * @param int $id
     */
    public function hardDelete(
        int $id
    ): void
    {
        $this->model->where(
            'id', '=', $id
        )->forceDelete();
    }

    /**
     * @param array $where
     * @param array|null $with
     * @param null $orderBy
     * @return array|null
     */
    public function show(
        array $where,
        array $with = null,
        $orderBy = null
    ): ?array
    {
        $query = $this->model;

        /**
         * @desc Chain where clauses
         */
        if ( $where !== null && is_array($where) ){
            foreach ($where as $key => $value){
                $query = $query->where($key, '=', $value);
            }
        }

        /**
         * @desc Chain eager loaded relationships
         */
        if ( $with !== null && is_array($with) ){
            foreach ($with as $value){
                $query = $query->with($value);
            }
        }

        /**
         * @desc Chain order by clauses
         */
        if( $orderBy !== null ){
            switch( gettype($orderBy) )
            {
                case 'string':
                    $query = $query->orderBy($orderBy);
                    break;
                case 'array':
                    foreach( $orderBy as $key => $value )
                    {
                        $query = $query->orderBy( $key, $value );
                    }
                    break;
            }
        }

        return $this->toArray(
            $query->first()
        );
    }

    /**
     * @param array|null $select
     * @param array|null $where
     * @return array|mixed|null
     */
    public function showByName(
        array $select = null,
        array $where = null
    )
    {
        $query = $this->model;

        /**
         * @desc Chain where clauses
         */
        if ( $select !== null && is_array($select) ){
            $columns = implode(',', $select);
            $query = $query->select($select);
        }

        /**
         * @desc Chain where clauses
         */
        if ( $where !== null && is_array($where) ){
            foreach ($where as $key => $value){
                $query = $query->where($key, '=', $value);
            }
        }

        return $this->toArray(
            $query->first()
        );
    }

    /**
     * @param array|null $where
     * @param array|null $with
     * @param null $orderBy
     * @return mixed
     */
    public function count(
        array $where = null,
        array $with = null,
        $orderBy = null
    )
    {
        $query = $this->model;

        /**
         * @desc Chain where clauses
         */
        if ( $where !== null && is_array($where) ){
            foreach ($where as $key => $value){
                $query = $query->where($key, '=', $value);
            }
        }

        /**
         * @desc Chain eager loaded relationships
         */
        if ( $with !== null && is_array($with) ){
            foreach ($with as $value){
                $query = $query->with($value);
            }
        }

        /**
         * @desc Chain order by clauses
         */
        if( $orderBy !== null ){
            switch( gettype($orderBy) )
            {
                case 'string':
                    $query = $query->orderBy($orderBy);
                    break;
                case 'array':
                    foreach( $orderBy as $key => $value )
                    {
                        $query = $query->orderBy( $key, $value );
                    }
                    break;
            }
        }

        return $query->count();
    }

    /**
     * @param $collection
     * @return array|null
     */
    private function toArray($collection): ?array
    {
        if( empty($collection) ){
            return null;
        }

        return $collection->toArray();
    }
}
