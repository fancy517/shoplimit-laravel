<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Store Listing') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">

                    <a href="{{ route('store.create') }}" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition">
                        Create Store
                    </a>

                    <table class="w-full whitespace-no-wrapw-full whitespace-no-wrap mt-6">
                        <tbody>
                        @if( is_iterable($stores) )
                            @foreach($stores as $store)
                                <tr class="text-center">

                                    <x-table-column>
                                        {{ $store['store_name'] ?? null }}
                                    </x-table-column>

                                    <x-table-column>
                                        @if( isset($store['uuid']) )
                                        <a href="{{ route('store.store', ['store' => $store['uuid']]) }}" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition">
                                            View Locations
                                        </a>
                                        @endif
                                    </x-table-column>

                                </tr>
                            @endforeach
                        @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</x-app-layout>
