<template>
    <div class="box">
      <div class="left">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="dataLeft"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="getRightData"
          ref="tree">
        </el-tree>
      </div>
      <div class="right">
        <div class="buttons" v-if="dataRight!=''">
          <el-button type="primary" @click="getCheckedNodes">保存</el-button>
          <!--<el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
          <!--<el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
          <!--<el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
          <!--<el-button @click="resetChecked">清空</el-button>-->
        </div>
        <el-tree
          :data="dataRight"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>


      </div>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          filterText: '',
          dataLeft: [{
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: '二级 2-1'
            }, {
              id: 6,
              label: '二级 2-2'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2'
            }]
          }],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          dataRight:[],
          datafake: [{
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: '二级 2-1'
            }, {
              id: 6,
              label: '二级 2-2'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2'
            }]
          }],
        };
      },
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
      methods: {
        getRightData(data, node, obj){
          // console.log(data, node, obj);
          this.dataRight=this.datafake;
        },
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        getCheckedNodes() {
          console.log(this.$refs.tree.getCheckedNodes());
        },
        getCheckedKeys() {
          console.log(this.$refs.tree.getCheckedKeys());
        },
        setCheckedNodes() {
          this.$refs.tree.setCheckedNodes([{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 9,
            label: '三级 1-1-1'
          }]);
        },
        setCheckedKeys() {
          this.$refs.tree.setCheckedKeys([3]);
        },
        resetChecked() {
          this.$refs.tree.setCheckedKeys([]);
        }
      },
    }
</script>

<style scoped>
  .box{
    display: flex;
    justify-content: space-between;
  }
  .box>div{
    height: 74vh;
    border: 1px solid #ddd;
    padding: 1%;
    overflow: auto;
  }
  .left{
    width: 40%;
    border-right: none;
  }
  .right{
    width: 60%;
  }
  .buttons{
    text-align: right;
  }
</style>
