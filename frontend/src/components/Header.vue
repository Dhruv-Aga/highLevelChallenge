<template>
  <v-app-bar
      app
      absolute
      color="#6A76AB"
      dark>
    <div class="d-flex align-center">
      <v-img
        alt="High Level"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        src="./../assets/logo.png"
        height="70"
      />
    </div>
    <v-toolbar-title>High Level Booking App</v-toolbar-title>
    <v-spacer></v-spacer>
      <v-btn class="mr-8" to="/SlotBooking">
        <v-icon class="mr-2">mdi-ticket-account</v-icon> SlotBooking
      </v-btn>
      <v-btn  to="/CheckBooking">
        <v-icon class="mr-2"> mdi-content-paste</v-icon> CheckBooking
      </v-btn>
  </v-app-bar>
</template>
<script>

export default {
  name: 'Header',
  computed: {
  }
}
</script>
