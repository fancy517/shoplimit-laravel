<?php

namespace App\Services;

/**
 * Interface Service
 * @package App\Services
 */
interface Service
{
    /**
     * @param array|null $select
     * @param array|null $where
     * @param array|null $whereNot
     * @param array|null $with
     * @param null $orderBy
     * @param null $groupBy
     * @param int|null $limit
     * @return mixed
     */
    public function all(
        array $select = null,
        array $where = null,
        array $whereNot = null,
        array $with = null,
        $orderBy = null,
        $groupBy = null,
        int $limit = null
    );

    /**
     * @param array $data
     * @return mixed
     */
    public function create(
        array $data
    );

    /**
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(
        int $id,
        array $data
    ): bool;

    /**
     * @param int $id
     * @param string $column
     * @return bool
     */
    public function increment(
        int $id,
        string $column
    ): bool;

    /**
     * @param int $id
     */
    public function delete(
        int $id
    ): void;

    /**
     * @param int $id
     */
    public function softDelete(
        int $id
    ): void;

    /**
     * @param int $id
     */
    public function hardDelete(
        int $id
    ): void;

    /**
     * @param array $where
     * @param array|null $with
     * @param null $orderBy
     * @return mixed
     */
    public function show(
        array $where,
        array $with = null,
        $orderBy = null
    );

    /**
     * @param array $select
     * @param array $where
     * @return mixed
     */
    public function showByName(
        array $select,
        array $where
    );

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
    );
}
