<template>
    <div class="box">
        <div class="resultDetailsExport-left">
            <el-tree :data="batchTreeList" highlight-current :default-expand-all="true" @node-click="treeClick" v-loading="treeLoading" node-key="id" ref="treesa" >
                    <span class="custom-tree-node" slot-scope="{ node }" >
                        <span>
                            {{node.label}}
                        </span>
                    </span>
            </el-tree>
        </div>
        <div class="resultDetailsExport-right">
            <div class="search-box">
                <el-form ref="searchForm" :model="searchForm" :inline="true">
                    <el-form-item label="规则名称：">
                        <el-input v-model="searchForm.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="规则类型：">
                        <el-select v-model="searchForm.type"  placeholder="请选择" clearable>
                            <el-option label="门诊规则" value="shanghai"></el-option>
                            <el-option label="住院规则" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                   
                    <el-form-item>
                        <el-button type="primary" @click="onQuery">查询</el-button>
                        <el-button type="info" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
          
            <div class="table-box">
                <el-button-group class="option-box">
                    <el-button size="small" type="primary" @click="deleteFn">删除</el-button>
                    <el-button size="small" type="primary" @click="resultDetailsExportClick">结果明细导出</el-button>
                </el-button-group>
                <el-table
                    v-loading="tableLoading"
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column
                        v-for="( items , index ) in tablePositionKey"
                        :prop="items.dataname"
                        :key="index"
                        :label="items.label"
                        :sortable="items.issortable"
                        :min-width="items.minWidth"
                        :align="items.align ? items.align : 'center'"
                        :width="items.width">
                        <template slot-scope="scope">
                            <div v-if="items.type=='option'">
                                <div class="operation-box">
                                    <!-- <span @click="publish(scope.row)">发表</span> -->
                                    <span class="result-view-text" @click="resultViewClick(scope.row)" v-if="scope.row.q5 == 1">查看明细</span>
                                    <span v-else>运行成功</span>
                                </div>
                            </div>
                            <div v-else>
                                <span
                                    :style="scope.row[items.dataname] == '0'?'color:#ccc':''"
                                    >
                                    {{scope.row[items.dataname]}}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="Pager.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="Pager.pageSize"
                :total="Pager.total"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
       <result-detail-out-dialog ref="resultDetailOutDialog"></result-detail-out-dialog>
        
    </div>
</template>
<script>
import resultDetailOutDialog from './resultDetailOutDialog.vue'
export default {
    data () {
        return {
            treeLoading: false,
            tableLoading: false,
            batchTreeList: [ 
                {
                    label: '批次名称',
                    children: [
                        {label: '人民医院医保数据筛查'},
                        {label: '妇幼保健院医院数据筛查'},
                        {label: '中医医院医保数据筛查'},
                        {label: '中医医院医院数据筛查'},
                    ]
                }
               
            ],
            searchForm: {
                type: '',
                name: ''

            },
            tableData: [
                {'q1': '', 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 1,},
                {'q1': 1, 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': 1, 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': '', 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': 1, 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': 1, 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': '', 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': 1, 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': 1, 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': '', 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
                {'q1': 1, 'q2': 'wef', 'q3': 'wef','q4': 'wef','q5': 'wef',},
               
               
            ],
            tablePositionKey: [
                {dataname:'q1' , label:'规则名称' , issortable:false , type:''},
                {dataname:'q2' , label:'规则类别' , issortable:false , type:''},
                {dataname:'q3' , label:'开始时间' , issortable:false , type:''},
                {dataname:'q5' , label:'结束时间' , issortable:false , type:''},
                {dataname:'q3' , label:'结果条数' , issortable:false , type:''},
                {dataname:'q4' , label:'执行人' , issortable:false , type:''},
                {dataname:'q5' , label:'操作' , issortable:false , type:'option'},
            ],
            Pager: {
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            multipleTable: [],
        }
    },
    methods: {
        treeClick (data) {

        },
        onQuery () {

        },
        onReset () {
            this.searchForm={type: '',name: ''};
        },
        currentChangeHandle (val) {
            this.Pager.pageIndex = val;
        },
        handleSelectionChange (val) {
            this.multipleTable = val

        },
        sizeChangeHandle (val) {
            this.Pager.pageSize = val
        },
        // 列表查看
        resultViewClick (data) {
            // this.$refs.resultView.showDialog(data)
            console.log('查看明细')

        },
        resultDetailsExportClick () {
            // console.log('导出弹框')
            this.$refs.resultDetailOutDialog.showDialog()
        },
       
        deleteFn () {

        }
    },
    components: {
        resultDetailOutDialog
    }
   
}

</script>
<style scoped lang="scss">
.box {
    width: 100%;
    display: flex;
    min-width: 800px;
    // overflow-x: auto;
    .resultDetailsExport-left {
        width: 300px;
        // min-height: 100vh;
        min-height: calc(100vh - 165px);
        // margin-right: 20px;
        border: 1px solid #ddd;
        overflow: auto;
        min-width: 300px;
        /deep/ .el-tree-node__children .custom-tree-node{
            text-decoration: underline;
            color: #0000FF;
        }
    }
    .resultDetailsExport-right {
        flex: 1;
        border: none;
        // padding-left: 20px;
        // 
        .search-box {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
            padding-left: 20px;
            // padding-right: 109px;
        }
        .table-box {
            margin-top: 10px;
            padding-left: 20px;
            .result-view-text {
                color: #0CBDE5;
            }
            .option-box {
                margin-bottom: 10px;
            }
        }
      
    }

}

</style>