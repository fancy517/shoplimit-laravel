<?php

namespace Database\Factories\Shopper;

use App\Models\Shopper\Shopper;
use Carbon\Carbon;
use App\Models\Shopper\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Class ShopperFactory
 * @package Database\Factories\Shopper
 */
class ShopperFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Shopper::class;

    /**
     * Define the model's default state.
     *
     * @return array
     * @throws \Exception
     */
    public function definition(): array
    {
        return [
            'location_id' => null,
            'status_id' => $this->shopperStatus(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->email(),
            'check_in' => $this->faker->dateTimeBetween('-7 hours', '-1 hour'),
            'check_out' => null,
            'user_id' => null
        ];
    }

    /**
     * @return mixed
     */
    private function shopperStatus()
    {
        return Status::all()->random()->id;
    }

    /**
     * @return ShopperFactory
     */
    public function active(): ShopperFactory
    {
        return $this->state(function (array $attributes) {
            return [
                'check_in' => $this->faker->dateTimeBetween('-2 hours', '-1 minute'),
            ];
        });
    }

    /**
     * @return ShopperFactory
     */
    public function completed(): ShopperFactory
    {
        return $this->state(function (array $attributes) {

            $checkIn = $this->faker->dateTimeBetween('-7 hours', '-1 hour')->format('Y-m-d H:i:s');
            $checkOut = Carbon::parse($checkIn)->addMinutes( random_int(1,59) )->toDateTimeString();

            return [
                'check_in' => $checkIn,
                'check_out' => $checkOut
            ];
        });
    }

    /**
     * @return ShopperFactory
     */
    public function pending(): ShopperFactory
    {
        return $this->state(function (array $attributes) {
            return [
                'check_in' => $this->faker->dateTimeBetween('-2 hours', '-1 minute'),
            ];
        });
    }
}
