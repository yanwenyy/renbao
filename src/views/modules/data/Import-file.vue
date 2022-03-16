<template>
    <div class="detail-box">
        <el-dialog
            ref="ImportFileDialog"
            title="导入数据"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="import-file">
                <el-form size="small" ref="ruleExportForm" :model="ruleExportForm" :rules="ruleExportFormRules" label-width="130px" style="text-align: left" class="rule-form-inline">
                  
                    <el-form-item 
                        label="导入文件"
                        prop="ruleFile"
                    >
                        <el-upload
                            ref="ruleFileUpload"
                            action="#"
                            class="upload-demo"
                            :on-remove="handleRemove"
                            :on-success="onSuccess"
                            :on-change="onChange"
                            :http-request="uploadData"
                            :auto-upload="false"
                            :limit="1"
                            :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传已导入的文件</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
               
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="loading" @click="onSubmit('ruleExportForm')" size="small">确 定</el-button>
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
            //文件上传成功状态
            fileUploadStatus: "",
            ruleExportForm: {

            },
          
            ruleExportFormRules: {
            },
            fileList: []
        }
    },
    methods: {
        //默认打开页面
        showDialog( ) {
            this.dialogVisible = true  
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
            this.dialogVisible = false
            this.resetForm();
            this.reset();
        },
        onSubmit (formName) {
            // this.uploadData()
            if (this.fileList.length == 0) {
                this.$message({
                    message: "请选择上传文件！",
                    type: "error",
                });
                return;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$refs.ruleFileUpload.submit();
                    
                }
            })

        },
        uploadData (params) {
            let fd = new FormData();
            fd.append("ruleFile", params.file); //传文件
            this.$http({
                method: "post",
                url: this.$http.adornUrl('rule/ruleImport'),
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: fd 
            }).then((res) => {
                if (res.code == 200) {

                } else {
                    this.$message({
                        message: "系统出错了，请联系管理员！",
                        type: "error",
                    });
                }
            });

            // this.ruleOperationForm.batchType= 2
            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
            //         this.loading = true
            //         this.$http({
            //             isLoading:false,
            //             url: this.$http.adornUrl('/rule/ruleRun'),
            //             method: 'post',
            //             data:  this.$http.adornData(this.ruleOperationForm, false)
            //         }).then(({data}) => {
            //             // this.btnLoading = false;
            //             if (data.code == 200) {
            //                 this.loading = false
            //                 this.$alert('请在审核执行监控中查看运行详情', '执行成功',{
            //                     confirmButtonText: '关闭',
            //                     callback: action => {
            //                         this.dialogVisible = false;
            //                         this.$parent.setTableChecked()
            //                     }
            //                 });
            //             } else {
            //                 this.$message({
            //                     message: '执行失败',
            //                     type: 'error',
            //                     duration: 1500,
            //                 })
            //                 this.loading = false
            //             }
            //         }).catch(() => {
            //             this.loading = false
            //         })  
            //     }
            // }) 
        },
        cancel () {
            this.dialogVisible = false;
            this.resetForm();
            this.reset();  
        },
        resetForm(formName) {
            if (this.$refs['ruleExportForm']) {
                this.$refs['ruleExportForm'].resetFields();
            }
            
        },
        //文件上传成功时的钩子
        onSuccess(response, file, fileList) {
            console.log(response);
            console.log(file);
            console.log(fileList);
            if (response.code == 200) {
                alert("文件上传成功！");
                this.fileUploadStatus = "success";
            } else {
                this.fileUploadStatus = "error";
            }
        },
 
        //文件列表移除文件时的钩子
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.fileList = []
        },
        //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        onChange(file) {
            console.log(file);
            this.fileList.push(file);
        },
    },
    components: {
    },
    watch : {
        'dialogVisible'(nval, oval) {
            if (nval ) {
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
   
}
</style>