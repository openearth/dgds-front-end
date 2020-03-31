<template>
  <div class="time-slider">
    <!-- TODO: create slot for svg timeslider element -->
    <div class="time-slider__button-container">
      <div class="time-slider__button">
        <slot v-if="timeIndex !== 0" name="backButton" :back="back" />
      </div>
      <span class="time-slider__text">
        <slot name="label" />
      </span>
      <div class="time-slider__button">
        <slot v-if="timeIndex !== dates.length - 1" name="forwardButton" :forward="forward" />
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      dates: {
        type: Array,
        default: () => [],
      },
      startAt: {
        // Where to start in the dates array, begin end or at random index
        default: () => 'start',
        validator(value) {
          if (Number.isInteger(value)) {
            return true
          } else if (['start', 'end'].includes(value)) {
            return true
          } else {
            return false
          }
        },
      },
    },
    data() {
      return {
        timeIndex: 0,
      }
    },
    computed: {
      currentDateObject() {
        return _.get(this.dates, this.timeIndex)
      },
    },
    watch: {
      dates(newVal, oldVal) {
        // When the dates have changed, change timeIndex
        const newObj = _.get(newVal, this.timeIndex)
        const oldObj = _.get(oldVal, this.timeIndex)
        if (!_.isEqual(oldObj, newObj) || oldObj.length !== newObj.length) {
          this.setInitialTimeIndex()
        }
      },
      timeIndex() {
        this.$emit('update-timestep', this.currentDateObject)
      },
    },
    mounted() {
      this.setInitialTimeIndex()
    },
    methods: {
      setInitialTimeIndex() {
        // Set the timeIndex when timeslider is mounted or dates have changed
        if (this.startAt === 'end' && this.dates.length > 0) {
          this.timeIndex = this.dates.length - 1
        } else if (Number.isInteger(this.startAt)) {
          this.timeIndex = this.startAt
        } else {
          this.timeIndex = 0
        }
      },
      forward() {
        // Go one step forward in time
        this.timeIndex += 1
      },
      back() {
        // Go one step back in time
        this.timeIndex -= 1
      },
    },
  }
</script>

<style>
  .time-slider__button-container {
    display: flex;
  }

  .time-slider__button {
    width: 48px;
  }

  .time-slider__text {
    margin: auto;
    padding: 0 16px 1px 16px;
    width: 300px;
    text-align: center;
  }
</style>
