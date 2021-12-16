<?php

namespace App\Http\Requests\Store;

use App\Models\Store\Store;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreStoreRequest
 * @package App\Http\Requests\Store
 */
class StoreStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
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
    public function rules()
    {
        return [
            'store_name' => 'required|string|max:150'
        ];
    }
}
