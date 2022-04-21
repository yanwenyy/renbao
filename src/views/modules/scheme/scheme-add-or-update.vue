<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="方案名称" prop="planName">
        <el-input v-model="dataForm.planName" placeholder="方案名称" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item label="方案编号" prop="planCode">
        <el-input v-model="dataForm.planCode" placeholder="方案编号" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item label="上传文件" prop="userPassword" v-if="!dataForm.id">
        <el-upload
          ref="ruleFileUpload"
          action="#"
          class="upload-demo"
          :on-remove="handleRemove"
          :file-list="fileList"
          :http-request="uploadData"
          :limit="1"
        >
          <el-button size="small" type="primary"
          >点击上传</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        fileList:[],
        dataForm: {
          id: 0,
          planName: '',
          planCode: '',
          multipartFiles :[],
        },
        dataRule: {
          planName: [
            { required: true, message: '方案名称不能为空', trigger: 'blur' }
          ],
          planCode: [
            { required: true, message: '方案编号不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
     cleanMsg(){
       this.dataForm={
         id: 0,
         planName: '',
         planCode: '',
         multipartFiles :[],
       }
       this.fileList=[];
     },
      //移除已上传的附件
      handleRemove(file, fileList) {
        // console.log(fileList);
        this.dataForm.multipartFiles=fileList;
      },
      //获取上传的文件
      uploadData(file) {
        // console.log(file);
        this.dataForm.multipartFiles.push(file.file);
      },
      //验证唯一性
      verification(val,msg,name){
        if(val){
          this.$http({
            url: this.$http.adornUrl("/user/add"),
            method: "post",
            isLoading:false,
            params: this.$http.adornParams({
              userLoginName: this.dataForm.userLoginName,
              userNumber:  this.dataForm.userNumber,
            })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              if(data.result===false){
                this.$message.error(msg);
                this.$forceUpdate();
                this.dataForm.project[name]='';
                this.$set(this.dataForm,this.dataForm)
              }
            }
          });
        }
      },
      init (id,regionId,regionPath) {
        this.cleanMsg();
        this.visible = true;
        this.dataForm.id=id;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        });
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/plan/selectByUuid/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              var datas=data.result;
              this.dataForm.planName = datas.planName;
              this.dataForm.planCode = datas.planCode;
              this.dataForm.multipartFiles = datas.multipartFiles;
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.dataForm.id){
              var params = new FormData();
              params.append("planName", this.dataForm.planName);
              params.append("planCode", this.dataForm.planCode);
              params.append("planId", this.dataForm.id);
              this.dataForm.multipartFiles.forEach(item=>{
                params.append("multipartFiles", item);
              })
            }else{
              var editParmas={
                planName:this.dataForm.planName,
                policyId:this.dataForm.id,
                planCode:this.dataForm.planCode,
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/plan/${!this.dataForm.id ? 'add' : 'updateByUuId'}`),
              method: 'post',
              data: !this.dataForm.id ? params:editParmas,
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.message)
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  >>>.no-autofill-pwd .el-input__inner{
    -webkit-text-security:disc!important;
  }
</style>
