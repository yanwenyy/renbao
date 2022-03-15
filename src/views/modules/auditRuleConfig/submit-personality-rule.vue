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
                <rule-tree ref="ruleTree" :isShowSearch="false" :isShowCheckBox="true" :isShowEdit="false"  :isRelation="true" :isParent="false" @getTreeId="getTreeCheckData" @checkChange="handleCheckChange" folderSorts="3" :isShowIcon="false"></rule-tree>
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
            bitchCheckData: {},
            multipleTable: [],
            folderData: {}
        }
    },
    methods: {
        //默认打开页面
        showDialog(multipleTable, d) {
            this.dialogVisible = true;
            this.multipleTable = multipleTable
        },
        handleCheckChange (data, checked, treeData) {
            if (checked) { 
                this.bitchCheckData = data; 
                this.folderData.folderName = data.folderName;
                this.folderData.folderId =  data.folderId;
                this.folderData.folderPath =  data.folderPath;
            } else {
                this.bitchCheckData = {}; 
                this.folderData.folderName = [];
                this.folderData.folderId =  '';
                this.folderData.folderPath =  ''
            }
        },
        getTreeCheckData (data,node , treeData) {
            // this.bitchCheckData = data;
            // this.$refs.ruleTree.setCheckedByData(data);
            // this.folderData.folderName = data.folderName;
            // this.folderData.folderId =  data.folderId;
            // this.folderData.folderPath =  this.getParentByData(treeData,data.folderId )
        },
       
        handleClose () {
            this.dialogVisible = false
        },
        onSubmit (formName) {
            if( !this.folderData.folderId ) return this.$message({message: '请选择规则分类',type: 'warning'});
            let submitPersonalityRuleData = {
                ruleId: this.multipleTable[0].ruleId,
                ruleName: this.multipleTable[0].ruleName,
                ruleCategory:this.multipleTable[0].ruleCategory == '住院规则'?2 : this.multipleTable[0].ruleCategory == '门诊规则' ? 1 : '',
                folderId: this.folderData.folderId,
                folderName: this.folderData.folderName,
                folderPath: this.folderData.folderPath,
                createUserName: this.multipleTable[0].createUserName,
                createTime: this.multipleTable[0].createTime
            }
            this.loading = true
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl('/rule/add'),
                method: 'post',
                data:  this.$http.adornData(submitPersonalityRuleData, false)
            }).then(({data}) => {
                // this.btnLoading = false;
                if (data.code == 200) {
                    this.loading = false
                    this.$message({
                        message: '提交成功',
                        type: 'success',
                        duration: 1500,
                    })
                    this.dialogVisible = false;
                    this.$parent.getSelectPage();
                    this.$parent.setTableChecked()
                } else {
                    this.loading = false
                    this.$message({
                        message: '提交失败',
                        type: 'error',
                        duration: 1500,
                    })
                    this.dialogVisible = false;
                }
            }).catch(() => {
                this.loading = false
            })  
           

            
        },
        cancel () {
            this.dialogVisible = false;
           
        },
        reset () {
            this.folderData = {}
            this.$nextTick(() => {
               this.$refs.ruleTree && this.$refs.ruleTree.clearCheckedKeys();
            })
        },
    },
    components: {
        ruleTree,
    },
    watch : {
        'dialogVisible'(nval, oval) {
            if (nval ) {   
               this.reset()
            }
        },
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