<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="政策名称" prop="userLoginName">
        <el-input v-model="dataForm.userLoginName" :readonly="dataForm.id" placeholder="政策名称" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="userPassword">
        <el-date-picker
          v-model="dataForm.userLoginName"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效时间" prop="userPassword">
        <el-date-picker
          v-model="dataForm.userLoginName"
          type="date"
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
      <!--<el-button type="primary" @click="dataFormSubmit()">确定</el-button>-->
      <el-button type="primary" @click="">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.userPassword !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        fileList:[],
        dataForm: {
          id: 0,
          userLoginName: '',
          userPassword: '',
          comfirmPassword: '',
          userName: '',
          userNumber: '',
          userPhone: '',
          userSex:1,
        },
        dataRule: {
          userLoginName: [
            { required: true, message: '用户账号不能为空', trigger: 'blur' }
          ],
          userPassword: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' }
          ],
          userNumber: [
            { required: true, message: '工号不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          userPhone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      //移除已上传的附件
      handleRemove(file, fileList) {

      },
      //获取上传的文件
      uploadData(file) {
        console.log(file)
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
      init (id) {
        this.visible = true;
        this.dataForm.id=id;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        });
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/selectByUuid/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              var user=data.result;
              this.dataForm.userLoginName = user.userLoginName
              this.dataForm.userPassword = user.userPassword
              this.dataForm.comfirmPassword = user.comfirmPassword
              this.dataForm.userName = user.userName
              this.dataForm.userNumber = user.userNumber
              this.dataForm.userPhone = user.userPhone
              this.dataForm.userSex = user.userSex
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/user/${!this.dataForm.id ? 'add' : 'updateByUuId'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'userLoginName': this.dataForm.userLoginName,
                'userPassword': this.dataForm.userPassword,
                'userName': this.dataForm.userName,
                'userNumber': this.dataForm.userNumber,
                'userPhone': this.dataForm.userPhone,
                'userSex': this.dataForm.userSex,
              })
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
