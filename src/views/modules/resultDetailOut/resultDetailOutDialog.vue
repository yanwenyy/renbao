<template>
  <div class="detail-box">
    <el-dialog
      ref="resultDetailOutDialog"
      title="结果明细导出"
      width="30%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="exportForm"
          :model="exportForm"
          :rules="exportFormRules"
          :inline="true"
        >
          <el-form-item prop="hospital" label="选择医院：">
            <el-select
              v-model="exportForm.hospId"
              placeholder="请选择"
              multiple
              @change="val => checkChange(val)"
            >
              <el-option
                v-for="item in hospitalTableData"
                :key="item.hospitalCode"
                :label="item.hospitalName"
                :value="item.hospitalCode"
              >
              </el-option>
            </el-select>
            <el-checkbox v-model="checked" @change="selectAll"
              >全选</el-checkbox
            >
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          @click="exportClick('exportForm')"
          :loading="loading"
          >导出</el-button
        >
        <el-button @click="cancel" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { exportZip } from "@/utils";
export default {
  props: ["getData"],
  data() {
    return {
      loading: false,
      // 全选状态
      checked: false,
      //是否显示弹窗
      dialogVisible: false,
      //导出传参
      exportForm: {
        hospId: [],
        hospName: [],
        batchId: ""
      },
      //医院列表数据
      hospitalTableData: [],
      //必填校验
      exportFormRules: {
        hospId: [{ required: true, message: "请选择医院" }]
      },
      //从父组件获取的批次数据
      batchItem: {},
      searchHospitalForm: {
        hospitalName: "",
        hospitalType: "",
        pageCount: 1,
        pageSize: 10000
      }
    };
  },
  methods: {
    //默认打开页面
    showDialog(batchItem) {
      // this.searchForm={hospital: []};
      this.getHospital();
      this.dialogVisible = true;
      this.batchItem = batchItem;
      this.exportForm.batchId = batchItem.batchId;
      // this.exportForm.batchId = '6998b4b9-f2ef-4b7f-b945-3f353e773655'
    },
    //全选
    checkChange(val) {
      this.exportForm.hospName = [];
      // 判断是否为全选状态
      if (val.length == this.hospitalTableData.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      for (let i = 0; i <= val.length - 1; i++) {
        this.hospitalTableData.find(item => {
          //这里的options就是数据源
          if (item.hospitalCode == val[i]) {
            this.exportForm.hospName.push(item.hospitalName);
          }
        });
      }
    },
    // 全选数据
    selectAll() {
      this.exportForm.hospId = [];
      this.exportForm.hospName = [];
      if (this.checked) {
        this.hospitalTableData.map(i => {
          this.exportForm.hospId.push(i.hospitalCode);
          this.exportForm.hospName.push(i.hospitalName);
        });
      } else {
        this.exportForm.hospId = [];
        this.exportForm.hospName = [];
      }
    },
    // 获取医院列表
    getHospital() {
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("batch/getHospitals"),
        method: "get",
        params: this.$http.adornParams(this.exportForm, false)
      })
        .then(({ data }) => {
          if (data.code == 200) {
            this.hospitalTableData = data.result;
          }
        })
        .catch(() => {
          // this.tableLoading = false
        });
    },
    // 导出
    exportClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http({
            method: "post",
            isLoading: false,
            responseType: "blob",
            url: this.$http.adornUrl("/ruleResult/exportResult"),
            headers: {
              "Content-Type": "application/json; application/octet-stream"
            },
            data: this.$http.adornData(this.exportForm, false)
          }).then(response => {
            exportZip(response, "结果明细");
            this.loading = false;
            this.$message({
              // message: data.message,
              message: "导出成功",
              type: "success",
              duration: 1500
            });
            this.dialogVisible = false;
          });
          this.reSet();
        }
      });
    },
    //关闭
    handleClose() {
      this.dialogVisible = false;
      this.reSet();
    },
    //取消
    cancel() {
      this.dialogVisible = false;
      this.reSet();
    },
    //重置
    reSet() {
      this.exportForm = {
        hospId: [],
        hospName: [],
        batchId: ""
      };
      this.checked = false;
    }
  },
  components: {},
  watch: {}
};
</script>

<style scoped lang="scss">
.detail-box {
  /deep/ .el-dialog__header {
    // border-bottom: 1px solid #ddd;
    text-align: left;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
  }
  >>> .el-cascader-menu {
    overflow: unset !important;
    min-width: 200px;
  }
  >>> .el-cascader-menu__wrap {
    overflow: unset !important;
  }
}
</style>
