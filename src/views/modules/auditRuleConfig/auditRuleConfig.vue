<template>
    <div class="box">
        <div class="auditRuleConfig-left">
            <rule-tree ref="ruleTree" :isShowSearch="false" :isShowCheckBox="false" :isShowEdit="false" parentGetTreeData="getTreeData" :folderSorts="folderSorts" ></rule-tree>
        </div>
        <div class="auditRuleConfig-right">
            <div class="search-box"> 
                <el-form ref="searchForm" :model="searchForm" :inline="true">
                    <el-form-item label="审核规则名称：">
                        <el-input v-model="searchForm.ruleName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="审核规则类别：">
                        <el-select v-model="searchForm.ruleCategory"  placeholder="请选择" clearable>
                            <el-option label="门诊规则" value="1"></el-option>
                            <el-option label="住院规则" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryClick">查询</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="primary" class="search-right-btn" @click="submitgxhgz">提交至地区个性化规则</el-button>
            </div>
            <div class="rule-table">
                <div class="rule-table-btn">
                    <el-button size="small" type="primary"  @click="addFun">新增</el-button>
                    <el-button size="small" type="primary"  @click="editorFun">编辑</el-button>
                    <el-button size="small" type="danger"  @click="deleteFn">删除</el-button>
                </div>
                <div class="table-box">
                    <el-table
                        v-loading="tableLoading"
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :row-key="getRowKeys"
                        @selection-change="handleSelectionChange">
                         <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                        <el-table-column
                            v-for="( items , index ) in tablePositionKey"
                            :prop="items.dataname"
                            :key="index"
                            :label="items.label"
                            :sortable="items.issortable"
                            :min-width="items.minWidth"
                            :align="items.align ? items.align : 'center'"
                            :width="items.width">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="auditRuleConfig-right-bottom">
                    <el-pagination
                        v-if="Pager.total>=1"
                        @size-change="sizeChangeHandle"
                        @current-change="currentChangeHandle"
                        :current-page="Pager.pageIndex"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="Pager.pageSize"
                        :total="Pager.total"
                        layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                    <div class="optipn"  v-if="Pager.total>=1">
                        <el-button-group>
                            <el-button>当前选择规则数量：{{multipleTable.length}}</el-button>
                            <el-button @click="executeImmediatelyClick">立即执行</el-button>
                            <el-button @click="timedExecutionClick">定时执行</el-button>
                            <el-popover
                                placement="top"
                                width="400"
                                v-if="multipleTable.length>0"
                                trigger="click">
                                <p v-for="(i, k) in multipleTable" :key="k">{{i.ruleName}}</p>
                                <el-button slot="reference">当前所选规则</el-button>
                            </el-popover>
                            <el-button v-else>当前所选规则</el-button>
                        </el-button-group>
                    </div>
                </div>
            </div>
        </div>
        <submit-personality-rule ref="submitPersonalityRule"></submit-personality-rule>
        <rule-operation ref="ruleOperation"></rule-operation>
        <rule-config-option-dialog ref="ruleConfigDialog"></rule-config-option-dialog>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getSelectPage" :ruleData="treeData" ></add-or-update>
    </div>
