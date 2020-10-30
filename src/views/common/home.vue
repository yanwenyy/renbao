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
        timer:null
      }
    },
    mounted () {
      this.getListDay();
      this.getListMonth();
      this.getListYear();
      this.timer = setInterval(() =>{    //应用setInterval来刷新getList()
        this.getListDay();
        console.log('请求了')
      },60000);
    },
    beforeDestroy () {
      if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
        clearInterval(this.timer); //关闭
      }
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
      //当天的数据
      getListDay(){
        this.$http({
          url: this.$http.adornUrl('/jinding/statistics/list'),
          method: 'get',
          params: this.$http.adornParams({
            'type': '1',
          })
        }).then(({data}) => {
          if (data && data.code === 10000) {
           var datas=data.data,i=0,len=datas.length;
           var gw=0,gl=0,cdd=0;
           for(;i<len;i++){
             var v=datas[i];
             if(v.doorEmissionStand=='国五'){
               gw=v.tranNum;
             }
             if(v.doorEmissionStand=='国六'){
               gl=v.tranNum;
             }
             if(v.doorEmissionStand=='纯电动'){
               cdd=v.tranNum;
             }
             this.initChartBar(gw,gl,cdd)
           }
          }
          this.dataListLoading = false
        })
      },
      //当月
      getListMonth(){
        this.$http({
          url: this.$http.adornUrl('/jinding/statistics/list'),
          method: 'get',
          params: this.$http.adornParams({
            'type': '2',
          })
        }).then(({data}) => {
          if (data && data.code === 10000) {
            var datas=data.data,i=0,len=datas.length;
            var gw=0,gl=0,cdd=0;
            for(;i<len;i++){
              var v=datas[i];
              if(v.doorEmissionStand=='国五'){
                gw=v.tranNum;
              }
              if(v.doorEmissionStand=='国六'){
                gl=v.tranNum;
              }
              if(v.doorEmissionStand=='纯电动'){
                cdd=v.tranNum;
              }
              this.initChartBar2(gw,gl,cdd)
            }
          }
          this.dataListLoading = false
        })
      },
      //当年
      getListYear(){
        this.$http({
          url: this.$http.adornUrl('/jinding/statistics/list'),
          method: 'get',
          params: this.$http.adornParams({
            'type': '3',
          })
        }).then(({data}) => {
          if (data && data.code === 10000) {
            var datas=data.data,i=0,len=datas.length;
            var gw=0,gl=0,cdd=0;
            for(;i<len;i++){
              var v=datas[i];
              if(v.doorEmissionStand=='国五'){
                gw=v.tranNum;
              }
              if(v.doorEmissionStand=='国六'){
                gl=v.tranNum;
              }
              if(v.doorEmissionStand=='纯电动'){
                cdd=v.tranNum;
              }
              this.initChartBar3(gw,gl,cdd)
            }
          }
          this.dataListLoading = false
        })
      },
      // 当日
      initChartBar (gw,gl,cdd) {
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
            data: [gw,gl,cdd],
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,  //开启显示
                  position: 'top',  //在上方显示
                  textStyle: {  //数值样式
                    color: 'black',
                    fontSize: 16
                  }
                }
              }
            },
          }]
        }
        this.chartBar = echarts.init(document.getElementById('J_chartBarBox'));
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },
      // 当月
      initChartBar2 (gw,gl,cdd) {
        var option = {
          title: {
            'text': '当月运输量'
          },
          xAxis: {
            type: 'category',
            data: ['国五', '国六', '纯电动']
          },
          grid:{
            left: '50'
          },
          yAxis: {
            type: 'value',
          },
          series: [{
            data: [gw,gl,cdd],
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,  //开启显示
                  position: 'top',  //在上方显示
                  textStyle: {  //数值样式
                    color: 'black',
                    fontSize: 16
                  }
                }
              }
            },
          }]
        }
        this.chartBar2 = echarts.init(document.getElementById('J_chartBarBox2'));
        this.chartBar2.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar2.resize()
        })
      },
      // 当年
      initChartBar3 (gw,gl,cdd) {
        var option = {
          title: {
            'text': '当年运输量'
          },
          xAxis: {
            type: 'category',
            data: ['国五', '国六', '纯电动']
          },
          grid:{
            left: '50'
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [gw,gl,cdd],
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,  //开启显示
                  position: 'top',  //在上方显示
                  textStyle: {  //数值样式
                    color: 'black',
                    fontSize: 16
                  }
                }
              }
            },
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

