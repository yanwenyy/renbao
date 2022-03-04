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
                            <el-input v-model="searchHospitalForm.name" clearable placeholder="请输入医院名称"></el-input>
                        </el-form-item>
                        <el-form-item label="医院类别：">
                            <el-select v-model="searchHospitalForm.type"  placeholder="请选择" clearable>
                                <el-option label="一级医院" :value=1></el-option>
                                <el-option label="二级医院" :value=2></el-option>
                                <el-option label="三级医院" :value=3></el-option>
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
                name: '',
                type: 1
            },
            tableData: [],
            tablePositionKey: [
                {dataname:'q1' , label:'医院名称' , issortable:false , type:''},
                {dataname:'q2' , label:'医院编码' , issortable:false , type:''},
                {dataname:'q3' , label:'医院性质' , issortable:false , type:''},
                {dataname:'q4' , label:'医院类别' , issortable:false , type:''},
            ],
            type: '',
        }
    },
    methods: {
        //默认打开页面
        showDialog(type, d) {
            this.innerVisible = true;
            this.type = type
            
        },
       
        handleClose () {
            this.innerVisible = false;
            this.$parent.showDialog(this.type);
        },
        handleSelectionChange (val) {
            console.log(val, 'valvalval')

        },
        onSubmit (formName) {
            
        },
        onQuery () {

        },
        onReset () {

        },
        cancel () {
            this.innerVisible = false;
            this.$parent.showDialog(this.type);
           
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