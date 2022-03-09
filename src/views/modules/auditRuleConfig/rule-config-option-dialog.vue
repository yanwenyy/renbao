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
                            <el-option label="门诊审核规则" :value=1></el-option>
                            <el-option label="住院审核规则" :value=2></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则：">
                        <el-select v-model="ruleOperationForm.mineStatus" placeholder="请选择" multiple collapse-tags>
                            <el-option :value="ruleOperationForm.mineStatus" style="height: auto">
                                <el-tree :data="treedata" default-expand-all show-checkbox check-strictly 
                                    ref="treeSelect" highlight-current :props="defaultProps"
                                    @check-change="handleCheckChange"></el-tree>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建人：">
                        <el-input class="size"  v-model="createUserName" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间：">
                        <el-input class="size" v-model="ruleOperationForm.createTime" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                       <el-button type="primary" @click="onSubmit('ruleOperationForm')" :loading="loading" size="small">确 定</el-button>
                        <el-button @click="cancel" size="small">取 消</el-button>
                    </el-form-item>
                   
                   
                </el-form>
                
            </div>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('form')" :loading="loading" size="small">确 定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
               
            </span> -->
        </el-drawer>
       
    </div>
</template>
<script>
import {getDate} from '@/utils'
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
                ruleName: '',
                ruleCategory: '',
                mineStatus: '',
                createUserName: '',
                createTime: ''


            },
            ruleOperationFormRules: {
                batchName: [
                    { required: true, message: '请输入批次名称'},
                ],
            },
            type: '',
            checkedData: [],
            treedata: [],
            defaultProps: {
               label(data, node) {
                    const config = data.__config__ || data
                    return  config.label || config.folderName
                },
            },
            treedata: [
                 {
                    label: '项目规则',
                    children: [{
                        label: '医保',
                        children: [
                            {
                                label: '床位费超量',
                            },{
                                label: '男女性诊断串换',

                            },
                            {
                                label: '男女性项目互换'
                            },
                        ]
                        },{
                            label: '医院',
                            children: [{
                                label: '超医保适应症用药',
                            }]
                        }]
                }
               

            ],
           
            

        }
    },
    mounted () {
    },
    methods: {
        handleCheckChange(data, checked, node) {
            let res = this.$refs.treeSelect.getCheckedNodes(false, true); //true，1. 是否只是叶子节点 2.选择的时候不包含父节点）
            console.log(res, 'resresresresres')

            if (checked) {
                // this.$refs.treeSelect.setCheckedNodes([data]);
            }
            let arrLabel = [];
            // console.log(res, 'res')
            res.forEach(item => {
                console.log(item, 'itemitemitemitemitem')
                if (arrLabel.length === 0) {
                    arrLabel.push(item.label);
                } else {
                    arrLabel.length === 0;
                }
            });
            this.ruleOperationForm.mineStatus = arrLabel;
        },
        //默认打开页面
        showDialog(d) {
            this.reset();
            this.dialogVisible = true;
            this.checkedData = d;
            this.ruleOperationForm.createTime = getDate();
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
            
            // let ruleAddData = {

            // }
            this.ruleOperationForm.createUserName = this.createUserName;
            console.log(this.ruleOperationForm, '数据11');
            debugger

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleOperationForm, '表单数据')
                    this.loading = true
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl('/rule/add'),
                        method: 'post',
                        data:  this.$http.adornData(this.ruleOperationForm, false)
                    }).then(({data}) => {
                        // this.btnLoading = false;
                        if (data.code == 200) {
                            console.log(data, 'ruleId')
                            this.loading = false
                            this.treeVisible = false;
                            // this.getRuleFolder()
                        }
                    }).catch(() => {
                        this.loading = false
                        // this.btnLoading = false;
                    })  



                }
            })

            
            
        },
        cancel () {
            this.resetForm();
            this.dialogVisible = false;
           
        },
        resetForm(formName) {
            this.$refs['ruleOperationForm'].resetFields();
        }
    },
    computed: {
        createUserName: {
            get () { return this.$store.state.user.name }
        },
        // 'userName' () {

        //     this.ruleOperationForm.userName = '123'

        // }
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