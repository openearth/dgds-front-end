<template>
  <div class="time-slider">
    <div class="time-slider__button">
      <slot v-if="timeIndex !== 0" :back="back" name="backButton" />
    </div>
    <div class="time-slider__text">
      <slot name="label" />
    </div>
    <div class="time-slider__button">
      <slot v-if="timeIndex !== dates.length - 1" :forward="forward" name="forwardButton" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    dates: {
      type: Array,
      default: () => []
    },
    startAt: {
      // Where to start in the dates array, begin end or at random index
      default: () => 'start',
      validator (value) {
        if (Number.isInteger(value)) {
          return true
        } else if (['start', 'end'].includes(value)) {
          return true
        } else {
          return false
        }
      }
    },
    setTimeIndex: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      timeIndex: 0
    }
  },
  computed: {
    currentDateObject () {
      return _.get(this.dates, this.timeIndex)
    }
  },
  watch: {
    dates (newVal, oldVal) {
      // When the dates have changed, change timeIndex
      const newObj = _.get(newVal, this.timeIndex)
      const oldObj = _.get(oldVal, this.timeIndex)
      if (!_.isEqual(oldObj, newObj)) {
        this.setInitialTimeIndex()
      } else {
        this.timeIndex = this.setTimeIndex
      }
    },
    setTimeIndex (val) {
      this.timeIndex = val
    }
  },
  mounted () {
    this.setInitialTimeIndex()
  },
  methods: {
    setInitialTimeIndex () {
      // Set the timeIndex when timeslider is mounted or dates have changed
      if (!this.dates) {
        return
      }
      if (this.startAt === 'end' && this.dates.length > 0) {
        this.timeIndex = this.dates.length - 1
      } else if (Number.isInteger(this.startAt)) {
        this.timeIndex = this.startAt
      } else {
        this.timeIndex = 0
      }
    },
    forward () {
      // Go one step forward in time
      this.timeIndex += 1
      this.$emit('update-timestep', this.currentDateObject)
    },
    back () {
      // Go one step back in time
      this.timeIndex -= 1
      this.$emit('update-timestep', this.currentDateObject)
    }
  }
}
</script>

<style>
  .time-slider {
    display: flex;
    align-items: center;
  }

  .time-slider .ui-select {
    min-width: 155px;
  }

  .time-slider .ui-select__label {
    display: none;
  }

  .time-slider__button .icon {
    color: var(--v-textColor-base);
  }

  .time-slider__text {
    flex: 1 1 auto;
    margin: 0 var(--spacing-small);
  }
</style>
