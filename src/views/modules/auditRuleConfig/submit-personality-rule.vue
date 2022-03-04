<template>
    <div class="detail-box">
        <el-dialog
            ref="submitPersonalityRule"
            title="提交至地区个性化规则"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="rule-tree-box">
                <span>选择规则：</span>
                <el-tree
                    ref="ruleTree"
                    :default-expand-all="true"
                    :data="projectRulesTreeList"
                    show-checkbox
                    node-key="label"
                    @check-change="handleCheckChange"
                    >
                </el-tree>
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
            dialogVisible: false,
            projectRulesTreeList: [ 
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
    methods: {
        //默认打开页面
        showDialog(type, d) {
            this.dialogVisible = true
            
        },
        handleCheckChange (data, checked, indeterminate) {
            if (checked) {
                this.$refs.ruleTree.setCheckedKeys([data.label])
            }
        },
        handleClose () {
            this.dialogVisible = false
        },
        onSubmit (formName) {
            
        },
        cancel () {
            this.dialogVisible = false;
           
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