</template>
<script>
import submitPersonalityRule from './submit-personality-rule.vue'// 提交至地区个性化规则弹框
import ruleOperation from './rule-operation.vue' // 规则运行弹框
import ruleTree from '../../common/rule-tree.vue'
import ruleConfigOptionDialog from './rule-config-option-dialog.vue'
import AddOrUpdate from '../../modules/data/rule-add-or-update.vue'
export default {
    data () {
        return {
            treeLoading: false,
            tableLoading: false,
            searchForm: {
                ruleName: '',
                ruleCategory: '',
                folderPath: '',
                folderId: ''
            },
            tableData: [],
            tablePositionKey: [
                {dataname:'ruleName' , label:'审核规则名称' , issortable:false , type:''},
                {dataname:'ruleCategory' , label:'审核规则类别' , issortable:false , type:''},
                {dataname:'createUserName' , label:'创建人' , issortable:false , type:''},
                {dataname:'createTime' , label:'创建时间' , issortable:false , type:''},
            ],
            Pager: {
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            multipleTable: [],
            // copyTableData: [],
            getRowKeys(row) {
                return row.ruleId;
            },
            treeData: [],
            addOrUpdateVisible: false,
            folderSorts: 3
        }
    },
    activated () {
        this.getSelectPage();
        // this.getRuleFolder();
    },
    created () {
        this.getRuleFolder();
    },
    methods: {
        getSelectPage () {
            this.tableLoading = true;
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl(`/rule/selectPage?pageNo=${this.Pager.pageIndex}&pageSize=${this.Pager.pageSize}`),
                method: 'get',
                params:  this.$http.adornParams(this.searchForm, false)
            }).then(({data}) => {
                this.tableLoading = false
                if (data.code == 200) {
                    data.result.records.map(i => {
                        i.createTime = i.createTime.split('T')[0];
                        i.ruleCategory = i.ruleCategory == 1 ? '门诊规则':  i.ruleCategory == 2 ? '住院规则' : ''
                    })
                    this.tableData = data.result.records;
                    this.Pager.pageSize = data.result.size;
                    this.Pager.pageIndex = data.result.current;
                    this.Pager.total = data.result.total;  
                }
            }).catch(() => {
                this.tableLoading = false
            })

        },
        // 获取规则树
        getRuleFolder () {
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl('/ruleFolder/getRuleFolder'),
                method: 'get',
                params:  this.$http.adornParams({folderSorts: this.folderSorts,projectId:this.projectId}, false)
                // params:  this.$http.adornParams({}, false)
            }).then(({data}) => {
               
                if (data.code == 200) {
                    this.treeData = data.result;
                    console.log(this.treeData, '规则树')
                }
            }).catch(() => {
                
            })
        },
        getTreeData (data) {
            // 规则列表有子节点时folderId为空
            this.$refs.multipleTable.clearSelection(this.multipleTable);
            this.multipleTable = [];
            this.searchForm.folderPath = data.folderPath && data.folderPath || '';
            this.searchForm.folderId = data.folderId && data.folderId || '';
            if (data.children) {
                this.searchForm.folderId = '';
            }
            this.getSelectPage();
        },
        queryClick () {
            this.getSelectPage();
        },
        onReset () {
            this.searchForm.ruleName = '';
            this.searchForm.ruleCategory = '';
            this.Pager.pageIndex =1;
            // 调用规则树的重置方法
            // this.$refs.ruleTree.clearCheckedKeys();
            // this.searchForm.folderPath = '';
            // this.searchForm.folderId = '';
            
        },
        addFun () {
            // this.$refs.ruleConfigDialog.showDialog([], this.treeData, 'add');
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init()
            })
        },
        editorFun () {
            if( this.multipleTable.length != 1 ) return this.$message({message: '请选择一条数据进行编辑',type: 'warning'});
            // this.$refs.ruleConfigDialog.showDialog(this.multipleTable, this.treeData, 'edit');
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
            this.$refs.addOrUpdate.init(this.multipleTable[0].ruleId)
            })

        },
        deleteFn () {
            if( this.multipleTable.length === 0 ) return this.$message({message: '请选择至少一条数据',type: 'warning'});
            var deleteList = []
            this.multipleTable.forEach( item =>{
                deleteList.push( item.ruleId )
            })
            this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$http({
                    isLoading:false,
                    url: this.$http.adornUrl('/rule/deleteByIds'),
                    method: 'DELETE',
                    data: this.$http.adornData(deleteList, false)
                }).then(({data}) => {
                    if (data && data.code === 200) {
                    this.$message({message: '删除成功',type: 'success',})
                    this.Pager.pageIndex = 1;
                    this.Pager.pageSize = 10;
                    this.getSelectPage();
                    this.setTableChecked();
                    // this.multipleTable = []
                    } else {
                    this.$message.error(data.msg)
                    }
            })
            }).catch(() => {})
        },
        handleSelectionChange (rows) {
            this.multipleTable = rows;
        },
        setTableChecked () {
            this.$refs.multipleTable.clearSelection(this.multipleTable);
            this.multipleTable = [];
        },
        sizeChangeHandle (val) {
            this.Pager.pageSize = val
            this.getSelectPage();
        },

        currentChangeHandle (val) {
            this.Pager.pageIndex = val
            this.getSelectPage();
        },
        // 提交个性化规则
        submitgxhgz () {
            if( this.multipleTable.length != 1 ) return this.$message({message: '请选择一条数据进行操作',type: 'warning'});
            this.$refs.submitPersonalityRule.showDialog(this.multipleTable)
        },
        // 立即执行
        executeImmediatelyClick () {
            if( this.multipleTable.length === 0 ) return this.$message({message: '请选择至少一条数据',type: 'warning'});
            this.$refs.ruleOperation.showDialog( this.multipleTable,'immediately', [], {});
        },
        // 定时执行
        timedExecutionClick () {
            if( this.multipleTable.length === 0 ) return this.$message({message: '请选择至少一条数据',type: 'warning'});
            this.$refs.ruleOperation.showDialog(this.multipleTable,'timing', [], {});
        }
    },
    computed: {
      projectId: {
        get () {
          if(this.$store.state.common.projectId){
            return this.$store.state.common.projectId
          }else{
            this.$http({
              url: this.$http.adornUrl("/xmProject/selectProjectByUserId"),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 200) {
                return data.result.projectId;
              }
            });
          }

        }
      },
    },
    components: {
        submitPersonalityRule,
        ruleOperation,
        ruleTree,
        ruleConfigOptionDialog,
        AddOrUpdate
    },
    watch: {
        projectId (nval, oval) {
            if (nval) {
                this.getRuleFolder()
            }

        }

    }
}

</script>
<style scoped lang="scss">
.box {
    width: 100%;
    display: flex;
    min-width: 800px;
    // overflow-x: auto;
    .auditRuleConfig-left {
        width: 300px;
        // min-height: 100vh;
        // min-height: calc(100vh - 165px);
        // margin-right: 20px;
        height: 75vh;
        border: 1px solid #ddd;
        overflow: auto;
        min-width: 300px;
        padding: 10px 0 0 10px;
        /deep/ .el-tree {
            min-height: 70vh;
        }

    }
    .auditRuleConfig-right {
        flex: 1;
        border: none;
        height: 75vh;
        overflow: auto;
        // 
        .search-box {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
            padding-left: 20px;
            // padding-right: 109px;
        }
        .search-right-btn {
            // display: flex;
            width: 183px;
            // align-self: flex-end;
        }
        .rule-table {
            padding: 20px 20px 0 20px;
        }
        .table-box {
            margin-top: 10px;
        }
        .auditRuleConfig-right-bottom {
            // display: flex;
            // justify-content: space-between;
            // align-items: center;
        }
        .optipn{
            margin-top: 20px;
            /deep/ button {
                height: 50px;
                // line-height: 45px;
            }
            /deep/ button span {
                // max-width: 100px;
                // height: unset;
                // display: inline-block;
                // word-wrap: break-word !important;
                // word-break: break-all !important;
                // white-space: normal !important;
                // text-align: left;
            }

        }
    }

}

</style>