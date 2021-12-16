<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            @if( isset($store['store_name']))
                {{ __( $store['store_name'] . ' Locations') }}
            @endif
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">

                    <a href="{{ route('store.location.create', ['storeUuid' => $store->uuid]) }}" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition">
                        Create Location
                    </a>

                    <table class="w-full whitespace-no-wrapw-full whitespace-no-wrap mt-6">
                        <thead>
                            <tr>
                                <th>
                                    Location
                                </th>
                                <th>
                                    QR Code
                                </th>
                                <th>
                                    Shopper Limit
                                </th>
                                <th>
                                    View Queue
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        @if( is_iterable($store['locations']) )
                            @if( count($store['locations']) >= 1 )
                                @foreach($store['locations'] as $location)
                                    <tr class="text-center">

                                        <x-table-column>
                                            {{ $location['location_name'] ?? null }}
                                        </x-table-column>

                                        <x-table-column>
                                            <a href="{{ route('public.qrCode', ['uuid' => $location['uuid']]) }}" target="_blank"
                                               class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition"
                                            >View QR Code</a>
                                        </x-table-column>

                                        <x-table-column>
                                            {{ $location['shopper_limit'] ?? null }}
                                        </x-table-column>

                                        <x-table-column>
                                            @if( isset($store['uuid']) )
                                                <a href="{{ route('store.location.queue', ['storeUuid' => $store->uuid, 'locationUuid' => $location['uuid']]) }}"
                                                   class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition">
                                                    Queue
                                                </a>
                                            @endif
                                        </x-table-column>

                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="4">
                                        No Locations Found
                                    </td>
                                </tr>
                            @endif
                        @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</x-app-layout>
