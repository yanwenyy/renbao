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
                <rule-tree ref="ruleTree" :isShowSearch="false" :isShowCheckBox="true" :isShowEdit="false"  :isRelation="true" :isParent="false" @getTreeId="getTreeCheckData" @checkChange="handleCheckChange" folderSorts="3"></rule-tree>
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
            bitchCheckData: {}
        }
    },
    methods: {
        //默认打开页面
        showDialog(type, d) {
            this.dialogVisible = true
        },
        handleCheckChange (data, checked, indeterminate) {
           this.bitchCheckData = data; 
        },
        getTreeCheckData (data) {
            this.bitchCheckData = data;
            this.$refs.ruleTree.setCheckedByData(data);
        },
       
        handleClose () {
            this.dialogVisible = false
        },
        onSubmit (formName) {
            // console.log(this.bitchCheckData, 'bitchCheckDatabitchCheckDatabitchCheckData')
            //  ruleUrl = '/rule/updateByUuId'

            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
            //         this.loading = true
            //         this.$http({
            //             isLoading:false,
            //             url: this.$http.adornUrl(ruleUrl),
            //             method: 'post',
            //             data:  this.$http.adornData(this.ruleOperationForm, false)
            //         }).then(({data}) => {
            //             // this.btnLoading = false;
            //             if (data.code == 200) {
            //                 this.loading = false
            //                 this.$message({
            //                     message: this.type == 'add' ?'添加成功' : '编辑成功',
            //                     type: 'success',
            //                     duration: 1500,
            //                 })
            //                 this.dialogVisible = false;
            //                 this.$parent.getSelectPage();
            //                 this.$parent.setTableChecked()
            //             } else {
            //                 this.loading = false
            //                 this.$message({
            //                     message: this.type == 'add' ?'添加失败' : '编辑失败',
            //                     type: 'error',
            //                     duration: 1500,
            //                 })
            //                  this.dialogVisible = false;

            //             }
            //         }).catch(() => {
            //             this.loading = false
            //         })  



            //     }
            // })   


            
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