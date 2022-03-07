<template>
    <div class="detail-box">
        <el-drawer
            ref="auditRuleConfigDialog"
            :visible.sync="dialogVisible"
            :direction="direction"
            :before-close="handleClose">
            <div class="rule-operation">
                <el-form size="small" ref="ruleOperationForm" :model="ruleOperationForm" :rules="ruleOperationFormRules" label-width="130px" style="text-align: left" class="rule-form-inline">
                    <el-form-item 
                        label="选择开始执行时间"
                        prop="startTime"
                        v-if="type == 'timing'"
                    >
                        <el-date-picker
                            v-model="ruleOperationForm.startTime"
                            type="date"
                            format="yyyy/MM/dd"
                            value-format="yyyy/MM/dd"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item 
                        label="选中医院"
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
                        prop="remarks"
                    >
                        <el-input class="size"  v-model="ruleOperationForm.remarks" autocomplete="off"  type="textarea" :autosize="{ minRows: 4}"></el-input>
                    </el-form-item>
                   
                </el-form>
               
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('form')" :loading="loading" size="small">确 定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
               
            </span>
        </el-drawer>
       
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
            direction: 'rtl',
            ruleOperationForm: {
                startTime: '',
                hospital: '',
                batchName: ''

            },
            ruleOperationFormRules: {
                batchName: [
                    { required: true, message: '请输入批次名称'},
                ],
            },
            type: '',
            checkedData: []
        }
    },
    methods: {
        //默认打开页面
        showDialog(d) {
            this.reset();
            this.dialogVisible = true;
            this.checkedData = d;
            // Object.assign(this.$data, this.$options.data()) // 全部重置
        },
        changeHospital () {
            // this.dialogVisible = false
            this.$refs.hospitalSelection.showDialog(this.type)
        },
        reset () {
            this.ruleOperationForm = {
                startTime: '',
                hospital: '',
                batchName: ''
            };
        },
      
        handleClose () {
            this.resetForm();
            this.dialogVisible = false
        },
        onSubmit (formName) {
            console.log(this.ruleOperationForm, '表单数据')
            
            
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