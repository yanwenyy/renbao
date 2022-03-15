<!-- 数据表管理 -->
<template>
    <div class='dataSheet'>
        <el-row :gutter="20">
            <el-col :span="5">
                <el-card style="height:600px;overflow-y:auto">
                    <div style='padding:5px'><el-input placeholder="请输入内容" v-model="filterText" class="input-with-select" icon="el-icon-search"></el-input></div>
                    <el-tree :data="dataTree" ref="ruleTreeRoot" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick" v-loading="treeLoading">
                        <!-- <span class="custom-tree-node" slot-scope="{ node, data }"> -->
                        <!-- <span> -->
                             <!-- <img class="tree-icon" src="./icon/column.png" alt=""> -->
                               <!-- {{ node.label }} -->
                        <!-- </span> -->
                      <!-- </span> -->
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="19">
                <div>
                    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
                        <el-form-item label="表名:">
                            <el-input v-model="dataForm.tableName" placeholder="请输入搜索内容" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="数据库:">
                            <el-input v-model="dataForm.database" placeholder="请输入搜索内容" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getSearchList()">查询</el-button>
                            <el-button @click="resetForm('dataForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="dataList" border v-loading="dataListLoading" height="600" style="width: 100%;">
                        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                        <el-table-column prop="tableName" align="center" label="表名"></el-table-column>
                        <el-table-column prop="tableSize" align="center" label="占用空间大小"></el-table-column>
                        <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
                        <el-table-column prop="updateTime" align="center" label="更新时间"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" @click="getTableStructure(scope.row)">查看表结构</el-button>
                                <el-button size="small" type="text" @click="getTableData(scope.row)">查看表数据</el-button>
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
            </el-col>
        </el-row>
        <el-dialog :visible.sync="StructureDialog" title="查看表结构" :close-on-click-modal="false" :modal-append-to-body="false" :close-on-press-escape="false">
            <TableStructure v-if="StructureDialog" @close="closeStructureDrawer" @ok="StructureSucceed" :structureList="structureList" :structureName="structureName"></TableStructure>
            <span slot="footer" class="dialog-footer">
                <el-button @click="StructureDialog = false">关 闭</el-button>
            </span>
        </el-dialog>
         <el-dialog :title="Title" :visible.sync="tableDataVisible" width="80%" :close-on-click-modal="false">
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
                tableName:'',
                database:''
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
                label: "规划库",
                children: []
                }
            ],
            defaultProps:{ 
                //  children: 'children',
                //  label:'projectName'
                label(data, node) {
                    const config = data.__config__ || data
                    return  config.label || config.projectName
                },
            },
            childArr:[],
            StructureDialog:false,
            tableDataVisible:false,
            treeLoading:false,
            dataListLoading:false,
            projectList:'',
            structureList:'',
            structureName:'',
            isCheckedId: [], //数据授权回显id
        }
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
             this.childArr = []
             this.getTreeChild(data)
        },

        // 获取列表
        getTreeChild(data,resolve){
            console.log(this.dataTree[0].children)
            this.projectList = data
            this.$http({
                url: this.$http.adornUrl("/prjBusDatabaseRelation/listAllTablesByDB"),
                method: "get",
                params: this.$http.adornParams({
                projectId: data.projectId,
                },false)
            }).then(({data}) => {
                if(data && data.code === 200){
                    // this.isCheckedId = []
                    this.dataList = data.result
                    // data.result.forEach(i => {
                    //     let childrens = [{
                    //         id:i.projectId,
                    //         label: i.tableName,
                    //         children: i

                    //     }]
                    //     this.dataTree[0].children.push(childrens)
                    // })
            
                    // console.log( this.dataTree[0].children)
                 }
                    // this.treeLoading = false

            })
        },
        //查询
        getSearchList(){
            // this.$http({
            //     url: this.$http.adornUrl("/prjBusDatabaseRelation/listAllTablesByDB"),
            //     method: "get",
            //     params: this.$http.adornParams({
            //     tableName: this.dataForm.tableName
            //     },false)
            // }).then(({data}) => {
            //     if(data && data.code === 200){
            //         this.dataList = data.result
            //     }
            // })
        },
        //表结构
        getTableStructure(data){
            this.StructureDialog = true
            this.structureList = this.projectList
            this.structureName = data.tableName

        },
        //表数据
        getTableData(data){
            this.tableDataVisible = true
            this.structureName = data.tableName
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
        resetForm(formName){
            this.dataForm = {
                tableName:'',
                database:''
            }
            this.$refs[formName].resetFields()
        }
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
}
</style>