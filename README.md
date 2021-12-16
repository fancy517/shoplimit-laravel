# Test Project

This test project is a hands-on approach to getting a feel for your problem-solving and critical thinking skills. It is very similar to projects you will work on in the real world.

Much of this project has already been pre-designed and built for you. Follow the setup instructions below and take a brief moment to explore and analyze the existing code, it'll help you with the tasks below.

## Project Setup

1. Clone this project to your local environment.

2. Copy `.env.example` to `.env`

3. Configure `.env` file

4. Run: `composer install`

5. Run: `php artisan migrate`

6. Run: `php artisan db:seed`

## Project Scope

Due to the Covid-19 pandemic, major grocery store chains are only allowing X amount of people inside to shop at a time at their locations. Each grocery store location keeps a real-time ledger of active, completed and pending shoppers.

Shoppers have the ability to check-in while they await in line. For this check-in process, the store is only collecting a first name, last name and email from each shopper. Upon check-in, the shopper enters a queue until it is their turn to shop.

There is a grocery store employee located at the exit. As shoppers leave, they check-out with this employee.

## Tasks

The following tasks are designed to test your problem-solving skills on an existing project. You have full creative freedom on how you want to accomplish the following tasks.

1. Shoppers need a simple seamless way for self "check-in" when arriving at the grocery store and entering the shopping queue line. As mentioned, we only need their first name, last name and email.
    * If < X shoppers are currently actively shopping, the shopper should automatically become active upon check-in.
    * If > X people are currently shopping, they should enter the shopping queue as a "pending" shopper.


2. At the exit, when the logged in grocery store employee runs a check-out, the system should automatically process the shopping queue. This will keep a constant flow of shopper traffic in/out of the store.
    * If < X shoppers are currently actively shopping, the next shopper in queue should become "active".
    * If > X people are currently shopping, the next shopper in queue should become "pending".


3. The system should automatically mark a shopper as "completed" after 2hrs of being active.
    * This is just a simple way to prevent any clogs in the system.
    
4. The logged in employee needs the ability to increase or decrease the amount of allowed shoppers at locations.
    * This is just a simple way to comply with changing COVID-19 regulations.
