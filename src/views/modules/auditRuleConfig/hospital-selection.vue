<template>
    <div class="detail-box">
        <el-dialog
            ref="hospitalSelection"
            title="选择医院"
            :visible.sync="innerVisible"
            :close-on-click-modal="false"
            width="900px"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="hospital-selection">
                <div class="seachbox">
                    <el-form ref="searchHospitalForm" :model="searchHospitalForm" :inline="true">
                        <el-form-item label="医院名称：">
                            <el-input v-model="searchHospitalForm.hospitalName" clearable placeholder="请输入医院名称"></el-input>
                        </el-form-item>
                        <el-form-item label="医院类别：">
                            <el-select v-model="searchHospitalForm.hospitalType"  placeholder="请选择" clearable>
                                <el-option label="三级甲等" value="三级甲等"></el-option>
                                <el-option label="三级乙等" value="三级乙等"></el-option>
                                <el-option label="三级丙等" value="三级丙等"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onQuery">查询</el-button>
                            <el-button type="info" @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="hospital-selection-table">
                    <!-- 默认全选 -->
                    <el-table
                        v-loading="tableLoading"
                        ref="hospitalSelectionTable"
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
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('form')" :loading="loading" size="small">确 定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: [
        'getData'
    ],
    data() {
        return {
            loading: false,
            innerVisible: false,
            tableLoading: false,
            searchHospitalForm: {
                hospitalName: '',
                hospitalType: '',
                pageCount: 1,
                pageSize: 10000
            },
            tableData: [],
            tablePositionKey: [
                {dataname:'医院名称' , label:'医院名称' , issortable:false , type:''},
                {dataname:'医院编码' , label:'医院编码' , issortable:false , type:''},
                {dataname:'医院性质' , label:'医院性质' , issortable:false , type:''},
                {dataname:'医院类别' , label:'医院类别' , issortable:false , type:''},
            ],
            type: '',
            checkHospitalList: [], // 选中的医院列表
            checkRuleData: [] // 选中的规则列表
        }
    },
    methods: {
        //默认打开页面
        showDialog(checkRuleData,type, d) {
            this.innerVisible = true;
            this.type = type;
            this.checkRuleData = checkRuleData;
            this.getHospital()
            
            
        },
        mounted () {

        },
        // 获取医院列表
        getHospital () {
            this.tableLoading = true;
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl("/hospitalBasicInfo/getPageList"),
                method: 'get',
                params:  this.$http.adornParams(this.searchHospitalForm, false)
            }).then(({data}) => {
                this.tableLoading = false
                if (data.code == 200) {
                    this.tableData = data.result.records 
                    this.$refs.hospitalSelectionTable.toggleAllSelection(this.tableData)
                }
            }).catch(() => {
                this.tableLoading = false
            })
        },
       
        handleClose () {
            this.innerVisible = false;
            this.$parent.showDialog(this.checkRuleData,this.type);
        },
        handleSelectionChange (val) {
            this.checkHospitalList = val

        },
        onSubmit (formName) {
            this.innerVisible = false;
            this.$parent.showDialog(this.checkRuleData,this.type, this.checkHospitalList);
            this.$parent.setHospital(this.checkHospitalList); // 回显医院名称
        },
        onQuery () {
            this.getHospital()
        },
        onReset () {
            this.searchHospitalForm.hospitalName = '' 
            this.searchHospitalForm.hospitalType = '' 

        },
        cancel () {
            this.innerVisible = false;
            this.$parent.showDialog(this.checkRuleData,this.type);
           
        }
    },
    watch : {
    }
}
</script>

<style scoped lang="scss">
.detail-box {
    /deep/ .el-dialog__header {
        border-bottom: 1px solid #ddd;
        text-align: left;
    }
    /deep/ .el-dialog__footer {
        text-align: center;
    }
    .rule-tree-box {
        display: flex;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
}
</style>