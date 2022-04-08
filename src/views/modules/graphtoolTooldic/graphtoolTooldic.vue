<template>
  <div class="graphtool-tooldic">
    <div class="graphtool-top">
        <div class="data-left">
            <div class="data-tree">
               <el-tree
                class="sql-tree-self"
                :data="dataTreeData"
                ref="tree1"
                node-key="id"
                lazy
                :load="loadNode"
                :props="defaultProps"
                draggable
                @node-expand="handleNodeClick"
                :default-expanded-keys="treeExpandData"
                :allow-drop="returnFalse"
                :allow-drag="allowDrag">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>
                            <img v-if="node.data.dataType=='1'" class="tree-icon" src="../../../components/codemirror/icons/files.png" alt="">
                            <img v-if="node.data.dataType=='2'" class="tree-icon" src="../../../components/codemirror/icons/table_1.png" alt="">
                            <img v-if="node.data.dataType=='3'" class="tree-icon" src="../../../components/codemirror/icons/column.png" alt="">
                            {{ node.label }}
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <div class="data-canvas mar-l">
            <div id="myDiagramDiv" ref="myDiagramDiv"  style="border: solid 1px #F3F3F3;height:100%;"></div>
            <!-- <img width="15" id="fd" height="15" title="画布放大" src="../assistSqlEdit/images/fangda.png" style="z-index:9999;position: absolute;right: 250px;top: 12px;"  onclick="assistSqlEdit.hb()"/>
            <img width="15" id="sx" height="15" title="画布缩小" src="../assistSqlEdit/images/fangda.png" style="z-index:9999;position: absolute;right: 10px;top: 12px;"  onclick="assistSqlEdit.hbsx()"/> -->
        </div>
        <div class="data-right mar-l">
            <div id="joins" class="data-option-box">
                <div class="tstext">表连接</div>
                <div id="form" class="box-bg" ></div>

            </div>
            <div id="tjHidden" class="data-option-box">
                <div class="tstext">连接条件</div>
                <div id="linkDiv" class="box-bg" >
                    <div class="form-group" id="join2"  style="display:none;">
                        <div class="col-sm-12">
                            <input name="MainPort" type="text" class="form-control" id="MainPort" disabled="disabled"></input>
                        </div>
                    </div>
                    <div class="form-group" id="select" style="display:none;">

                        <div class="col-sm-8">
                            <select id="comper" onchange="assistSqlEdit.changeCopare()">
                                <option value="=">等于</option>
                                <option value="!=">不等于</option>
                                <option value="&gt;">大于</option>
                                <option value="&gt;=">大于等于</option>
                                <option value="&lt;">小于</option>
                                <option value="&lt;=">小于等于</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" id="join1" style="display:none;">
                        <div class="col-sm-12">
                            <input name="toPort" type="text" class="form-control" id="toPort" disabled="disabled"></input>
                            <input name="from" type="hidden" class="form-control" id="from"></input>
                            <input name="to" type="hidden" class="form-control" id="to"></input>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
    <div class="graphtool-bottom">
        <div class="data-sort">
            <div class="tstext">排序</div>
            <div id="form" class="box-bg" style="overflow: auto;" ></div>
        </div>
        <div class="data-list mar-l" id="sqlHidden">
            <div id="attr" class="data-list-item data-list-table" style="margin-top:34px;margin-bottom:10px">
                <div class="table-view">
                    <!-- <table class="table table-striped" id="gridTable"></table> -->
                    <el-table
                        ref="gridTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%;height:100%"
                        size="mini"
                    >
                        <el-table-column
                            v-for="(items, index) in tablePositionKey"
                            :prop="items.dataname"
                            :key="index"
                            :label="items.label"
                            :sortable="items.issortable"
                            :align="items.align ? items.align : 'center'"

                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div id="sql" class="box-bg data-list-item sql-box"></div>
	    </div>


    </div>




  </div>
