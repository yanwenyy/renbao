<template>
  <div>
    <div class="title-div">
      <span>操作</span>
    </div>
    <div>
      <el-form :model="formCodeData" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型名称" prop="codeName" label-width="150px">
              <el-input v-model="formCodeData.codeName" class="input"></el-input>
            </el-form-item>
            <el-form-item label="uuid" prop="codeUuid" v-if="show=false">
              <el-input v-model="formCodeData.codeUuid" class="input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型编码" prop="codeValue" label-width="150px">
              <el-input
                v-model="formCodeData.codeValue"
                placeholder="请输入4-10位的数字"
                class="input"
                @change="number()"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="类型描述" prop="codeDesc" label-width="150px">
            <el-input type="textarea" v-model="formCodeData.codeDesc"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formCodeData: {
        codeUuid: "",
        codeIndex: "",
        codeName: "",
        codeDesc: "",
        codeValue: "",
        parentCodeUuid: "",
        dataSortUuid: "",
        delTag: "0"
      },
      editCodeValue: "",
      rules: {
        codeName: [
          { required: true, message: "请输入类型名称", trigger: "blur" }
        ],
        codeValue: [
          { required: true, message: "请输入类型编码", trigger: "blur" }
        ],
        codeDesc: [
          { required: true, message: "请填写类型描述", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 校验编码格式
    number() {
      var data = this.formCodeData.codeValue;
      let codeValue = new RegExp("^[0-9]{4,10}$").test(data);
      if (!codeValue) {
        this.$notify.error({
          title: "错误",
          message: "请输入4-10位的数字",
          position: "bottom-right"
        });
        this.formCodeData.codeValue = "";
      }
    },
    //重置
    resetForm() {
      this.formCodeData = {
        codeUuid: "",
        codeIndex: "",
        codeName: "",
        codeDesc: "",
        codeValue: "",
        parentCodeUuid: "",
        dataSortUuid: "",
        delTag: ""
      };
    },
    // 添加
    saveCedeData(sortUuid, parentCodeUuid) {
      if (
        this.formCodeData.codeName == undefined ||
        this.formCodeData.codeName == null ||
        this.formCodeData.codeName == ""
      ) {
        this.common.alertMsg(2, "请输入类型名称");
        return false;
      }
      if (
        this.formCodeData.codeValue == undefined ||
        this.formCodeData.codeValue == null ||
        this.formCodeData.codeValue == ""
      ) {
        this.common.alertMsg(2, "请输入类型编码");
        return false;
      }
      if (
        this.formCodeData.codeDesc == undefined ||
        this.formCodeData.codeDesc == null ||
        this.formCodeData.codeDesc == ""
      ) {
        this.common.alertMsg(2, "请输入类型描述");
        return false;
      }
      if (sortUuid === "" || sortUuid === null || sortUuid === undefined) {
        sortUuid = parentCodeUuid;
      }
      this.formCodeData.dataSortUuid = sortUuid;
      this.formCodeData.parentCodeUuid = parentCodeUuid;
      this.axios
        .post("/audit/zhBaseCodeInfo/pa/zhBaseCodeInfo/add", this.formCodeData)
        .then(response => {
          if (response.data.code == "2001") {
            this.common.alertMsg(2, "该编码已存在，请重新输入");
          } else {
            this.common.alertMsg(1, "添加成功");
            this.resetForm();
            this.$emit("closeMain");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 修改
    editCodeData(sortUuid, parentCodeUuid) {
      if (
        this.formCodeData.codeName == undefined ||
        this.formCodeData.codeName == null ||
        this.formCodeData.codeName == ""
      ) {
        this.common.alertMsg(2, "请输入类型名称");
        return false;
      }
      if (
        this.formCodeData.codeDesc == undefined ||
        this.formCodeData.codeDesc == null ||
        this.formCodeData.codeDesc == ""
      ) {
        this.common.alertMsg(2, "请输入类型描述");
        return false;
      }
      this.$confirm(
        "不可以修改类型编码，编码将保持不变，是否确认修改其他信息?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.formCodeData.dataSortUuid = sortUuid;
        this.formCodeData.parentCodeUuid = parentCodeUuid;
        this.formCodeData.delTag = "0";
        this.formCodeData.codeValue = this.editCodeValue;
        this.axios
          .post(
            "/audit/zhBaseCodeInfo/pu/zhBaseCodeInfo/updateByUuId",
            this.formCodeData
          )
          .then(response => {
            console.log(response);
            this.common.alertMsg(1, "修改成功");
            this.$emit("closeMain");
            this.resetForm();
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    }
  },
  props: ["codeOperate"],
  watch: {
    codeOperate(data) {
      if (data.length === 1) {
        this.formCodeData.codeUuid = data[0].codeUuid;
        this.formCodeData.codeName = data[0].codeName;
        this.formCodeData.codeDesc = data[0].codeDesc;
        this.formCodeData.codeValue = data[0].codeValue;
        this.editCodeValue = data[0].codeValue;
      } else {
        this.resetForm();
      }
    }
  }
};
</script>
<style scoped>
.title-div {
  text-align: left;
}
.input {
  width: 52%;
  float: left;
}
</style>