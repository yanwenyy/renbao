<template>
    <div class="detail-box">
        <el-dialog
            ref="resultDetailOutDialog"
            title="结果明细导出"
            width="700px"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="result-detail-out">
                <el-form ref="exportForm" :model="exportForm" :rules="exportFormRules"   :inline="true">
                    <el-form-item prop="hospital" label="选择医院：">
                        <el-select v-model="exportForm.hospital" multiple placeholder="请选择医院" clearable>
                            <el-option
                                v-for="item in hospitalTableData"
                                :key="item['医院编码']"
                                :label="item['医院名称']"
                                :value="item['医院编码']">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="exportClick('exportForm')" :loading="loading">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button type="primary" @click="onSubmit('form')" :loading="loading" size="small">确 定</el-button> -->
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
            dialogVisible: false,
            exportForm: {
                hospital: [],
                batchId: ''
            },
            hospitalTableData:[],
            exportFormRules: {
                hospital: [
                    { required: true, message: '请选择医院'},
                ],
            },
            batchItem: {}
        }
    },
    methods: {
        //默认打开页面
        showDialog(batchItem) {
            // this.searchForm={hospital: []};
            this.getHospital();
            this.dialogVisible = true;
            this.batchItem = batchItem
            this.exportForm.batchId = batchItem.batchId
            // this.exportForm.batchId = '6998b4b9-f2ef-4b7f-b945-3f353e773655'
        },
        // 获取医院列表
        getHospital () {
            // this.tableLoading = true;
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl("/hospitalBasicInfo/getPageList"),
                method: 'get',
                params:  this.$http.adornParams(this.searchHospitalForm, false)
            }).then(({data}) => {
                // this.tableLoading = false
                if (data.code == 200) {
                    this.hospitalTableData = data.result.records;
                    console.log(this.hospitalTableData, '医院列表')
                }
            }).catch(() => {
                // this.tableLoading = false
            })
        },
        // 导出
        exportClick (formName) {
            // window.location.href = this.$http.adornUrl('/ruleResult/exportResult')



            // this.$refs[formName].validate((valid) => {
                // if (valid) {
                    // this.loading = true
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl('/ruleResult/exportResult'),
                        method: 'post',
                        data:  this.$http.adornData(this.exportForm, false)
                    }).then(({data}) => {
                        // this.btnLoading = false;
                        if (data.code == 200) {
                            this.loading = false;
                            this.$message({
                                message: '导出成功',
                                type: 'success',
                                duration: 1500,
                            })
                            this.dialogVisible = false
                        } else {
                            this.$message({
                                message: '导出失败',
                                type: 'error',
                                duration: 1500,
                            })
                        }
                    }).catch(() => {
                        this.loading = false
                    })  
                // }
            // })
        },
        handleClose () {
            this.dialogVisible = false
        },
        onSubmit (formName) {
            console.log(this.ruleOperationForm, '表单数据')
            
            
        },
        cancel () {
            this.dialogVisible = false;
           
        }
    },
    components: {
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
    .result-detail-out {
        /deep/ .el-select__tags,.el-select {
            width: 300px !important;
            max-width: unset !important;
        }

    }
   
  
}
</style>