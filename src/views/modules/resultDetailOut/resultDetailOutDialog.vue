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
                        <el-select v-model="exportForm.hospId" placeholder="请选择" multiple @change="(val)=>checkChange(val)">
                            <el-checkbox  v-model="checked" @change="selectAll" style="padding-left: 20px;">全选</el-checkbox>
                            <el-option
                                v-for="item in hospitalTableData"
                                :key="item['医院编码']"
                                :label="item['医院名称']"
                                :value="item['医院编码']"
                               >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="warning" @click="exportClick('exportForm')" :loading="loading">导出</el-button>
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
 import { exportZip } from '@/utils'
export default {
    props: [
        'getData'
    ],
    data() {
        return {
            loading: false,
            checked: false, // 全选状态
            dialogVisible: false,
            exportForm: {
                hospId: [],
                hospName: [],
                batchId: ''
            },
            hospitalTableData:[],
            exportFormRules: {
                hospId: [
                    { required: true, message: '请选择医院'},
                ],
            },
            batchItem: {},
            searchHospitalForm: {
                hospitalName: '',
                hospitalType: '',
                pageCount: 1,
                pageSize: 10000
            },
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
        checkChange (val) {
            this.exportForm.hospName = [];
            // 判断是否为全选状态
            if (val.length == this.hospitalTableData.length) {
                this.checked = true
            } else {
                this.checked = false
            }
            for(let i=0;i<=val.length-1;i++){
                this.hospitalTableData.find((item)=>{ //这里的options就是数据源
                    if(item['医院编码'] == val[i]){
                        this.exportForm.hospName.push(item['医院名称'])
                    }
                });
            }
        },
        // 全选
        selectAll () {
            this.exportForm.hospId = [];
            if (this.checked) {
                this.hospitalTableData.map(i => {
                    this.exportForm.hospId.push(i['医院编码'])
                })
            } else {
                this.exportForm.hospId = [];
            }
        },
        // 获取医院列表
        getHospital () {
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl("/hospitalBasicInfo/getPageList"),
                method: 'get',
                params:  this.$http.adornParams(this.searchHospitalForm, false)
            }).then(({data}) => {
                if (data.code == 200) {
                    this.hospitalTableData = data.result.records;
                }
            }).catch(() => {
                // this.tableLoading = false
            })
        },
        // 导出
        exportClick (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$http.post(this.$http.adornUrl('/ruleResult/exportResult'), this.exportForm, { responseType: "blob", headers: { 'Content-Type': 'application/json; application/octet-stream'} } ).then((response) => {
                        exportZip(response, '结果明细')
                        this.loading = false;
                        this.$message({
                            // message: data.message,
                            message: '导出成功',
                            type: 'success',
                            duration: 1500,
                        })
                        this.dialogVisible = false
                     })
                    this.reSet();
                }
            })
        },
        handleClose () {
            this.dialogVisible = false
            this.reSet();
        },
        cancel () {
            this.dialogVisible = false;
            this.reSet();
           
        },
        reSet () {
            this.exportForm = {
                hospId: [],
                hospName: [],
                batchId: ''
            };
            this.checked = false

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
    >>> .el-cascader-menu {
        overflow: unset !important;
        min-width: 200px;
    }
    >>> .el-cascader-menu__wrap {
        overflow: unset !important;
    }
    .result-detail-out {
        /deep/ .el-input {
            min-width: 315px;
        }
    }

   
  
}
</style>