</template>
<script>
export default {
  data() {
    return {
        defaultProps: {
            children: 'children',
            label(data, node) {
                const config = data.__config__ || data
                return  config.label || config.title
            },
            isLeaf:(data,node) => {
                if (node.level >2) {// 根据需要进行条件判断添加is-leaf类名
                return true
                }
            }
        },
        loadTree: [],//左边树懒加载的数据
        dataTreeData: [],//左边树数据表初始的数据
        treeExpandData: [], // 通过接口获取的需要默认打开的节点
        tablePositionKey: [ // 表头
            {dataname: "order",label: "",issortable: false,type: ""},
            {dataname: "gridTable_tables",label: "来源",issortable: false,type: ""},
            {dataname: "gridTable_name",label: "英文字段名",issortable: false,type: ""},
            {dataname: "gridTable_info",label: "中文字段名",issortable: false,type: ""},
            {dataname: "gridTable_alias",label: "别名",issortable: false,type: ""},
            {dataname: "gridTable_fun",label: "聚合函数",issortable: false,type: ""},
            {dataname: "gridTable_order",label: "排序",issortable: false,type: ""},
            {dataname: "gridTable_screen",label: "筛选",issortable: false,type: ""},
            {dataname: "gridTable_group",label: "分组",issortable: false,type: ""},
        ],
        tableData: []

    };
  },
  activated () {
      this.getSjbData()
  },
  mounted () {
        var assistSqlEdit = new AssistSqlEdit();
      	var diagramDiv = this.$refs.myDiagramDiv;
        var layeX = -1;
	    var layeY = -1;
        diagramDiv.onmousemove = function(event) {
            layeX = event.layerX;
            layeY = event.layerY;
        };
        assistSqlEdit.init();
        // var assistSqlEdit = new AssistSqlEdit();



  },

  methods: {
    //展开树形结构进行懒加载的方法 data该节点所对应的对象、obj节点对应的 Node、node节点组件本身
    getLoadTree(datas, obj, node) {
    // console.log(datas,obj,node,222);
        if(datas.children.length==0){
            this.$http({
            url: this.$http.adornUrl('/sqlScript/getColumnList'),
            method: 'get',
            isLoading:false,
            params: this.$http.adornParams({
                id:datas.id,
                tableName:datas.title,
            })
            }).then(({data}) => {
                var _data=data.result;
                this.loadTree =_data||[];
            })
        }
    },
    //获取数据表数据
    getSjbData(){
        this.$http({
            url: this.$http.adornUrl('/sqlScript/listDBPTree'),
            method: 'get',
            isLoading:false,
            params: this.$http.adornParams()
        }).then(({data}) => {
            // 注意层级 dataType是必须要的,1:一级,2:表,3:列
            var datas=data.result;
            this.dataTreeData=datas?[datas]:[];
            this.treeExpandData = [this.dataTreeData[0].id] // 默认展开一级节点
        })
    },
    loadNode (node, resolve) {
        if (node.level === 0) {
            return resolve(this.dataTreeData);
        }
        if(node.data.children&&node.data.children!=''){
          return resolve(node.data.children);
        }else{
          setTimeout(() => {
            // if(this.loadTree.length>0){
            //   this.treeDataToHint.forEach((item,index)=>{
            //     if(item.id==this.loadTree[0].parentId){
            //       item.childrens=this.loadTree;
            //       item.childHints=[];
            //       this.loadTree.forEach(vtem=>{
            //         item.childHints.push(vtem[this.defaultProps.label])
            //       })
            //       this.$set(this.treeDataToHint,index,item)
            //     }

            //   });
            // }
            resolve(this.loadTree);
          }, 500);

        }
    },
    handleNodeClick (data,obj,node) {
        this.getLoadTree(data,obj,node)
    },
    allowDrag(draggingNode) {
        // return draggingNode.data.level>2||draggingNode.data.type=='funNode';
        return Number(draggingNode.data.dataType)>1||draggingNode.data.type=='funNode'||draggingNode.data.type=='params';
    },
    // 树内不可拖拽
    returnFalse() {
        return false;
    },
  },
  computed: {

  },
  components: {

  },
  watch: {


  }
};
</script>
<style scoped lang="scss">
.graphtool-tooldic {
    width: 100%;
    height: 100vh;
    .graphtool-top {
        width: 100%;
        // height: ;
        display: flex;
        height: 50vh;
        .data-left {
            width: 300px;
            overflow: scroll;

        }
        .data-canvas {
            flex: 1;
        }
        .data-right {
            width: 300px;
            height: 100%;
            display: flex;
            flex-direction: column;
            .data-option-box {
                flex: 1;
                display: flex;
                flex-direction: column;

                .box-bg {
                    flex: 1;
                }

            }
        }
    }
    .tree-icon{
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 5px;
    }
    .graphtool-bottom {
        height: 50vh;
        display: flex;
        .data-sort {
            width: 300px;
            display: flex;
            flex-direction: column;
            .box-bg {
                flex: 1;
            }
        }
        .data-list {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            .data-list-item {
                width: 100%;
                position: relative;
            }
            .data-list-table {
                flex: 1;
            }
            .sql-box {
                height: 100px;
                overflow: auto;
            }
            .table-view {
                position: absolute;
                height: 100%;
                width: 100%;
                /deep/ .el-table {
                    height: 100%;
                }
            }
        }
    }
    .box-bg {
        background: #F7F7F7;
        border: 1px solid #F3F3F3;
        overflow: auto;
    }
    .tstext {
        height: 26px;
        color: #5887B3;
        margin-top: 5px;
        font-size: 14px;
    }
    .mar10 {
        margin: 0 10px;
    }
    .mar-r {
        margin-left: 10px;
    }
    .mar-l {
        margin-left: 10px;
    }
}

</style>
