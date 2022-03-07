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
                <el-form ref="searchForm" :model="searchForm" :inline="true">
                    <el-select v-model="searchForm.hospital" multiple placeholder="请选择医院" clearable>
                        <el-option
                            v-for="item in hospitalList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-form-item>
                        <el-button type="primary" @click="exportClick">导出</el-button>
                    </el-form-item>
                </el-form>
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
            searchForm: {
                hospital: [],
            },
            hospitalList: [
                {value: '1',label: '所有医院'},
                {value: '2',label: '北京医院'},
                {value: '3',label: '唐山医院'},
                {value: '4',label: '所有医院'},
                {value: '5',label: '北京医院'},
                {value: '6',label: '唐山医院'},
          
            ]
           
        }
    },
    methods: {
        //默认打开页面
        showDialog(type, d) {
            this.searchForm={hospital: []};
            this.dialogVisible = true;
            
        },
        // 导出
        exportClick () {

        },
        handleClose () {
            this.dialogVisible = false
        },
        onSubmit (formName) {
            console.log(this.ruleOperationForm, '表单数据')
            
            
        },
        cancel () {
            this.dialogVisible = false;
           
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
    .result-detail-out {
        /deep/ .el-select__tags,.el-select {
            width: 300px !important;
            max-width: unset !important;
        }

    }
   
  
}
</style>