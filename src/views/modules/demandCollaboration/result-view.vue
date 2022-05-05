<template>
    <div class="detail-box">
        <el-dialog
            ref="resultView"
            title="监控报告详情"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="result-view-box">
                <div class="result-view-item">
                    <span class="result-label">规则名称：</span>
                    <span>{{resultViewData.ruleName}}</span>
                </div>
                <div class="result-view-item">
                    <span class="result-label">开始时间：</span>
                    <span>{{resultViewData.actualBeginTime}}</span>
                </div>
                <div class="result-view-item">
                    <span class="result-label">结束时间：</span>
                    <span>{{resultViewData.actualEndTime}}</span>
                </div>
                <div class="result-view-item">
                    <span class="result-label">状态：</span>
                    <span>{{resultViewData.runStatusName}}</span>
                </div>
                <div class="result-view-item">
                    <span class="result-label">错误描述：</span>
                    <span>{{resultViewData.resultMessage}}</span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel" size="small">关闭</el-button>
               
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
            resultViewData:{}  
        }
    },
    methods: {
        //默认打开页面
        showDialog(data, d) {
            this.dialogVisible = true
            this.resultViewData = data
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
    .result-view-box {
        padding-left: 20px;
        .result-view-item {
            padding-bottom: 12px;
            .result-label {
                margin-right: 10px;
            }
        }
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
}
</style>