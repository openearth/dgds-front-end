<template>
  <div>
    <v-select
      v-model="selectedDirectionalParameter"
      :items="directionalParameters"
      label="Parameter"
    ></v-select>
    <div style="width: 100%; height: 400px; margin: 8px 0px">
      <v-chart :option="lineOption" autoresize group="extremeValues" />
    </div>
  </div>
</template>

<script>
import VChart, { THEME_KEY } from 'vue-echarts'

export default {
  components: {
    VChart
  },
  provide() {
    return {
      [THEME_KEY]: 'dark'
    }
  },
  data() {
    return {
      directionalParameters: [
        'Extreme mean wind speed U10 (m/s)',
        'Extreme seastates SS (-)'
      ], // Dummy parameters for the dropdown
      selectedDirectionalParameter: 'Extreme mean wind speed U10 (m/s)', // Store the selected directional parameter
      lineOption: this.initLineOption()
    }
  },
  methods: {
    initLineOption() {
      return {
        title: {
          text: 'OMNI for U10, mag (m/s)',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(e) {
            let tooltip = ''
            e.forEach(serie => {
              tooltip += `<b style="font-weight:bold;">${serie.seriesName}:</b><br/>`
              serie.data.forEach((d, i) => {
                if (i === 0) {
                  tooltip += `ReturnPeriod: ${d}<br/>`
                } else {
                  tooltip += `Value: ${d}<br/>`
                }
              })
            })
            return tooltip
          }
        },
        xAxis: {
          name: 'Return period',
          nameLocation: 'center',
          nameGap: 30,
          type: 'log'
        },
        yAxis: {
          name: 'Value',
          nameLocation: 'center',
          nameGap: 30,
          scale: true,
          type: 'value'
        },
        series: this.createSeriesData(),
        legend: {
          orient: 'vertical',
          show: true,
          right: true
        },
        graphic: this.createGraphic(),
        backgroundColor: 'transparent'
      }
    },
    createSeriesData() {
      const data = {
        lines: [
          {
            returnPeriod: 0.3,
            bestEstimate: 20.025,
            lowerBound: 19.855,
            upperBound: 20.225
          },
          {
            returnPeriod: 0.5,
            bestEstimate: 20.912,
            lowerBound: 20.642,
            upperBound: 21.19
          },
          {
            returnPeriod: 1.1,
            bestEstimate: 22.278,
            lowerBound: 21.896,
            upperBound: 22.673
          },
          {
            returnPeriod: 2,
            bestEstimate: 23.311,
            lowerBound: 22.765,
            upperBound: 23.824
          },
          {
            returnPeriod: 3,
            bestEstimate: 24.01,
            lowerBound: 23.32,
            upperBound: 24.662
          },
          {
            returnPeriod: 4,
            bestEstimate: 24.505,
            lowerBound: 23.695,
            upperBound: 25.286
          },
          {
            returnPeriod: 5,
            bestEstimate: 24.888,
            lowerBound: 23.974,
            upperBound: 25.769
          },
          {
            returnPeriod: 6,
            bestEstimate: 25.202,
            lowerBound: 24.21,
            upperBound: 26.199
          },
          {
            returnPeriod: 7,
            bestEstimate: 25.466,
            lowerBound: 24.405,
            upperBound: 26.565
          },
          {
            returnPeriod: 8,
            bestEstimate: 25.695,
            lowerBound: 24.565,
            upperBound: 26.884
          },
          {
            returnPeriod: 9,
            bestEstimate: 25.897,
            lowerBound: 24.686,
            upperBound: 27.157
          },
          {
            returnPeriod: 10,
            bestEstimate: 26.078,
            lowerBound: 24.797,
            upperBound: 27.408
          },
          {
            returnPeriod: 20,
            bestEstimate: 27.263,
            lowerBound: 25.564,
            upperBound: 29.227
          },
          {
            returnPeriod: 30,
            bestEstimate: 27.955,
            lowerBound: 25.963,
            upperBound: 30.335
          },
          {
            returnPeriod: 40,
            bestEstimate: 28.445,
            lowerBound: 26.258,
            upperBound: 31.182
          },
          {
            returnPeriod: 50,
            bestEstimate: 28.825,
            lowerBound: 26.481,
            upperBound: 31.845
          },
          {
            returnPeriod: 60,
            bestEstimate: 29.135,
            lowerBound: 26.656,
            upperBound: 32.382
          },
          {
            returnPeriod: 70,
            bestEstimate: 29.397,
            lowerBound: 26.795,
            upperBound: 32.859
          },
          {
            returnPeriod: 80,
            bestEstimate: 29.623,
            lowerBound: 26.913,
            upperBound: 33.305
          },
          {
            returnPeriod: 90,
            bestEstimate: 29.823,
            lowerBound: 27.009,
            upperBound: 33.706
          },
          {
            returnPeriod: 100,
            bestEstimate: 30.002,
            lowerBound: 27.093,
            upperBound: 34.056
          },
          {
            returnPeriod: 200,
            bestEstimate: 31.176,
            lowerBound: 27.617,
            upperBound: 36.37
          },
          {
            returnPeriod: 300,
            bestEstimate: 31.861,
            lowerBound: 27.898,
            upperBound: 37.721
          },
          {
            returnPeriod: 400,
            bestEstimate: 32.346,
            lowerBound: 28.112,
            upperBound: 38.778
          },
          {
            returnPeriod: 500,
            bestEstimate: 32.722,
            lowerBound: 28.264,
            upperBound: 39.647
          },
          {
            returnPeriod: 600,
            bestEstimate: 33.029,
            lowerBound: 28.378,
            upperBound: 40.375
          },
          {
            returnPeriod: 700,
            bestEstimate: 33.288,
            lowerBound: 28.466,
            upperBound: 41.002
          },
          {
            returnPeriod: 800,
            bestEstimate: 33.513,
            lowerBound: 28.54,
            upperBound: 41.538
          },
          {
            returnPeriod: 900,
            bestEstimate: 33.71,
            lowerBound: 28.604,
            upperBound: 42.003
          },
          {
            returnPeriod: 1000,
            bestEstimate: 33.887,
            lowerBound: 28.667,
            upperBound: 42.423
          },
          {
            returnPeriod: 4000,
            bestEstimate: 36.208,
            lowerBound: 29.482,
            upperBound: 48.403
          },
          {
            returnPeriod: 10000,
            bestEstimate: 37.734,
            lowerBound: 29.915,
            upperBound: 52.693
          }
        ],
        shapes: [
          {
            returnPeriod: 0.131,
            U10mag: 18.571
          },
          {
            returnPeriod: 0.131,
            U10mag: 18.571
          },
          {
            returnPeriod: 0.131,
            U10mag: 18.572
          },
          {
            returnPeriod: 0.132,
            U10mag: 18.583
          },
          {
            returnPeriod: 0.132,
            U10mag: 18.585
          },
          {
            returnPeriod: 0.133,
            U10mag: 18.594
          },
          {
            returnPeriod: 0.133,
            U10mag: 18.598
          },
          {
            returnPeriod: 0.133,
            U10mag: 18.599
          },
          {
            returnPeriod: 0.134,
            U10mag: 18.603
          },
          {
            returnPeriod: 0.134,
            U10mag: 18.604
          },
          {
            returnPeriod: 0.135,
            U10mag: 18.61
          },
          {
            returnPeriod: 0.135,
            U10mag: 18.612
          },
          {
            returnPeriod: 0.135,
            U10mag: 18.614
          },
          {
            returnPeriod: 0.136,
            U10mag: 18.614
          },
          {
            returnPeriod: 0.136,
            U10mag: 18.623
          },
          {
            returnPeriod: 0.137,
            U10mag: 18.625
          },
          {
            returnPeriod: 0.137,
            U10mag: 18.627
          },
          {
            returnPeriod: 0.137,
            U10mag: 18.631
          },
          {
            returnPeriod: 0.138,
            U10mag: 18.632
          },
          {
            returnPeriod: 0.138,
            U10mag: 18.633
          },
          {
            returnPeriod: 0.139,
            U10mag: 18.634
          },
          {
            returnPeriod: 0.139,
            U10mag: 18.643
          },
          {
            returnPeriod: 0.14,
            U10mag: 18.644
          },
          {
            returnPeriod: 0.14,
            U10mag: 18.648
          },
          {
            returnPeriod: 0.141,
            U10mag: 18.649
          },
          {
            returnPeriod: 0.141,
            U10mag: 18.652
          },
          {
            returnPeriod: 0.141,
            U10mag: 18.654
          },
          {
            returnPeriod: 0.142,
            U10mag: 18.657
          },
          {
            returnPeriod: 0.142,
            U10mag: 18.663
          },
          {
            returnPeriod: 0.143,
            U10mag: 18.671
          },
          {
            returnPeriod: 0.143,
            U10mag: 18.681
          },
          {
            returnPeriod: 0.144,
            U10mag: 18.685
          },
          {
            returnPeriod: 0.144,
            U10mag: 18.697
          },
          {
            returnPeriod: 0.145,
            U10mag: 18.701
          },
          {
            returnPeriod: 0.145,
            U10mag: 18.702
          },
          {
            returnPeriod: 0.146,
            U10mag: 18.705
          },
          {
            returnPeriod: 0.146,
            U10mag: 18.706
          },
          {
            returnPeriod: 0.147,
            U10mag: 18.709
          },
          {
            returnPeriod: 0.147,
            U10mag: 18.709
          },
          {
            returnPeriod: 0.148,
            U10mag: 18.724
          },
          {
            returnPeriod: 0.148,
            U10mag: 18.724
          },
          {
            returnPeriod: 0.149,
            U10mag: 18.727
          },
          {
            returnPeriod: 0.149,
            U10mag: 18.744
          },
          {
            returnPeriod: 0.15,
            U10mag: 18.744
          },
          {
            returnPeriod: 0.15,
            U10mag: 18.791
          },
          {
            returnPeriod: 0.151,
            U10mag: 18.795
          },
          {
            returnPeriod: 0.151,
            U10mag: 18.816
          },
          {
            returnPeriod: 0.152,
            U10mag: 18.818
          },
          {
            returnPeriod: 0.152,
            U10mag: 18.828
          },
          {
            returnPeriod: 0.153,
            U10mag: 18.845
          },
          {
            returnPeriod: 0.153,
            U10mag: 18.852
          },
          {
            returnPeriod: 0.154,
            U10mag: 18.861
          },
          {
            returnPeriod: 0.154,
            U10mag: 18.868
          },
          {
            returnPeriod: 0.155,
            U10mag: 18.87
          },
          {
            returnPeriod: 0.155,
            U10mag: 18.876
          },
          {
            returnPeriod: 0.156,
            U10mag: 18.879
          },
          {
            returnPeriod: 0.156,
            U10mag: 18.891
          },
          {
            returnPeriod: 0.157,
            U10mag: 18.896
          },
          {
            returnPeriod: 0.158,
            U10mag: 18.901
          },
          {
            returnPeriod: 0.158,
            U10mag: 18.912
          },
          {
            returnPeriod: 0.159,
            U10mag: 18.919
          },
          {
            returnPeriod: 0.159,
            U10mag: 18.929
          },
          {
            returnPeriod: 0.16,
            U10mag: 18.938
          },
          {
            returnPeriod: 0.16,
            U10mag: 18.941
          },
          {
            returnPeriod: 0.161,
            U10mag: 18.948
          },
          {
            returnPeriod: 0.162,
            U10mag: 18.949
          },
          {
            returnPeriod: 0.162,
            U10mag: 18.957
          },
          {
            returnPeriod: 0.163,
            U10mag: 18.983
          },
          {
            returnPeriod: 0.163,
            U10mag: 18.988
          },
          {
            returnPeriod: 0.164,
            U10mag: 18.991
          },
          {
            returnPeriod: 0.165,
            U10mag: 18.995
          },
          {
            returnPeriod: 0.165,
            U10mag: 18.997
          },
          {
            returnPeriod: 0.166,
            U10mag: 18.997
          },
          {
            returnPeriod: 0.167,
            U10mag: 19.008
          },
          {
            returnPeriod: 0.167,
            U10mag: 19.026
          },
          {
            returnPeriod: 0.168,
            U10mag: 19.038
          },
          {
            returnPeriod: 0.168,
            U10mag: 19.046
          },
          {
            returnPeriod: 0.169,
            U10mag: 19.047
          },
          {
            returnPeriod: 0.17,
            U10mag: 19.058
          },
          {
            returnPeriod: 0.17,
            U10mag: 19.067
          },
          {
            returnPeriod: 0.171,
            U10mag: 19.072
          },
          {
            returnPeriod: 0.172,
            U10mag: 19.079
          },
          {
            returnPeriod: 0.172,
            U10mag: 19.109
          },
          {
            returnPeriod: 0.173,
            U10mag: 19.111
          },
          {
            returnPeriod: 0.174,
            U10mag: 19.128
          },
          {
            returnPeriod: 0.174,
            U10mag: 19.13
          },
          {
            returnPeriod: 0.175,
            U10mag: 19.151
          },
          {
            returnPeriod: 0.176,
            U10mag: 19.166
          },
          {
            returnPeriod: 0.177,
            U10mag: 19.17
          },
          {
            returnPeriod: 0.177,
            U10mag: 19.174
          },
          {
            returnPeriod: 0.178,
            U10mag: 19.178
          },
          {
            returnPeriod: 0.179,
            U10mag: 19.182
          },
          {
            returnPeriod: 0.179,
            U10mag: 19.19
          },
          {
            returnPeriod: 0.18,
            U10mag: 19.196
          },
          {
            returnPeriod: 0.181,
            U10mag: 19.197
          },
          {
            returnPeriod: 0.182,
            U10mag: 19.199
          },
          {
            returnPeriod: 0.182,
            U10mag: 19.203
          },
          {
            returnPeriod: 0.183,
            U10mag: 19.214
          },
          {
            returnPeriod: 0.184,
            U10mag: 19.224
          },
          {
            returnPeriod: 0.185,
            U10mag: 19.225
          },
          {
            returnPeriod: 0.185,
            U10mag: 19.234
          },
          {
            returnPeriod: 0.186,
            U10mag: 19.235
          },
          {
            returnPeriod: 0.187,
            U10mag: 19.236
          },
          {
            returnPeriod: 0.188,
            U10mag: 19.239
          },
          {
            returnPeriod: 0.189,
            U10mag: 19.244
          },
          {
            returnPeriod: 0.189,
            U10mag: 19.248
          },
          {
            returnPeriod: 0.19,
            U10mag: 19.252
          },
          {
            returnPeriod: 0.191,
            U10mag: 19.262
          },
          {
            returnPeriod: 0.192,
            U10mag: 19.264
          },
          {
            returnPeriod: 0.193,
            U10mag: 19.264
          },
          {
            returnPeriod: 0.194,
            U10mag: 19.264
          },
          {
            returnPeriod: 0.194,
            U10mag: 19.266
          },
          {
            returnPeriod: 0.195,
            U10mag: 19.274
          },
          {
            returnPeriod: 0.196,
            U10mag: 19.274
          },
          {
            returnPeriod: 0.197,
            U10mag: 19.28
          },
          {
            returnPeriod: 0.198,
            U10mag: 19.297
          },
          {
            returnPeriod: 0.199,
            U10mag: 19.305
          },
          {
            returnPeriod: 0.2,
            U10mag: 19.313
          },
          {
            returnPeriod: 0.201,
            U10mag: 19.318
          },
          {
            returnPeriod: 0.202,
            U10mag: 19.319
          },
          {
            returnPeriod: 0.202,
            U10mag: 19.319
          },
          {
            returnPeriod: 0.203,
            U10mag: 19.325
          },
          {
            returnPeriod: 0.204,
            U10mag: 19.325
          },
          {
            returnPeriod: 0.205,
            U10mag: 19.333
          },
          {
            returnPeriod: 0.206,
            U10mag: 19.345
          },
          {
            returnPeriod: 0.207,
            U10mag: 19.349
          },
          {
            returnPeriod: 0.208,
            U10mag: 19.35
          },
          {
            returnPeriod: 0.209,
            U10mag: 19.352
          },
          {
            returnPeriod: 0.21,
            U10mag: 19.355
          },
          {
            returnPeriod: 0.211,
            U10mag: 19.357
          },
          {
            returnPeriod: 0.212,
            U10mag: 19.367
          },
          {
            returnPeriod: 0.213,
            U10mag: 19.372
          },
          {
            returnPeriod: 0.214,
            U10mag: 19.377
          },
          {
            returnPeriod: 0.215,
            U10mag: 19.38
          },
          {
            returnPeriod: 0.216,
            U10mag: 19.382
          },
          {
            returnPeriod: 0.217,
            U10mag: 19.397
          },
          {
            returnPeriod: 0.218,
            U10mag: 19.419
          },
          {
            returnPeriod: 0.22,
            U10mag: 19.42
          },
          {
            returnPeriod: 0.221,
            U10mag: 19.421
          },
          {
            returnPeriod: 0.222,
            U10mag: 19.427
          },
          {
            returnPeriod: 0.223,
            U10mag: 19.441
          },
          {
            returnPeriod: 0.224,
            U10mag: 19.445
          },
          {
            returnPeriod: 0.225,
            U10mag: 19.464
          },
          {
            returnPeriod: 0.226,
            U10mag: 19.465
          },
          {
            returnPeriod: 0.227,
            U10mag: 19.474
          },
          {
            returnPeriod: 0.229,
            U10mag: 19.486
          },
          {
            returnPeriod: 0.23,
            U10mag: 19.487
          },
          {
            returnPeriod: 0.231,
            U10mag: 19.505
          },
          {
            returnPeriod: 0.232,
            U10mag: 19.527
          },
          {
            returnPeriod: 0.233,
            U10mag: 19.531
          },
          {
            returnPeriod: 0.235,
            U10mag: 19.544
          },
          {
            returnPeriod: 0.236,
            U10mag: 19.556
          },
          {
            returnPeriod: 0.237,
            U10mag: 19.564
          },
          {
            returnPeriod: 0.239,
            U10mag: 19.595
          },
          {
            returnPeriod: 0.24,
            U10mag: 19.609
          },
          {
            returnPeriod: 0.241,
            U10mag: 19.613
          },
          {
            returnPeriod: 0.242,
            U10mag: 19.625
          },
          {
            returnPeriod: 0.244,
            U10mag: 19.636
          },
          {
            returnPeriod: 0.245,
            U10mag: 19.662
          },
          {
            returnPeriod: 0.247,
            U10mag: 19.72
          },
          {
            returnPeriod: 0.248,
            U10mag: 19.723
          },
          {
            returnPeriod: 0.249,
            U10mag: 19.726
          },
          {
            returnPeriod: 0.251,
            U10mag: 19.748
          },
          {
            returnPeriod: 0.252,
            U10mag: 19.748
          },
          {
            returnPeriod: 0.254,
            U10mag: 19.762
          },
          {
            returnPeriod: 0.255,
            U10mag: 19.781
          },
          {
            returnPeriod: 0.257,
            U10mag: 19.806
          },
          {
            returnPeriod: 0.258,
            U10mag: 19.807
          },
          {
            returnPeriod: 0.26,
            U10mag: 19.807
          },
          {
            returnPeriod: 0.261,
            U10mag: 19.832
          },
          {
            returnPeriod: 0.263,
            U10mag: 19.836
          },
          {
            returnPeriod: 0.264,
            U10mag: 19.841
          },
          {
            returnPeriod: 0.266,
            U10mag: 19.842
          },
          {
            returnPeriod: 0.267,
            U10mag: 19.858
          },
          {
            returnPeriod: 0.269,
            U10mag: 19.865
          },
          {
            returnPeriod: 0.271,
            U10mag: 19.888
          },
          {
            returnPeriod: 0.272,
            U10mag: 19.902
          },
          {
            returnPeriod: 0.274,
            U10mag: 19.923
          },
          {
            returnPeriod: 0.276,
            U10mag: 19.931
          },
          {
            returnPeriod: 0.278,
            U10mag: 19.932
          },
          {
            returnPeriod: 0.279,
            U10mag: 19.948
          },
          {
            returnPeriod: 0.281,
            U10mag: 19.954
          },
          {
            returnPeriod: 0.283,
            U10mag: 19.973
          },
          {
            returnPeriod: 0.285,
            U10mag: 19.986
          },
          {
            returnPeriod: 0.287,
            U10mag: 20
          },
          {
            returnPeriod: 0.288,
            U10mag: 20.022
          },
          {
            returnPeriod: 0.29,
            U10mag: 20.024
          },
          {
            returnPeriod: 0.292,
            U10mag: 20.026
          },
          {
            returnPeriod: 0.294,
            U10mag: 20.037
          },
          {
            returnPeriod: 0.296,
            U10mag: 20.061
          },
          {
            returnPeriod: 0.298,
            U10mag: 20.082
          },
          {
            returnPeriod: 0.3,
            U10mag: 20.099
          },
          {
            returnPeriod: 0.302,
            U10mag: 20.106
          },
          {
            returnPeriod: 0.304,
            U10mag: 20.115
          },
          {
            returnPeriod: 0.306,
            U10mag: 20.135
          },
          {
            returnPeriod: 0.309,
            U10mag: 20.139
          },
          {
            returnPeriod: 0.311,
            U10mag: 20.143
          },
          {
            returnPeriod: 0.313,
            U10mag: 20.149
          },
          {
            returnPeriod: 0.315,
            U10mag: 20.151
          },
          {
            returnPeriod: 0.317,
            U10mag: 20.154
          },
          {
            returnPeriod: 0.32,
            U10mag: 20.162
          },
          {
            returnPeriod: 0.322,
            U10mag: 20.163
          },
          {
            returnPeriod: 0.324,
            U10mag: 20.168
          },
          {
            returnPeriod: 0.327,
            U10mag: 20.193
          },
          {
            returnPeriod: 0.329,
            U10mag: 20.194
          },
          {
            returnPeriod: 0.332,
            U10mag: 20.208
          },
          {
            returnPeriod: 0.334,
            U10mag: 20.225
          },
          {
            returnPeriod: 0.337,
            U10mag: 20.227
          },
          {
            returnPeriod: 0.339,
            U10mag: 20.233
          },
          {
            returnPeriod: 0.342,
            U10mag: 20.246
          },
          {
            returnPeriod: 0.345,
            U10mag: 20.25
          },
          {
            returnPeriod: 0.347,
            U10mag: 20.262
          },
          {
            returnPeriod: 0.35,
            U10mag: 20.275
          },
          {
            returnPeriod: 0.353,
            U10mag: 20.276
          },
          {
            returnPeriod: 0.356,
            U10mag: 20.279
          },
          {
            returnPeriod: 0.359,
            U10mag: 20.309
          },
          {
            returnPeriod: 0.362,
            U10mag: 20.331
          },
          {
            returnPeriod: 0.365,
            U10mag: 20.341
          },
          {
            returnPeriod: 0.368,
            U10mag: 20.344
          },
          {
            returnPeriod: 0.371,
            U10mag: 20.397
          },
          {
            returnPeriod: 0.374,
            U10mag: 20.453
          },
          {
            returnPeriod: 0.377,
            U10mag: 20.462
          },
          {
            returnPeriod: 0.38,
            U10mag: 20.472
          },
          {
            returnPeriod: 0.384,
            U10mag: 20.486
          },
          {
            returnPeriod: 0.387,
            U10mag: 20.499
          },
          {
            returnPeriod: 0.391,
            U10mag: 20.504
          },
          {
            returnPeriod: 0.394,
            U10mag: 20.504
          },
          {
            returnPeriod: 0.398,
            U10mag: 20.522
          },
          {
            returnPeriod: 0.401,
            U10mag: 20.537
          },
          {
            returnPeriod: 0.405,
            U10mag: 20.551
          },
          {
            returnPeriod: 0.409,
            U10mag: 20.569
          },
          {
            returnPeriod: 0.412,
            U10mag: 20.576
          },
          {
            returnPeriod: 0.416,
            U10mag: 20.602
          },
          {
            returnPeriod: 0.42,
            U10mag: 20.642
          },
          {
            returnPeriod: 0.424,
            U10mag: 20.663
          },
          {
            returnPeriod: 0.428,
            U10mag: 20.664
          },
          {
            returnPeriod: 0.433,
            U10mag: 20.683
          },
          {
            returnPeriod: 0.437,
            U10mag: 20.683
          },
          {
            returnPeriod: 0.441,
            U10mag: 20.699
          },
          {
            returnPeriod: 0.446,
            U10mag: 20.713
          },
          {
            returnPeriod: 0.45,
            U10mag: 20.732
          },
          {
            returnPeriod: 0.455,
            U10mag: 20.759
          },
          {
            returnPeriod: 0.46,
            U10mag: 20.766
          },
          {
            returnPeriod: 0.465,
            U10mag: 20.798
          },
          {
            returnPeriod: 0.469,
            U10mag: 20.838
          },
          {
            returnPeriod: 0.475,
            U10mag: 20.895
          },
          {
            returnPeriod: 0.48,
            U10mag: 20.895
          },
          {
            returnPeriod: 0.485,
            U10mag: 20.917
          },
          {
            returnPeriod: 0.49,
            U10mag: 20.954
          },
          {
            returnPeriod: 0.496,
            U10mag: 20.97
          },
          {
            returnPeriod: 0.501,
            U10mag: 21.004
          },
          {
            returnPeriod: 0.507,
            U10mag: 21.019
          },
          {
            returnPeriod: 0.513,
            U10mag: 21.038
          },
          {
            returnPeriod: 0.519,
            U10mag: 21.052
          },
          {
            returnPeriod: 0.525,
            U10mag: 21.121
          },
          {
            returnPeriod: 0.532,
            U10mag: 21.132
          },
          {
            returnPeriod: 0.538,
            U10mag: 21.16
          },
          {
            returnPeriod: 0.545,
            U10mag: 21.197
          },
          {
            returnPeriod: 0.552,
            U10mag: 21.231
          },
          {
            returnPeriod: 0.559,
            U10mag: 21.237
          },
          {
            returnPeriod: 0.566,
            U10mag: 21.258
          },
          {
            returnPeriod: 0.573,
            U10mag: 21.259
          },
          {
            returnPeriod: 0.581,
            U10mag: 21.272
          },
          {
            returnPeriod: 0.588,
            U10mag: 21.3
          },
          {
            returnPeriod: 0.596,
            U10mag: 21.309
          },
          {
            returnPeriod: 0.605,
            U10mag: 21.336
          },
          {
            returnPeriod: 0.613,
            U10mag: 21.361
          },
          {
            returnPeriod: 0.622,
            U10mag: 21.366
          },
          {
            returnPeriod: 0.63,
            U10mag: 21.433
          },
          {
            returnPeriod: 0.64,
            U10mag: 21.447
          },
          {
            returnPeriod: 0.649,
            U10mag: 21.448
          },
          {
            returnPeriod: 0.659,
            U10mag: 21.52
          },
          {
            returnPeriod: 0.669,
            U10mag: 21.548
          },
          {
            returnPeriod: 0.679,
            U10mag: 21.561
          },
          {
            returnPeriod: 0.69,
            U10mag: 21.582
          },
          {
            returnPeriod: 0.7,
            U10mag: 21.605
          },
          {
            returnPeriod: 0.712,
            U10mag: 21.621
          },
          {
            returnPeriod: 0.723,
            U10mag: 21.636
          },
          {
            returnPeriod: 0.735,
            U10mag: 21.653
          },
          {
            returnPeriod: 0.748,
            U10mag: 21.685
          },
          {
            returnPeriod: 0.761,
            U10mag: 21.738
          },
          {
            returnPeriod: 0.774,
            U10mag: 21.756
          },
          {
            returnPeriod: 0.788,
            U10mag: 21.778
          },
          {
            returnPeriod: 0.802,
            U10mag: 21.8
          },
          {
            returnPeriod: 0.817,
            U10mag: 21.804
          },
          {
            returnPeriod: 0.833,
            U10mag: 21.867
          },
          {
            returnPeriod: 0.849,
            U10mag: 21.888
          },
          {
            returnPeriod: 0.865,
            U10mag: 21.976
          },
          {
            returnPeriod: 0.883,
            U10mag: 21.977
          },
          {
            returnPeriod: 0.901,
            U10mag: 21.991
          },
          {
            returnPeriod: 0.919,
            U10mag: 21.993
          },
          {
            returnPeriod: 0.939,
            U10mag: 22.016
          },
          {
            returnPeriod: 0.959,
            U10mag: 22.102
          },
          {
            returnPeriod: 0.981,
            U10mag: 22.198
          },
          {
            returnPeriod: 1.003,
            U10mag: 22.255
          },
          {
            returnPeriod: 1.026,
            U10mag: 22.363
          },
          {
            returnPeriod: 1.051,
            U10mag: 22.436
          },
          {
            returnPeriod: 1.076,
            U10mag: 22.457
          },
          {
            returnPeriod: 1.103,
            U10mag: 22.467
          },
          {
            returnPeriod: 1.132,
            U10mag: 22.491
          },
          {
            returnPeriod: 1.161,
            U10mag: 22.568
          },
          {
            returnPeriod: 1.193,
            U10mag: 22.611
          },
          {
            returnPeriod: 1.226,
            U10mag: 22.683
          },
          {
            returnPeriod: 1.261,
            U10mag: 22.685
          },
          {
            returnPeriod: 1.298,
            U10mag: 22.697
          },
          {
            returnPeriod: 1.337,
            U10mag: 22.756
          },
          {
            returnPeriod: 1.379,
            U10mag: 22.757
          },
          {
            returnPeriod: 1.424,
            U10mag: 22.788
          },
          {
            returnPeriod: 1.471,
            U10mag: 22.808
          },
          {
            returnPeriod: 1.522,
            U10mag: 22.821
          },
          {
            returnPeriod: 1.576,
            U10mag: 22.857
          },
          {
            returnPeriod: 1.634,
            U10mag: 22.872
          },
          {
            returnPeriod: 1.697,
            U10mag: 22.912
          },
          {
            returnPeriod: 1.765,
            U10mag: 23.055
          },
          {
            returnPeriod: 1.839,
            U10mag: 23.063
          },
          {
            returnPeriod: 1.919,
            U10mag: 23.147
          },
          {
            returnPeriod: 2.006,
            U10mag: 23.328
          },
          {
            returnPeriod: 2.101,
            U10mag: 23.341
          },
          {
            returnPeriod: 2.206,
            U10mag: 23.342
          },
          {
            returnPeriod: 2.323,
            U10mag: 23.394
          },
          {
            returnPeriod: 2.452,
            U10mag: 23.404
          },
          {
            returnPeriod: 2.596,
            U10mag: 23.86
          },
          {
            returnPeriod: 2.758,
            U10mag: 23.864
          },
          {
            returnPeriod: 2.942,
            U10mag: 23.997
          },
          {
            returnPeriod: 3.152,
            U10mag: 24.079
          },
          {
            returnPeriod: 3.395,
            U10mag: 24.141
          },
          {
            returnPeriod: 3.677,
            U10mag: 24.15
          },
          {
            returnPeriod: 4.012,
            U10mag: 24.185
          },
          {
            returnPeriod: 4.413,
            U10mag: 24.29
          },
          {
            returnPeriod: 4.903,
            U10mag: 24.636
          },
          {
            returnPeriod: 5.516,
            U10mag: 25.006
          },
          {
            returnPeriod: 6.304,
            U10mag: 25.207
          },
          {
            returnPeriod: 7.355,
            U10mag: 25.362
          },
          {
            returnPeriod: 8.826,
            U10mag: 25.672
          },
          {
            returnPeriod: 11.032,
            U10mag: 26.265
          },
          {
            returnPeriod: 14.71,
            U10mag: 26.501
          },
          {
            returnPeriod: 22.064,
            U10mag: 28.478
          },
          {
            returnPeriod: 44.129,
            U10mag: 28.731
          }
        ]
      }

      return [
        {
          name: 'Best estimate',
          type: 'line',
          data: data.lines.map(l => [l.returnPeriod, l.bestEstimate]),
          showSymbol: false
        },
        {
          name: 'Lower bound',
          type: 'line',
          data: data.lines.map(l => [l.returnPeriod, l.lowerBound]),
          showSymbol: false,
          lineStyle: {
            type: 'dashed'
          }
        },
        {
          name: 'Upper bound',
          type: 'line',
          data: data.lines.map(l => [l.returnPeriod, l.upperBound]),
          showSymbol: false,
          lineStyle: {
            type: 'dashed'
          }
        },
        {
          name: 'U10mag',
          type: 'scatter',
          data: data.shapes.map(shape => [shape.returnPeriod, shape.U10mag]),
          symbol: 'diamond'
        }
      ]
    },
    createGraphic() {
      return [
        {
          type: 'group',
          left: '12%',
          top: '12%',
          children: [
            {
              type: 'rect',
              z: 100,
              left: 'center',
              top: 'middle',
              shape: {
                width: 205,
                height: 100
              },
              style: {
                fill: '#fff',
                stroke: '#555',
                lineWidth: 1,
                shadowBlur: 8,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowColor: 'rgba(0,0,0,0.2)'
              }
            },
            {
              type: 'text',
              z: 100,
              left: 'center',
              top: 'middle',
              style: {
                fill: '#333',
                overflow: 'break',
                text:
                  '1 year: 22.3 (21.9 - 22.7) \n10 year: 26.1 (24.8 - 27.4) \n50 year: 28.8 (26.5 - 31.8) \n100 year: 30.0 (27.1 - 34.1) \n1,000 year:  33.9 (28.7 - 42.4) \n10,000 year:  37.7 (29.9 - 52.7)',
                font: '14px Roboto'
              }
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.red-text {
  color: red;
}

.blue-text {
  color: blue;
}
</style>
