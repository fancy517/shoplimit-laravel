<?php

namespace App\Services\User;

use App\Repositories\User\UserRepository;
use App\Services\BaseService;

/**
 * Class UserService
 * @package App\Services\User
 */
class UserService extends BaseService
{
    /**
     * @var UserRepository
     */
    protected $user;

    /**
     * UserService constructor.
     * @param UserRepository $user
     */
    public function __construct(UserRepository $user)
    {
        $this->user = $user;
        parent::__construct($this->user);
    }
}
