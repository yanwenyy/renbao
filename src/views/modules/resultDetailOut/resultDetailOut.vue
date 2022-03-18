<template>
    <div class="box">
        <div class="resultDetailsExport-left">
            <el-tree :data="batchTreeList" highlight-current :default-expand-all="true" v-loading="treeLoading" node-key="id" ref="treesa" :props="layoutTreeProps">
                    <span class="custom-tree-node" slot-scope="{ node, data }" @click="nodeClick(node, data)">
                        <span :title="node.label">
                            {{node.label}}
                        </span>
                    </span>
            </el-tree>
        </div>
        <div class="resultDetailsExport-right">
            <div class="search-box">
                <el-form ref="searchForm" :model="searchForm" :inline="true">
                    <el-form-item label="规则名称：">
                        <el-input v-model="searchForm.ruleName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="规则类型：">
                        <el-select v-model="searchForm.ruleCategory"  placeholder="请选择" clearable>
                            <el-option label="门诊规则" :value=1></el-option>
                            <el-option label="住院规则" :value=2></el-option>
                        </el-select>
                    </el-form-item>
                   
                    <el-form-item>
                        <el-button type="primary" @click="onQuery">查询</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
          
            <div class="table-box">
                <div class="option-box">
                    <el-button size="small" type="danger" @click="deleteFn">删除</el-button>
                    <el-button size="small" type="primary" @click="resultDetailsExportClick">结果明细导出</el-button>
                </div>
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
                                    <span class="result-view-text" @click="resultViewClick(scope.row)" >查看明细</span>
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
        <!--查看详细弹窗 -->
        <!-- <el-dialog
            :visible.sync="showDetailDialog"
            title="查看结果明细"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="90%"
            :close-on-press-escape="false"
        >
            <detail
                @close="closeDetail"
                @ok="editSucceed"
                :info="info"
                :resultTableName="resultTableName"
                v-if="showDetailDialog"
            ></detail>
        </el-dialog> -->
        <view-details ref="viewDetails"></view-details>
    </div>
