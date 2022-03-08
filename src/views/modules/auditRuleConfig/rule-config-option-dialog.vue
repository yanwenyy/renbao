<template>
    <div class="detail-box">
        <el-drawer
            ref="ruleConfigOptionDialog"
            :visible.sync="dialogVisible"
            :direction="direction"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="rule-operation">
                <el-form size="small" ref="ruleOperationForm" :model="ruleOperationForm" :rules="ruleOperationFormRules" label-width="130px" style="text-align: left" class="rule-form-inline">
                    <el-form-item 
                        label="规则名称"
                        prop="startTime"
                    >
                        <el-input class="size"  v-model="ruleOperationForm.ruleName" autocomplete="off" clearable></el-input>
                    </el-form-item>
                  
                    <el-form-item label="规则类型：">
                        <el-select v-model="ruleOperationForm.ruleCategory"  placeholder="请选择" clearable>
                            <el-option label="门诊审核规则" value="1"></el-option>
                            <el-option label="住院审核规则" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则：">
                        
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