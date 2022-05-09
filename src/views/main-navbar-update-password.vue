<template>
  <el-dialog title="修改密码" :visible.sync="visible" :append-to-body="true">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <div v-if="from=='login'" class="notice">温馨提示! 初始密码存在安全隐患,请先修改密码再登录系统</div>
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
      <el-form-item label="密码强度">
        <div class="input_span">
          <span id="one"></span>
          <span id="two"></span>
          <span id="three"></span>
        </div>
        <div id="font">
          <span>弱</span>
          <span>中</span>
          <span>强</span>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { clearLoginInfo } from "@/utils";
export default {
  data() {
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.newPassword !== value) {
        callback(new Error("确认密码与新密码不一致"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (this.checkStrong(value)<4) {
        callback(new Error("密码需包括数字、字母、特殊字符！"));
      } else {
        callback();
      }
    };
    return {
      from:'',
      msgText: "",
      visible: false,
      dataForm: {
        password: "",
        newPassword: "",
        confirmPassword: ""
      },
      dataRule: {
        password: [
          { required: true, message: "原密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min:6,max:20,message:'长度在6到20个字符',trigger:"blur"},
          { validator: validatePassword, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validateConfirmPassword, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    userName: {
      get() {
        return this.$store.state.user.loginName;
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    }
  },
  methods: {
    checkStrong(sValue) {
      var modes = 0;
      //正则表达式验证符合要求的
      if (sValue.length < 1) return modes;
      if (/\d/.test(sValue)) modes++; //数字
      if (/[a-z]/.test(sValue)) modes++; //小写
      if (/[A-Z]/.test(sValue)) modes++; //大写
      if (/\W/.test(sValue)) modes++; //特殊字符

      //逻辑处理
      switch (modes) {
        case 1:
          return 1;
          break;
        case 2:
          return 2;
          break;
        case 3:
        case 4:
          return sValue.length < 4 ? 3 : 4;
          break;
      }
      return modes;
    },
    // 初始化
    init(froms) {
      this.from=froms;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("user/updatePassword"),
            method: "post",
            data: this.$http.adornData({
              userId: this.$store.state.user.id,
              userPassword: this.dataForm.password,
              newPassword: this.dataForm.newPassword
            })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$nextTick(() => {
                    this.mainTabs = [];
                    clearLoginInfo();
                    this.$router.replace({ name: "login" });
                  });
                }
              });
            } else {
              this.$message.error(data.message);
            }
          });
        }
      });
    }
  },
  watch: {
    'dataForm.newPassword': {
      handler(newname, oldname) {
        this.msgText = this.checkStrong(newname);
        if (this.msgText > 1 || this.msgText == 1) {
          document.getElementById("one").style.background = "red";
        } else {
          document.getElementById("one").style.background = "#eee";
        }
        if (this.msgText > 2 || this.msgText == 2) {
          document.getElementById("two").style.background = "orange";
        } else {
          document.getElementById("two").style.background = "#eee";
        }
        if (this.msgText == 4) {
          document.getElementById("three").style.background = "#00D1B2";
        } else {
          document.getElementById("three").style.background = "#eee";
        }
      }
    }
  },
};
</script>
<style scoped>
  .input_span>span{
    background: #eee;
    height: 10px;
  }
  #font>span,.input_span>span{
    display: inline-block;
    width: 30%;
    text-align: right;
  }
  #one{
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  #three{
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .notice{
    color:red;
    text-align: center;
    font-size: 16px;
  }
</style>
