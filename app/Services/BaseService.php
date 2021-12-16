<?php

namespace App\Services;

/**
 * Class BaseService
 * @package App\Services
 */
class BaseService implements Service
{
    /**
     * @var
     */
    protected $repository;

    /**
     * BaseService constructor.
     * @param $repository
     */
    public function __construct($repository = null)
    {
        $this->repository = $repository;
    }

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
    )
    {
        return $this->repository->all($select, $where, $whereNot, $with, $orderBy, $groupBy, $limit);
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function create(
        array $data
    )
    {
        return $this->repository->create($data);
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
        return $this->repository->update($id, $data);
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
        return $this->repository->increment($id, $column);
    }

    /**
     * @param int $id
     */
    public function delete(
        int $id
    ): void
    {
        $this->repository->softDelete($id);
    }

    /**
     * @param int $id
     */
    public function softDelete(
        int $id
    ): void
    {
        $this->repository->softDelete($id);
    }

    /**
     * @param int $id
     */
    public function hardDelete(
        int $id
    ): void
    {
        $this->repository->hardDelete($id);
    }

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
    )
    {
        return $this->repository->show($where, $with, $orderBy);
    }

    /**
     * @param array|null $select
     * @param array|null $where
     * @return mixed
     */
    public function showByName(
        array $select = null,
        array $where = null
    )
    {
        return $this->repository->showByName($select, $where);
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
        return $this->repository->count($where, $with, $orderBy);
    }
}
