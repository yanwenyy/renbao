<template>
    <div class="box">
        <div class="auditRuleMonitoring-left">
            <el-tree :data="batchTreeList" highlight-current :default-expand-all="true" @node-click="treeClick" v-loading="treeLoading" node-key="id" ref="treesa" >
                    <span class="custom-tree-node" slot-scope="{ node }" >
                        <span>
                            {{node.label}}
                        </span>
                    </span>
            </el-tree>
        </div>
        <div class="auditRuleMonitoring-right">
            <div class="search-box">
                <el-form ref="searchForm" :model="searchForm" :inline="true">
                    <el-form-item label="规则类型：">
                        <el-select v-model="searchForm.type"  placeholder="请选择" clearable>
                            <el-option label="门诊规则" value="shanghai"></el-option>
                            <el-option label="住院规则" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="运行状态：">
                        <el-select v-model="searchForm.runningState"  placeholder="请选择" clearable>
                            <el-option label="已完成" :value=1></el-option>
                            <el-option label="执行中" :value=2></el-option>
                            <el-option label="执行失败" :value=3></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onQuery">查询</el-button>
                        <el-button type="info" @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
          
            <div class="table-box">
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
                                    <span class="result-view-text" @click="resultViewClick(scope.row)" v-if="scope.row.q5 == 1">结果查看</span>
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
        <result-view ref="resultView"></result-view>
        
    </div>
</template>
<script>
import resultView from './result-view.vue'
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
                runningState: ''

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
                {dataname:'q1' , label:'审核规则名称' , issortable:false , type:''},
                {dataname:'q2' , label:'审核规则类别' , issortable:false , type:''},
                {dataname:'q3' , label:'预计开始时间' , issortable:false , type:''},
                {dataname:'q4' , label:'实际开始时间' , issortable:false , type:''},
                {dataname:'q5' , label:'预计结束时间' , issortable:false , type:''},
                {dataname:'q3' , label:'实际结束时间' , issortable:false , type:''},
                {dataname:'q4' , label:'运行状态' , issortable:false , type:''},
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
    mounted () {
        this.getbatchList();
        
      
    },
    created () {

    },
    methods: {
        getbatchList () {
            // /batch/selectList

            this.$http({
                isLoading:false,
                url: this.$http.adornUrl('batch/selectList'),
                method: 'post',
                // params:  this.$http.adornData('', false)
            }).then(({data}) => {
                console.log(data, 'datadatadatadata')
                // this.tableLoading = false
                // if (data.code == 200) {
                //     data.result.records.map(i => {
                //         i.createTime = i.createTime.split('T')[0];
                //         i.ruleCategory = i.ruleCategory == 1 ? '门诊审核规则':  i.ruleCategory == 2 ? '住院审核规则' : ''
                //     })
                //     this.tableData = data.result.records;
                //     this.Pager.pageSize = data.result.size;
                //     this.Pager.pageIndex = data.result.current;
                //     this.Pager.total = data.result.total;  
                // }
            }).catch(() => {
                // this.tableLoading = false
            })

        },

        treeClick (data) {

        },
        // 列表查询
        onQuery () {

        },
        // 列表重置
        onReset () {
            this.searchForm= {type: '',runningState: ''};
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
            console.log(data, 'datadatadata')
            this.$refs.resultView.showDialog(data)

        }
    },
    components: {
        resultView
      
    }
}

</script>
<style scoped lang="scss">
.box {
    width: 100%;
    display: flex;
    min-width: 800px;
    // overflow-x: auto;
    .auditRuleMonitoring-left {
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
    .auditRuleMonitoring-right {
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
            // padding-left: 20px;
            .result-view-text {
                color: #0CBDE5;
            }
        }
      
    }

}

</style>