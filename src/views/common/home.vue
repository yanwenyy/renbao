<template>
  <div class="mod-home">
    <!--<div class="home-bg-div">-->
      <!--<img class="home-bg-jd" src="../../../static/img/bg1.jpg" alt="">-->
      <!--<div class="home-title">-->
        <!--<div>欢迎使用</div>-->
        <!--<div>港陆清洁运输管控平台</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="aobo-logo">-->
      <!--<img src="../../../static/img/aobao.png" alt="">-->
    <!--</div>-->
    <div class="echarts-title">港陆清洁运输情况</div>
    <div class="mod-demo-echarts">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <div id="J_chartBarBox" class="chart-box"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div id="J_chartBarBox2" class="chart-box"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div id="J_chartBarBox3" class="chart-box"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        chartBar: null,
        chartBar2: null,
        chartBar3: null,
      }
    },
    mounted () {
      this.initChartBar();
      this.initChartBar2();
      this.initChartBar3();
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartBar) {
        this.chartBar.resize()
      }
      if (this.chartBar) {
        this.chartBar2.resize()
      }
      if (this.chartBar) {
        this.chartBar3.resize()
      }
    },
    methods: {
      // 当日
      initChartBar () {
        var option = {
          title: {
            'text': '当日运输量'
          },
          xAxis: {
            type: 'category',
            data: ['国五', '国六', '纯电动']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [120, 200, 150],
            type: 'bar'
          }]
        }
        this.chartBar = echarts.init(document.getElementById('J_chartBarBox'));
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },
      // 当月
      initChartBar2 () {
        var option = {
          title: {
            'text': '当月运输量'
          },
          xAxis: {
            type: 'category',
            data: ['国五', '国六', '纯电动']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [120, 200, 150],
            type: 'bar'
          }]
        }
        this.chartBar2 = echarts.init(document.getElementById('J_chartBarBox2'));
        this.chartBar2.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar2.resize()
        })
      },
      // 当年
      initChartBar3 () {
        var option = {
          title: {
            'text': '当年运输量'
          },
          xAxis: {
            type: 'category',
            data: ['国五', '国六', '纯电动']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [120, 200, 150],
            type: 'bar'
          }]
        }
        this.chartBar3 = echarts.init(document.getElementById('J_chartBarBox3'));
        this.chartBar3.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar3.resize()
        })
      },
    }
  }
</script>
<style lang="scss">
  .echarts-title{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
<!--<style>-->
  <!--.inline-block{-->
    <!--display: inline-block;-->
  <!--}-->
  <!--.mod-home {-->
    <!--text-align: center;-->
    <!--height:80vh;-->
  <!--}-->
  <!--.home-bg{-->
    <!--width: 40%;-->
    <!--height: auto;-->
  <!--}-->
  <!--.home-bg-div{-->
    <!--width: 100%;-->
    <!--height: 100%;-->
    <!--position: relative;-->
    <!--overflow: hidden;-->
  <!--}-->
  <!--.home-bg-div:after {-->
    <!--position: absolute;-->
    <!--content: '';-->
    <!--width: 100%;-->
    <!--height: 100%;-->
    <!--/*background: rgba(0,0,0,.3);*/-->
    <!--top: 0;-->
    <!--left: 0;-->
    <!--box-shadow:0 0 20px 10px #fff inset;-->
  <!--}-->
  <!--.home-bg-jd{-->
    <!--width: 100%;-->
    <!--height: auto;-->
    <!--position: absolute;-->
    <!--top:-10%;-->
    <!--left:0;-->
    <!--opacity: 0.7;-->
  <!--}-->
  <!--.home-title{-->
    <!--width: 100%;-->
    <!--position: absolute;-->
    <!--top:20%;-->
    <!--left:0;-->
    <!--/*color:#fff;*/-->
    <!--font-size: 30px;-->
    <!--font-weight: bold;-->
    <!--line-height:60px;-->
    <!--text-shadow:5px 2px 6px #fff;-->
  <!--}-->
  <!--.logo-home{-->
    <!--width: 10%;-->
    <!--height: auto;-->
  <!--}-->
  <!--.aobo-logo{-->
    <!--position: absolute;-->
    <!--bottom:8%;-->
    <!--right:5%;-->
  <!--}-->
  <!--.aobo-logo>img{-->
    <!--width: 100px;-->
    <!--height: auto;-->
  <!--}-->
<!--</style>-->

