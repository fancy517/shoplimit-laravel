<?php

namespace Database\Factories\Store\Location;

use App\Models\Store\Location\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Class LocationFactory
 * @package Database\Factories\Store
 */
class LocationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Location::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'location_name' => $this->faker->streetAddress(),
            'shopper_limit' => $this->faker->numberBetween(15, 75)
        ];
    }
}
