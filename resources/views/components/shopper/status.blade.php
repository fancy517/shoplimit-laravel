@if( isset($shopper['status']['name']) )
    @switch( $shopper['status']['name'] )
        @case('Active')
        <div class="inline-flex items-center px-4 py-2 bg-green-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase transition">
            Active
        </div>
        @break

        @case('Pending')
        <div class="inline-flex items-center px-4 py-2 bg-blue-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase transition">
            Pending
        </div>
        @break

        @default
        <div class="inline-flex items-center px-4 py-2 bg-yellow-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase transition">
            Completed
        </div>
    @endswitch
@endif
