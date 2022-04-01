<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="政策名称" prop="policyName">
        <el-input v-model="dataForm.policyName" placeholder="政策名称" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="dataForm.beginTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效时间">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="dataForm.endTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
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
          policyName: '',
          beginTime: '',
          endTime: '',
          regionId: '',
          regionPath: '',
          multipartFiles :[],
        },
        dataRule: {
          policyName: [
            { required: true, message: '政策名称不能为空', trigger: 'blur' }
          ],
          beginTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '有效时间能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
     cleanMsg(){
       this.dataForm={
         id: 0,
         policyName: '',
         beginTime: '',
         endTime: '',
         regionId: '',
         regionPath: '',
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
        this.dataForm.regionId=regionId;
        this.dataForm.regionPath=regionPath;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        });
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/policy/selectByUuid/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              var datas=data.result;
              this.dataForm.policyName = datas.policyName;
              this.dataForm.beginTime = datas.beginTime;
              this.dataForm.endTime = datas.endTime;
              this.dataForm.regionId = datas.regionId;
              this.dataForm.regionPath = datas.regionPath;
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
              params.append("policyName", this.dataForm.policyName);
              params.append("beginTime", this.dataForm.beginTime);
              params.append("endTime", this.dataForm.endTime);
              params.append("regionId", this.dataForm.regionId);
              params.append("regionPath", this.dataForm.regionPath);
              this.dataForm.multipartFiles.forEach(item=>{
                params.append("multipartFiles", item);
              })
            }else{
              var editParmas={
                policyName:this.dataForm.policyName,
                policyid:this.dataForm.policyId,
                beginTime:this.dataForm.beginTime,
                endTime:this.dataForm.endTime,
                regionId:this.dataForm.regionId,
                regionPath:this.dataForm.regionPath,
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/policy/${!this.dataForm.id ? 'add' : 'updateByUuId'}`),
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
