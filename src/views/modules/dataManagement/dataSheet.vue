<!-- 数据表管理 -->
<template>
    <div class='dataSheet'>
        <div class="box" >
          <div class="left list-left-tree" :style="{height:(tableHeight+120)+'px'}">
            <div class="custom-tree-container">
              <el-input placeholder="请输入内容" v-model="filterText" class="input-with-select" icon="el-icon-search"></el-input>
              <el-tree :data="dataTree" ref="ruleTreeRoot" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick" v-loading="treeLoading" :filter-node-method="filterNode">
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                     <span class="tree-label" :title="node.label">
                    <img v-if="node.data.type =='funFolder'" class="tree-icon" src="./icon/folder.png" alt="">
                    <img v-if="node.data.databaseType =='oracle'" class="tree-icon" src="./icon/data.png" alt="">
                    {{ node.label }}
                    </span>
                </span>
              </el-tree>
            </div>
          </div>
          <div class="right" :style="{height:(tableHeight+120)+'px'}">
            <div>
              <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
                <el-form-item label="表名:">
                  <el-input v-model="dataForm.title" placeholder="请输入搜索内容" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item label="数据库:">
                    <el-input v-model="dataForm.database" placeholder="请输入搜索内容" clearable></el-input>
                </el-form-item> -->
                <el-form-item>
                  <el-button type="primary" @click="getSearchList()">查询</el-button>
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
              </el-form>
              <el-table :data="dataList" border v-loading="dataListLoading" :height="tableHeight+32" style="width: 100%;">
                <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
                <el-table-column prop="title" align="center" label="表名"></el-table-column>
                <el-table-column prop="tableSize" align="center" label="占用空间大小"></el-table-column>
                <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" align="center" label="更新时间"></el-table-column>
                <el-table-column align="center" label="操作" min-width='120px'>
                  <template slot-scope="scope">
                    <el-button size="small" type="text" @click="getTableStructure(scope.row)">查看表结构</el-button>
                    <el-button size="small" type="text" @click="getTableData(scope.row)">查看表数据</el-button>
                    <el-button size="small" type="text" @click="getTableClear(scope.row)">数据清除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页
            <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="apComServerData.pageIndex"
             :page-sizes="[10, 20, 50, 100]"
             :page-size="apComServerData.size"
             :total="apComServerData.total"
             layout="total, sizes, prev, pager, next, jumper">
             </el-pagination> -->
            </div>
          </div>
        </div>
        <el-dialog :visible.sync="StructureDialog" title="查看表结构" :close-on-click-modal="false" :modal-append-to-body="false" :close-on-press-escape="false">
            <TableStructure v-if="StructureDialog" @close="closeStructureDrawer" @ok="StructureSucceed" :structureList="structureList" :structureName="structureName"></TableStructure>
            <span slot="footer" class="dialog-footer">
                <el-button @click="StructureDialog = false">关 闭</el-button>
            </span>
        </el-dialog>
         <el-dialog :title="Title" :visible.sync="tableDataVisible" width="80%" :close-on-click-modal="false" v-if="tableDataVisible">
            <TableColumn :table-name="structureName" :structureList="structureList"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tableDataVisible = false">关 闭</el-button>
            </span>
         </el-dialog>
    </div>
