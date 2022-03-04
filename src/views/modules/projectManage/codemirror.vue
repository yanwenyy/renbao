<template>
  <codemirror :getLoadTree="getLoadTree" :treedata="treeData" :loadTree="loadTree"></codemirror>
</template>

<script>
  import codemirror from '@/components/codemirror/index'
    export default {
      components: {
        codemirror
      },
      data(){
        return{
          loadTree:[],
          treeData:[{
            label: '一级 1',
            children: [{
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1',
                isLeaf:true
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
          }]
        }
      },
      methods:{
        getLoadTree(data,obj,node){
          console.log(data,obj,node,222);
          this.loadTree=data.children
        },
      }
    }
</script>

<style scoped>

</style>
