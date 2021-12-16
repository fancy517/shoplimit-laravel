<?php

namespace Database\Factories\Store;

use App\Models\Store\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Class StoreFactory
 * @package Database\Factories\Store
 */
class StoreFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Store::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'store_name' => $this->faker->company()
        ];
    }
}
