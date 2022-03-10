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
                <!-- <el-tree
                    ref="ruleTree"
                    check-strictly
                    :default-expand-all="true"
                    :data="projectRulesTreeList"
                    show-checkbox
                    :check-on-click-node="true"
                    :expand-on-click-node="false"
                    node-key="label"
                    @check-change="handleCheckChange"
                    >
                </el-tree> -->
                <rule-tree ref="ruleTree" :isShowSearch="false" :isShowCheckBox="true" :isShowEdit="false"  :isRelation="true" :isParent="false" @getTreeId="getTreeCheckData" @checkChange="handleCheckChange"></rule-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('form')" :loading="loading" size="small">确 定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
               
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ruleTree from '../../common/rule-tree.vue'
export default {
    props: [
        'getData'
    ],
    data() {
        return {
            loading: false,
            dialogVisible: false,
            uniqueValue: '', //最后拿到的唯一选择的moduldCode值,相当于id 
        }
    },
    methods: {
        //默认打开页面
        showDialog(type, d) {
            this.dialogVisible = true
            
        },
        handleCheckChange (data, checked, indeterminate) {
           console.log(data, 'datadatadata')  
           
        },
        getTreeCheckData (data) {
            console.log(data, 'datadata')

        },
       
        handleClose () {
            this.dialogVisible = false
        },
        onSubmit (formName) {

            
        },
        cancel () {
            this.dialogVisible = false;
           
        },
       
    },
    components: {
        ruleTree,
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