</template>
<script>
import resultDetailOutDialog from './resultDetailOutDialog.vue'
import viewDetails from './viewDetails.vue'
export default {
    data () {
        return {
            treeLoading: false,
            tableLoading: false,
            batchTreeList: [{
                label: '批次名称',
                children: []
            }],
            searchForm: {
                ruleCategory: '',
                ruleName: ''

            },
            tableData: [],
            tablePositionKey: [
                {dataname:'ruleName' , label:'规则名称' , issortable:false , type:'', minWidth: 100},
                {dataname:'dealRuleType' , label:'规则类别' , issortable:false , type:''},
                {dataname:'expectedBeginTime' , label:'开始时间' , issortable:false , type:'', minWidth: 160},
                {dataname:'actualBeginTime' , label:'结束时间' , issortable:false , type:'', minWidth: 160},
                {dataname:'resultCount' , label:'结果条数' , issortable:false , type:''},
                {dataname:'actualEndTime' , label:'执行人' , issortable:false , type:''},
                {dataname:'q5' , label:'操作' , issortable:false , type:'option',  minWidth: 120},
            ],
            Pager: {
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            multipleTable: [],
            layoutTreeProps: {
                label(data, node) {
                    const config = data.__config__ || data
                    return  config.label || config.batchName
                },
            },
            batchItem: {},
        }
    },
    activated () {
        this.getbatchList();
        // this.getTableData()
    },
    methods: {
        nodeClick (node,data) {
            this.batchItem = data;
            this.getTableData()
        },
        onQuery () {
            this.Pager.pageIndex = 1;
            this.getTableData()
        },
        onReset () {
            this.searchForm.ruleCategory = '';
            this.searchForm.ruleName = '';
            this.Pager.pageIndex = 1;
            // this.$refs.treesa.setCheckedKeys([]);
            // this.$refs.treesa.setCurrentKey(null);
            // this.batchItem = {}
        },
        currentChangeHandle (val) {
            this.Pager.pageIndex = val;
            this.getTableData()
        },
        handleSelectionChange (val) {
            this.multipleTable = val;

        },
        sizeChangeHandle (val) {
            this.Pager.pageSize = val
            this.getTableData()
        },
        dealRunStatus (type) {
            if (type == 1) {
                return '待执行'
            } else if (type == 2) {
                return '执行中'
            } else if (type == 3) {
                return '执行失败'
            } else if (type == 4) {
                return '已完成'
            }

        },
        dealRuleType (ruleCategory) {
            if (ruleCategory ==1) {
                return '门诊规则'
            } else if(ruleCategory ==2) {
                return '住院规则'
            } else {
                return ''
            }
        },
        getTableData () {
            this.tableLoading = true;
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl(`/ruleResult/selectPageByRuleResult?pageNo=${this.Pager.pageIndex}&pageSize=${this.Pager.pageSize}`),
                method: 'get',
                params:  this.$http.adornParams({
                    batchId: this.batchItem && this.batchItem.batchId ? this.batchItem.batchId : '',
                    ruleName: this.searchForm.ruleName,
                    ruleCategory: this.searchForm.ruleCategory,
                    batchType: 2
                }, false)
            }).then(({data}) => {
                this.tableLoading = false
                if (data.code == 200) {
                    data.result.records.map(i => {
                        // i.ruleName = i.rule && i.rule.ruleName || ''
                        i.dealRuleType = this.dealRuleType(i.ruleCategory)
                        i.expectedBeginTime = i.expectedBeginTime && i.expectedBeginTime.split('T')[0] || '';
                        i.actualBeginTime = i.actualBeginTime && i.actualBeginTime.split('T')[0] || '';
                        i.expectedEndTime = i.expectedEndTime && i.expectedEndTime.split('T')[0] || '';
                        i.actualEndTime = i.actualEndTime && i.actualEndTime.split('T')[0] || '';
                        i.runStatusName = this.dealRunStatus(i.runStatus)
                    })
                    this.tableData = data.result.records;
                    this.Pager.pageSize = data.result.size;
                    this.Pager.pageIndex = data.result.current;
                    this.Pager.total = data.result.total;  
                } else {
                    this.tableData = [];
                    this.Pager.pageIndex =1;
                    this.Pager.total = 0; 
                    this.$message.warning(data.message)
                    this.tableLoading = false
                }
            }).catch(() => {
                this.tableLoading = false
            })
        },
        // 列表查看
        resultViewClick (data) {
            // this.$refs.resultView.showDialog(data)
            // this.info = data.resultId;
            // this.resultTableName = data.resultTableName
            // console.log(data.resultTableName, 'data.resultTableNamedata.resultTableName')
            // this.showDetailDialog = true;
            this.$refs.viewDetails.showDialog(data);
        },
        resultDetailsExportClick () {
            if( !this.batchItem.batchId ) return this.$message({message: '请选择对应的批次',type: 'warning'});
            this.$refs.resultDetailOutDialog.showDialog(this.batchItem)
        },
       
        deleteFn () {
            if( this.multipleTable.length === 0 ) return this.$message({message: '请选择至少一条数据',type: 'warning'});
            var deleteList = []
            this.multipleTable.forEach( item =>{
                deleteList.push( item.resultId )
            })
            this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$http({
                    isLoading:false,
                    url: this.$http.adornUrl('ruleResult/deleteByIds'),
                    method: 'DELETE',
                    data: this.$http.adornData( deleteList, false)
                }).then(({data}) => {
                    if (data && data.code === 200) {
                    this.$message({message: '删除成功',type: 'success',})
                    this.Pager.pageIndex = 1;
                    this.Pager.pageSize = 10;
                    this.getTableData();
                    this.setTableChecked();
                    } else {
                    this.$message.error(data.msg)
                    }
            })
            }).catch(() => {})
        },
        getbatchList () {
            this.treeLoading = true;
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl('/batch/selectList'),
                method: 'get',
                params:  this.$http.adornParams({batchType: 2}, false)
            }).then(({data}) => {
                this.treeLoading = false;
                if (data.code == 200) {
                    this.batchTreeList[0].children = data.result
                }
            }).catch(() => {
                this.treeLoading = false;
            })
        },
        setTableChecked () {
            this.$refs.multipleTable.clearSelection(this.multipleTable);
            this.multipleTable = [];
        },
        // 关闭详细弹窗
        closeDetail() {
            this.showDetailDialog = false;
        },
        // 关闭弹窗确认
        editSucceed() {
            this.closeDetail();
        },
    },
    components: {
        resultDetailOutDialog,
        viewDetails
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
        // min-height: calc(100vh - 165px);
        // margin-right: 20px;
        height: 75vh;
        border: 1px solid #ddd;
        overflow: auto;
        min-width: 300px;
        /deep/ .el-tree {
            min-height: 70vh;
        }
        /deep/ .el-tree-node__children .custom-tree-node{
            padding: 0 5px;
            text-decoration: underline;
            color: #0000FF;
            width: 100%;
            display: inline-block;
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
        }
        /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
            background-color: #e3edfa;

        }
    }
    .resultDetailsExport-right {
        flex: 1;
        border: none;
        height: 75vh;
        overflow: auto;
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