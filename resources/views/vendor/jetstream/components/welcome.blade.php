<div class="p-6 sm:px-20 bg-white border-b border-gray-200">

    <div class="mt-8 text-2xl">
        Welcome to your Test Project!
    </div>

    <div class="mt-6 text-gray-500">
        <p>
            This test project is a hands-on approach to getting a feel for your problem-solving and critical thinking skills. It is very similar to projects you will work on in the real world. Much of this project has already been pre-designed and built for you.
        </p>
    </div>

</div>

<div class="bg-gray-200 bg-opacity-25 grid grid-cols-1 md:grid-cols-1">
    <div class="p-6">
        <div class="flex items-center">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-8 h-8 text-gray-400"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <div class="ml-4 text-lg text-gray-600 leading-7 font-semibold">
                Project Background
            </div>
        </div>

        <div class="ml-12">
            <div class="mt-2 text-sm text-gray-500">
                <p>
                    Due to the Covid-19 pandemic, major grocery store chains are only allowing X amount of people inside to shop at a time at their locations. Each grocery store location keeps a real-time ledger of active, completed and pending shoppers.
                </p>
            </div>

            <div class="mt-2 text-sm text-gray-500">
                <p>
                    Shoppers have the ability to check-in while they await in line. For this check-in process, the store is only collecting a first name, last name and email from each shopper. Upon check-in, the shopper enters a queue until it is their turn to shop.
                </p>
            </div>

            <div class="mt-2 text-sm text-gray-500">
                <p>
                    There is a grocery store employee located at the exit. As shoppers leave, they check-out with this employee.
                </p>
            </div>

            <div class="mt-2 text-sm text-gray-500">
                <p>
                    The following tasks are designed to test your problem-solving skills on an existing project. You have full creative freedom on how you want to accomplish the following tasks.
                </p>
            </div>

            <div class="mt-3 flex items-center text-sm font-semibold text-indigo-700">
                <div>Explore your tasks below</div>

                <div class="ml-1 text-indigo-500">
                    <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="bg-gray-200 bg-opacity-25 grid grid-cols-1 md:grid-cols-2">
    <div class="p-6 border-t border-gray-200">
        <div class="flex items-center">
            <div class="ml-4 text-lg text-gray-600 leading-7 font-semibold">
                1. Shopper Check-In Process
            </div>
        </div>

        <div class="ml-12">

            <div class="mt-2 text-sm text-gray-500">
                Shoppers need a simple seamless way for self "check-in" when arriving at the grocery store and entering the shopping queue line. As mentioned, we only need their first name, last name and email.
            </div>

            <div class="mt-2 text-sm text-gray-500">
                <ul class="list-disc">
                    <li>
                        If < X shoppers are currently actively shopping, the shopper should automatically become active upon check-in.
                    </li>
                    <li>
                        If > X people are currently shopping, they should enter the shopping queue as a "pending" shopper.
                    </li>
                </ul>
            </div>

        </div>
    </div>

    <div class="p-6 border-t border-gray-200 md:border-l">
        <div class="flex items-center">
            <div class="ml-4 text-lg text-gray-600 leading-7 font-semibold">
                2. Shopper Check-Out Process
            </div>
        </div>

        <div class="ml-12">

            <div class="mt-2 text-sm text-gray-500">
                At the exit, when the logged in grocery store employee runs a check-out, the system should automatically process the shopping queue. This will keep a constant flow of shopper traffic in/out of the store.
            </div>

            <div class="mt-2 text-sm text-gray-500">
                <ul class="list-disc">
                    <li>
                        If < X shoppers are currently actively shopping, the next shopper in queue should become "active".
                    </li>
                    <li>
                        If > X people are currently shopping, the next shopper in queue should become "pending".
                    </li>
                </ul>
            </div>

        </div>
    </div>

    <div class="p-6 border-t border-gray-200">
        <div class="flex items-center">
            <div class="ml-4 text-lg text-gray-600 leading-7 font-semibold">
                3. Auto-Checkout
            </div>
        </div>

        <div class="ml-12">

            <div class="mt-2 text-sm text-gray-500">
                The system should automatically mark a shopper as "completed" after 2hrs of being active.
            </div>

            <div class="mt-2 text-sm text-gray-500">
                <ul class="list-disc">
                    <li>
                        This is just a simple way to prevent any clogs in the system.
                    </li>
                </ul>
            </div>

        </div>

    </div>

    <div class="p-6 border-t border-gray-200 md:border-l">
        <div class="flex items-center">
            <div class="ml-4 text-lg text-gray-600 leading-7 font-semibold">
                4. Increase/Decrease Shopper Limit
            </div>
        </div>

        <div class="ml-12">

            <div class="mt-2 text-sm text-gray-500">
                The logged in employee needs the ability to increase or decrease the amount of allowed shoppers at locations.
            </div>



            <div class="mt-2 text-sm text-gray-500">
                <ul class="list-disc">
                    <li>
                        This is just a simple way to comply with changing COVID-19 regulations.
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
