<template>
  <v-container>
    <v-row>
      <v-card width="1000" align-content-space-around class="mx-auto my-12">
        <v-dialog v-model='showModal' max-width='300'>
            <v-date-picker v-model='dates' v-on:change='getEvents()' range></v-date-picker>
        </v-dialog>
        <v-card-title>
            <p class='text-decoration-underline'>Schedule for <i> Dr. John</i> [In {{timezone}} Timezone]</p>
        </v-card-title>
        <v-card-text v-on:click='showModal = true' class='white--text mt-8'>
          <v-text-field
            v-model='dateRangeText'
            label='Date range'
            prepend-icon='mdi-calendar'
            readonly
          ></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-timeline align-top dense>
            <v-timeline-item
              v-for='slot in slots'
              :key='slot.time'
              small
            >
              <div>
                <div class='font-weight-normal'>
                  {{ transformTime(slot.slot) }}
                </div>
                <strong>Duration: {{ slot.duration }} </strong>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
import moment from 'moment-timezone'
import APIS from '@/data'
console.log(moment)

export default {
  name: 'Home',
  data: () => ({
    dates: [
      new Date().toISOString().substr(0, 10),
      new Date().toISOString().substr(0, 10)
    ],
    showModal: false,
    slots: [],
    timezone: ''
  }),
  methods: {
    transformDates: function (date) {
      return moment.tz(date, this.timezone).format('YYYY/MM/DD')
    },
    transformTime: function (date) {
      return moment.tz(date, this.timezone).format('YYYY/MM/DD hh:mm A')
    },
    getEvents: async function () {
      if (this.dates.length !== 2) return []

      var data = await APIS.events(...this.dates)
      console.log('data', data)
      if (data) {
        this.slots = data.data.events
        this.timezone = data.data.timezone
      } else {
        this.slots = []
      }
    }
  },
  computed: {
    dateRangeText () {
      var rangeDates = [
        this.transformDates(this.dates[0]),
        this.transformDates(this.dates[0])
      ]
      return rangeDates.join(' ~ ')
    }
  },
  mounted: function () {
    this.getEvents()
  }
}
</script>
