<template>
    <div class="detail-box">
        <el-dialog
            ref="ruleOperation"
            title="规则运行"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="rule-operation">
                <el-form size="small" ref="ruleOperationForm" :model="ruleOperationForm" :rules="ruleOperationFormRules" label-width="130px" style="text-align: left" class="rule-form-inline">
                    <el-form-item 
                        label="选择开始执行时间"
                        prop="startTime"
                        v-if="type == 'timing'"
                    >
                        <el-date-picker
                            v-model="ruleOperationForm.expectedBeginTime"
                            type="date"
                            format="yyyy/MM/dd"
                            value-format="yyyy-MM-dd"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item 
                        label="选择医院"
                        prop="hospital"
                    >
                        <el-input class="size" :disabled="true" placeholder="请选择医院"  v-model="ruleOperationForm.hospital" autocomplete="off"></el-input>
                        <el-button type="primary" @click="changeHospital">选择</el-button>
                    </el-form-item>
                    <el-form-item 
                        label="批次名称"
                        prop="batchName"
                    >
                        <el-input class="size"  v-model="ruleOperationForm.batchName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="备注"
                        prop="batchRemark"
                    >
                        <el-input class="size"  v-model="ruleOperationForm.batchRemark" autocomplete="off"  type="textarea" :autosize="{ minRows: 4}"></el-input>
                    </el-form-item>
                   
                </el-form>
               
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('ruleOperationForm')" :loading="loading" size="small">确 定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
               
            </span>
        </el-dialog>
        <hospital-selection ref="hospitalSelection"></hospital-selection>
    </div>
</template>
<script>
import hospitalSelection from './hospital-selection.vue' // 选择医院弹框
export default {
    props: [
        'getData'
    ],
    data() {
        return {
            loading: false,
            dialogVisible: false,
            ruleOperationForm: {
                expectedBeginTime: '',
                hospital: '',
                batchName: '',
                batchRemark: '',
                hospitalCode: '',
                hospitalName: '',
                ruleId: '',
                runtype: ''

            },
            ruleOperationFormRules: {
                batchName: [
                    { required: true, message: '请输入批次名称'},
                ],
                hospital: [
                     { required: true, message: '请选择医院'},
                ]
            },
            type: '',
            checkRuleData: []
        }
    },
    methods: {
        //默认打开页面
        showDialog(checkRuleData,type,checkHospitalList, ruleOperationForm, hospitalBack ) {
            this.reset();
            this.dialogVisible = true;
            this.type = type;
            this.checkRuleData = checkRuleData;
            let ruleId = [];
            this.checkRuleData.map(i => {
                ruleId.push(i.ruleId)
            })
            this.ruleOperationForm.ruleId = ruleId.join(',')
            this.ruleOperationForm.runtype = this.type == 'timing' ? 2 : 1; // runtype 1是立即运行 2是定时运行
            // 判断从医院弹框返回重新给表单内容赋值
            if (hospitalBack) {
                this.ruleOperationForm = ruleOperationForm
            }
            
        },
        changeHospital () {
            // this.dialogVisible = false
            this.$refs.hospitalSelection.showDialog(this.checkRuleData,this.type, this.ruleOperationForm)
        },
        reset () {
            this.ruleOperationForm = {
                expectedBeginTime: '',
                hospital: '',
                batchName: '',
                batchRemark: '',
                hospitalCode: '',
                hospitalName: '',
                ruleId: ''
            };
        },
      
        handleClose () {
            this.resetForm();
            this.dialogVisible = false
        },
        onSubmit (formName) {
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleOperationForm, '表单数据')
                    this.loading = true
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl('/rule/timerRunNowBySh'),
                        method: 'post',
                        data:  this.$http.adornData(this.ruleOperationForm, false)
                    }).then(({data}) => {
                        // this.btnLoading = false;
                        if (data.code == 200) {
                            // this.$message({
                            //     message: '执行成功',
                            //     type: 'success',
                            //     duration: 1500,
                            // })
                            this.loading = false
                            this.$alert('请在审核执行监控中查看运行详情', {
                                confirmButtonText: '关闭',
                                callback: action => {
                                    this.dialogVisible = false;
                                    this.$parent.setTableChecked()
                                }
                            });
                        } else {
                            this.$message({
                                message: '执行失败',
                                type: 'error',
                                duration: 1500,
                            })
                            this.loading = false
                        }
                    }).catch(() => {
                        this.loading = false
                    })  
                }
            }) 
        },
        setHospital (checkHospitalList) {
            let hospitalName = [];
            let hospitalCode = [];
            checkHospitalList.map(i => {
                hospitalName.push(i['医院名称'])
                hospitalCode.push(i['医院编码'])
            })
            this.ruleOperationForm.hospital = hospitalName.join(',');
            this.ruleOperationForm.hospitalName = hospitalName.join(',');
            this.ruleOperationForm.hospitalCode = hospitalCode.join(',');
        },
        cancel () {
            this.resetForm();
            this.dialogVisible = false;
           
        },
        resetForm(formName) {
            this.$refs['ruleOperationForm'].resetFields();
        }
    },
    components: {
        hospitalSelection
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
    .rule-form-inline {
        /deep/ .el-textarea{
            width: 350px;
        }
        /deep/ .el-input{
            width: 280px;
        }

    }
}
</style>