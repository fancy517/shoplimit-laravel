<template>
  <v-layout>
    <v-flex>
      <v-sheet height="70vh">
        <v-calendar
          color="primary"
          type="day"
          hide-header
        >
          <template v-slot:interval="{ hour }">
            <div class="text-xs-center">
              {{ hour }} o'clock
            </div>
          </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>
