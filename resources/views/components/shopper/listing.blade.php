<x-table-column>
    <x-shopper.status :shopper="$shopper"/>
</x-table-column>

<x-table-column>
    {{ $shopper['first_name'] }} {{ $shopper['last_name'] }}
</x-table-column>

<x-table-column>
    {{ $shopper['email'] }}
</x-table-column>

<x-table-column>
    {{ $shopper['check_in'] }}
</x-table-column>

<x-table-column>
    @if( isset($shopper['status']['name']) )
        @switch( $shopper['status']['name'] )
            @case('Active')
            <form method="post" action="{{route('store.location.checkout', ['storeUuid'=>$storeUuid, 'locationUuid'=>$locationUuid])}}">
                @csrf
                <input type="hidden" name="shopper_id" value="{{$shopper['id']}}" />
                <button class="inline-flex items-center px-4 py-2 bg-green-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase transition" type="submit">
                    check out
                </button>
            </form>
            @break

            @case('Pending')
            @break

            @default
            {{ $shopper['check_out'] }}
        @endswitch
    @endif
</x-table-column>

{{--<x-table-column>--}}

{{--</x-table-column>--}}