</template>
<script>
import TableStructure from './component/tableStructure.vue'
import TableColumn from './component/tableColumn.vue'
import Template from './template.vue'
export default {
    components:{
        TableStructure,
        Template,
        TableColumn
    },
    data(){
        return{
            filterText:'',
            dataForm:{
                title:'',
            },
            Title:'住院结算明细',
            tableList:[],
            tableColumns:[],
            dataList:[],
            apComServerData:{
                current: 1,
                size: 10,
                pageNum:1,
                total:0,
                pageIndex:1,
            },
            dataTree:[
                {
                label: '规划库',
                type: 'funFolder',
                children: []
            }
            ],
            defaultProps:{
                label(data, node) {
                    const config = data.__config__ || data
                    return  config.label || config.projectName
                }
            },
            childArr:[],
            StructureDialog:false,
            tableDataVisible:false,
            treeLoading:false,
            dataListLoading:false,
            projectList:'',
            structureList:'',
            structureName:'',
            isCheckedId: '', //数据授权回显id
            treeDataToHint:[]
        }
    },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
  },
    mounted() {
        this.initDataTree()
    },
    watch:{
        filterText(val) {
        this.$refs.ruleTreeRoot.filter(val.trim());
        },
    },
    methods:{
         // 树形控件input 过滤
        filterNode(value, data) {
            if (!value) return true
            if(data.projectName){
                return data.projectName.indexOf(value) !== -1;
            }else {
                return data.label.indexOf(value) !== -1;
            }
        },
        //初始化tree
        initDataTree(){
            this.treeLoading = true
            this.$http({
                url: this.$http.adornUrl("/prjBusDatabaseRelation/selectAllDatabases"),
                method: "get",
            }).then(({data}) => {
                if(data && data.code === 200){
                    this.dataTree[0].children = data.result
                }
                this.treeLoading = false
            })
        },

        //tree点击事件
        handleNodeClick(data,node){
            this.isCheckedId = data.projectId
            //  this.childArr = []
            this.getTreeChild(data,node)
        },

        // 获取列表
        getTreeChild(datas,node){
            this.projectList = datas
            this.$http({
                url: this.$http.adornUrl("/prjBusDatabaseRelation/listAllTablesByDB"),
                method: "get",
                params: this.$http.adornParams({
                projectId: this.isCheckedId,
                },false)
            }).then(({data}) => {
                if(data && data.code === 200){
                    this.dataList = data.result
                    // setTimeout(() => {
                        // debugger
                        // const children = []
                    //     data.result.forEach(i => {
                    //         // i.children = []
                    //         if(i.parentId == datas.projectId){
                    //             // i.children = []
                    //             children.push(i)
                    //         }
                    //     })
                    //    this.dataTree =  children
                    // },500)
                 }
                    // this.treeLoading = false
            })
            // return datas
        },
        //查询
        getSearchList(){
            let _search = this.dataForm.title.toLowerCase()
            let _SearchList = []
            if(_search){
               this.dataList.forEach(i => {
                   if(i.title.toLowerCase().indexOf(_search) !== -1){
                       _SearchList.push(i)
                   }
               })
            this.dataList = _SearchList
            }
        },
        //表结构
        getTableStructure(data){
            this.StructureDialog = true
            this.structureList = this.projectList
            this.structureName = data.title

        },
        //表数据
        getTableData(data){
            this.tableDataVisible = true
            this.structureName = data.title
            this.structureList = this.projectList
        },
         // 每页数
        handleSizeChange (val) {
            this.apComServerData.size = val
            this.apComServerData.pageIndex = 1
            this.getAllList()

        },
        // 当前页
        handleCurrentChange (val) {
            this.apComServerData.pageIndex = val
            this.getAllList()
        },
        // 关闭弹窗确认
        StructureSucceed(){
            this.closeStructureDrawer()
        },
        closeStructureDrawer(){
             this.StructureDialog = false
        },
        //弹框关闭
        closeClick(){
            this.$emit('close')
        },
        //重置
        resetForm(){
            this.dataForm.title = '';
            this.apComServerData.pageIndex = 1
            this.getTreeChild()
        },
        //数据清除
        getTableClear(row){
            this.$confirm('确认要清除此项目！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() =>{
                this.$http({
                    url:this.$http.adornUrl('/prjBusDatabaseRelation/deleteTableData'),
                    method: 'get',
                    params: this.$http.adornParams({
                        projectId: this.projectList.projectId,
                        tableName:row.title
                    })
                }).then(({data}) =>{
                    if(data && data.code === 200){
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                        })
                        // 更新批次列表
                        this.$emit('refreshBitchData');
                    }else{
                        this.$message.error(data.message)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清除'
                });
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
}
.custom-tree-node{
    width: 100%;
    display: flex;
    // display: inline-block;
    align-items: center;
}
.tree-label {
    max-width: 180px;
    display: inline-block;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
}
.custom-tree-container {
  /*overflow-y: hidden;*/
  overflow-x: auto;
  width: 100%;
  height: 100%;
  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
}
.box {
  width:100%;
  height:100%;
  display: flex;
  justify-content: space-between;
}
.box > div {
  /*height: 73vh;*/
  /*border: 1px solid #ddd;*/
  padding: 1%;
  overflow: auto;
}
.left {
  width: 25%;
  border-right: none;
}
.right {
  width: 75%;
  height: 100%!important;
}
.inline-block {
  display: inline-block;
}
</style>
