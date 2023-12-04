<!-- <template>
  <div>
    <v-btn-toggle v-model="selectedParameter" mandatory>
      <v-btn
        v-for="(parameter, i) in parameters"
        :key="`${parameter}-${i}`"
        :value="parameter"
        @click="selectParameter(parameter)"
        depressed
      >
        {{ parameter }}
      </v-btn>
    </v-btn-toggle>
    <div style="width: 100%; height: 400px; margin: 32px 0px">
      <v-chart class="chart" :option="roseOption" autoresize group="rosePlot" />
    </div>
  </div>
</template> -->
<template>
  <div>
    <v-select
      v-model="selectedtestParameter"
      :items="testParameters"
      label="Parameter"
    ></v-select>
    <v-select
      v-model="selectedDirectionalParameter"
      :items="directionalParameters"
      label="Directional Parameter"
    ></v-select>
    <!-- Start Date Picker -->
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        Start Date
        <v-btn text v-on="on">
          {{ selectedStartDate }}
          <v-icon right>mdi-calendar</v-icon>
        </v-btn>
      </template>
      <v-date-picker v-model="selectedStartDate" scrollable>
        <v-spacer></v-spacer>
        <v-btn text @click="closeStartDatePicker">Cancel</v-btn>
        <v-btn text @click="applyStartDatePicker">Apply</v-btn>
      </v-date-picker>
    </v-menu>

    <!-- End Date Picker -->
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        End Date
        <v-btn text v-on="on">
          {{ selectedEndDate }}
          <v-icon right>mdi-calendar</v-icon>
        </v-btn>
      </template>
      <v-date-picker v-model="selectedEndDate" scrollable>
        <v-spacer></v-spacer>
        <v-btn text @click="closeEndDatePicker">Cancel</v-btn>
        <v-btn text @click="applyEndDatePicker">Apply</v-btn>
      </v-date-picker>
    </v-menu>
    <div class="multiselect-dropdown">
      <div class="dropdown-header">
        <span class="header-text">Months of interest</span>
        <br />
        <button @click="toggleDropdown" class="dropdown-toggle">
          {{
            selectedItems.length > 0 ? selectedItems.join(', ') : 'Select Items'
          }}
        </button>
      </div>
      <div>
        <ul v-show="isOpen" class="dropdown-menu">
          <li v-for="(item, index) in items" :key="index">
            <label class="checkbox-button">
              <input type="checkbox" v-model="selectedItems" :value="item" />
              <span class="checkmark"></span> {{ item }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div style="width: 100%; height: 400px; margin: 32px 0px">
      <v-chart class="chart" :option="roseOption" autoresize group="rosePlot" />
    </div>
  </div>
</template>

<script>
import VChart, { THEME_KEY } from 'vue-echarts'

export default {
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: 'dark'
  },
  data() {
    return {
      parameters: [
        'Horizontal 10-minute averaged wind speed at 10 m height U10 (m/s)',
        'Horizontal 10-minute averaged wind speed at 120 m height U120 (m/s)',
        'Total significant wave height Hs,tot (m)',
        'Total spectral peak wave period Tp,tot (s)',
        'U10',
        'U120'
      ],
      selectedParameter: 'U10',
      testParameters: [
        'Horizontal 10-minute averaged wind speed at 10 m height U10 (m/s)',
        'Horizontal 10-minute averaged wind speed at 120 m height U120 (m/s)',
        'Total significant wave height Hs,tot (m)',
        'Total spectral peak wave period Tp,tot (s)'
      ],
      selectedTestParameter:
        'Horizontal 10-minute averaged wind speed at 10 m height U10 (m/s)',
      directionalParameters: [
        'Mean Wave Direction MWD (°N)',
        'Peak Wave Direction PWD (°N)'
      ], // Dummy parameters for the dropdown
      selectedDirectionalParameter: 'Mean Wave Direction MWD (°N)', // Store the selected directional parameter
      MonthsofInterestParameters: [
        { parameter: 'Jan', selected: true },
        { parameter: 'Feb', selected: true },
        { parameter: 'Mar', selected: true },
        { parameter: 'Apr', selected: true },
        { parameter: 'May', selected: true },
        { parameter: 'Jun', selected: true },
        { parameter: 'Jul', selected: true },
        { parameter: 'Aug', selected: true },
        { parameter: 'Sep', selected: true },
        { parameter: 'Oct', selected: true },
        { parameter: 'Nov', selected: true },
        { parameter: 'Dec', selected: true }
      ],
      isOpen: false,
      selectedItems: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      items: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      selectedStartDate: '2014-01-01',
      selectedEndDate: '2015-12-31',
      classes: [
        '<3.25',
        '3.25 - 6.5',
        '6.5 - 9.75',
        '9.75 - 13',
        '13 - 16.26',
        '16.26 - 19.51',
        '19.51 - 22.76',
        '22.76 - 26.01',
        '26.01 - 29.26',
        '> 29.26'
      ],
      dataset: [
        {
          U10: 0.78,
          U120: 0.5,
          class: '<3.25',
          winddirection: 0
        },
        {
          U10: 2.18,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 0
        },
        {
          U10: 1.67,
          U120: 0.25,
          class: '6.5 - 9.75',
          winddirection: 0
        },
        {
          U10: 0.49,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 0
        },
        {
          U10: 0.11,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 0
        },
        {
          U10: 0.02,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 0
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 0
        },
        {
          U10: 0.74,
          U120: 0,
          class: '<3.25',
          winddirection: 22.5
        },
        {
          U10: 2.28,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 22.5
        },
        {
          U10: 1.6,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 22.5
        },
        {
          U10: 0.38,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 22.5
        },
        {
          U10: 0.05,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 22.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 22.5
        },
        {
          U10: 0.76,
          U120: 0,
          class: '<3.25',
          winddirection: 45
        },
        {
          U10: 2.17,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 45
        },
        {
          U10: 1.53,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 45
        },
        {
          U10: 0.34,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 45
        },
        {
          U10: 0.05,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 45
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 45
        },
        {
          U10: 0.79,
          U120: 0,
          class: '<3.25',
          winddirection: 67.5
        },
        {
          U10: 2.31,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 67.5
        },
        {
          U10: 1.55,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 67.5
        },
        {
          U10: 0.44,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 67.5
        },
        {
          U10: 0.05,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 67.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 67.5
        },
        {
          U10: 0.77,
          U120: 0,
          class: '<3.25',
          winddirection: 90
        },
        {
          U10: 2.34,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 90
        },
        {
          U10: 1.32,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 90
        },
        {
          U10: 0.43,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 90
        },
        {
          U10: 0.04,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 90
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 90
        },
        {
          U10: 0.79,
          U120: 0,
          class: '<3.25',
          winddirection: 112.5
        },
        {
          U10: 2.02,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 112.5
        },
        {
          U10: 1.04,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 112.5
        },
        {
          U10: 0.24,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 112.5
        },
        {
          U10: 0.02,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 112.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 112.5
        },
        {
          U10: 0.72,
          U120: 0,
          class: '<3.25',
          winddirection: 135
        },
        {
          U10: 1.83,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 135
        },
        {
          U10: 0.88,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 135
        },
        {
          U10: 0.19,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 135
        },
        {
          U10: 0.03,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 135
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 135
        },
        {
          U10: 0.71,
          U120: 0,
          class: '<3.25',
          winddirection: 157.5
        },
        {
          U10: 1.85,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 157.5
        },
        {
          U10: 1.24,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 157.5
        },
        {
          U10: 0.36,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 157.5
        },
        {
          U10: 0.07,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 157.5
        },
        {
          U10: 0.01,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 157.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 157.5
        },
        {
          U10: 0.68,
          U120: 0,
          class: '<3.25',
          winddirection: 180
        },
        {
          U10: 1.97,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 180
        },
        {
          U10: 1.87,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 180
        },
        {
          U10: 0.96,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 180
        },
        {
          U10: 0.28,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 180
        },
        {
          U10: 0.05,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 180
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 180
        },
        {
          U10: 0.72,
          U120: 0,
          class: '<3.25',
          winddirection: 202.5
        },
        {
          U10: 2.31,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 202.5
        },
        {
          U10: 2.64,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 202.5
        },
        {
          U10: 1.85,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 202.5
        },
        {
          U10: 0.77,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 202.5
        },
        {
          U10: 0.16,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 202.5
        },
        {
          U10: 0.03,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 202.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 202.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 202.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 202.5
        },
        {
          U10: 0.8,
          U120: 0,
          class: '<3.25',
          winddirection: 225
        },
        {
          U10: 2.87,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 225
        },
        {
          U10: 3.96,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 225
        },
        {
          U10: 2.61,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 225
        },
        {
          U10: 1.09,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 225
        },
        {
          U10: 0.25,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 225
        },
        {
          U10: 0.04,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 225
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 225
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 225
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 225
        },
        {
          U10: 0.85,
          U120: 0,
          class: '<3.25',
          winddirection: 247.5
        },
        {
          U10: 2.87,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 247.5
        },
        {
          U10: 3.61,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 247.5
        },
        {
          U10: 2.22,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 247.5
        },
        {
          U10: 1,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 247.5
        },
        {
          U10: 0.24,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 247.5
        },
        {
          U10: 0.04,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 247.5
        },
        {
          U10: 0.01,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 247.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 247.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 247.5
        },
        {
          U10: 0.8,
          U120: 0,
          class: '<3.25',
          winddirection: 270
        },
        {
          U10: 2.54,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 270
        },
        {
          U10: 2.34,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 270
        },
        {
          U10: 1.42,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 270
        },
        {
          U10: 0.68,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 270
        },
        {
          U10: 0.2,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 270
        },
        {
          U10: 0.05,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 270
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 270
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 270
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 270
        },
        {
          U10: 0.76,
          U120: 0,
          class: '<3.25',
          winddirection: 292.5
        },
        {
          U10: 2.12,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 292.5
        },
        {
          U10: 1.81,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 292.5
        },
        {
          U10: 1.05,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 292.5
        },
        {
          U10: 0.48,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 292.5
        },
        {
          U10: 0.17,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 292.5
        },
        {
          U10: 0.03,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 292.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 292.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 292.5
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 292.5
        },
        {
          U10: 0.78,
          U120: 0,
          class: '<3.25',
          winddirection: 315
        },
        {
          U10: 2,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 315
        },
        {
          U10: 1.63,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 315
        },
        {
          U10: 0.85,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 315
        },
        {
          U10: 0.3,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 315
        },
        {
          U10: 0.01,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 315
        },
        {
          U10: 0,
          U120: 0,
          class: '>29.26',
          winddirection: 315
        },
        {
          U10: 0.79,
          U120: 0,
          class: '<3.25',
          winddirection: 337.5
        },
        {
          U10: 2.21,
          U120: 0,
          class: '3.25 - 6.5',
          winddirection: 337.5
        },
        {
          U10: 1.72,
          U120: 0,
          class: '6.5 - 9.75',
          winddirection: 337.5
        },
        {
          U10: 0.76,
          U120: 0,
          class: '9.75 - 13',
          winddirection: 337.5
        },
        {
          U10: 0.23,
          U120: 0,
          class: '13 - 16.26',
          winddirection: 337.5
        },
        {
          U10: 0.06,
          U120: 0,
          class: '16.26 - 19.51',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '19.51 - 22.76',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '22.76 - 26.01',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '26.01 - 29.26',
          winddirection: 337.5
        },
        {
          U10: 0,
          U120: 0,
          class: '> 29.26',
          winddirection: 337.5
        }
      ],
      roseOption: null
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    createSeriesData() {
      return this.classes.map(c => {
        const seriesData = this.dataset
          .filter(d => d.class === c)
          .map(d => {
            d.value = d[this.selectedParameter]
            return d
          })

        return {
          name: c,
          type: 'bar',
          coordinateSystem: 'polar',
          data: seriesData,
          stack: 'stack1',
          z: 0
        }
      })
    },
    updateData() {
      this.roseOption = {
        tooltip: {
          trigger: 'item',
          formatter: function(e) {
            const { U10, winddirection } = e.data
            return `Winddirection: ${winddirection} <br/>U10: ${U10} <br/>Windspeed (m/s): ${e.data.class}`
          },
          textStyle: {
            color: '#000'
          }
        },
        color: [
          '#F5DA4D',
          '#FCAE12',
          '#F78211',
          '#E75D2F',
          '#CB4149',
          '#A92E5E',
          '#85216B',
          '#60136E',
          '#3A0A63',
          '#140B35'
        ],
        angleAxis: {
          type: 'category',
          data: [
            0,
            22.5,
            45,
            67.5,
            90,
            112.5,
            135,
            157.5,
            180,
            202.5,
            225,
            247.5,
            270,
            292.5,
            315,
            337.5
          ],
          boundaryGap: false,
          axisTick: {
            show: true
          },
          splitLine: {
            show: true
          },
          axisLabel: {
            show: true,
            interval: 1
          }
        },
        radiusAxis: {
          axisLabel: {
            show: true,
            textStyle: {
              color: 'white',
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowBlur: 4
            },
            formatter: function(e) {
              return `${e}%`
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        polar: {
          center: ['60%', '50%'],
          radius: '80%'
        },
        series: this.createSeriesData(),
        legend: {
          orient: 'vertical',
          title: 'Wind speed (m/s)',
          show: true,
          left: true,
          data: this.classes
        },
        backgroundColor: 'transparent'
      }
    },
    selectParameter(value) {
      this.selectedParameter = value
      this.updateData()
    }
  },
  mounted() {
    this.updateData()
  }
}
</script>

<style scoped>
.selected-options {
  margin-top: 10px;
}

.multiselect-dropdown {
  border-bottom: 1px solid #ccc; /* Add a bottom border to the whole component */
}

.dropdown-header {
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid lightgray; /* Add a bottom border to the header */
}

.header-text {
  color: lightgray;
  font-size: 12px;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  text-decoration: underline; /* Underline the button text */
}

.checkbox-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
}
.checkmark {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-button input[type='checkbox'] {
  opacity: 0;
  position: absolute;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-button input[type='checkbox']:checked + .checkmark::before {
  content: '\2713'; /* Checkmark symbol */
  font-size: 16px;
  color: #007bff; /* Color for checked items */
}

ol,
ul {
  list-style: none;
}
</style>
