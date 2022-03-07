<template>
  <codemirror
    :changeTree="changeTree"
    :getLoadTree="getLoadTree"
    :treedata="treeData"
    :loadTree="loadTree"
    :getwsData="getwsData"
    :tableData="tableData"></codemirror>
</template>

<script>
  import codemirror from '@/components/codemirror/index'

  export default {
    components: {
      codemirror
    },
    data() {
      return {
        tableData: [],
        loadTree: [],//左边树懒加载的数据
        treeData: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1',
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],//左边树初始的数据
      }
    },
    methods: {
      //左侧树切换类型函数
      changeTree(type){
        console.log(type)
      },
      //展开树形结构进行懒加载的方法 data该节点所对应的对象、obj节点对应的 Node、node节点组件本身
      getLoadTree(data, obj, node) {
        // console.log(data,obj,node,222);
        this.loadTree = [{
          label: '我是个假的数据',
        }]
      },
      getwsData() {
        var that = this;
        setInterval(function () {
          that.tableData.push({
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          })
        }, 1000)
      },
    }
  }
</script>

<style scoped>

</style>
