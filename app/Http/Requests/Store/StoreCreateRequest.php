<?php

namespace App\Http\Requests\Store;

use App\Models\Store\Store;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreCreateRequest
 * @package App\Http\Requests\Store
 */
class StoreCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        if ($this->user()->cannot('create', Store::class)) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
