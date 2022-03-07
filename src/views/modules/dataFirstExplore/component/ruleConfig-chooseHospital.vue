<template>
  <div class="threeData">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="医院名称：">
        <el-input
          v-model="dataForm.hospitalName"
          placeholder="请输入搜索内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="医院类别：">
        <el-select
          v-model="dataForm.hospitalType"
          placeholder="请输入搜索内容"
          clearable
        >
          <el-option
            v-for="item in hospitalType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="listDisplay">
      <el-table
        :data="tableList"
        border
        style="100%"
        overflow-y:auto
        height="400px"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
        v-loading="listLoading"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="医院名称"
          header-align="center"
          align="center"
          label="医院名称"
        ></el-table-column>
        <el-table-column
          prop="医院编码"
          header-align="center"
          align="center"
          label="医院编码"
        ></el-table-column>
        <el-table-column
          prop="医院性质"
          header-align="center"
          align="center"
          label="医院性质"
        >
        </el-table-column>
        <el-table-column
          prop="医院类别"
          header-align="center"
          align="center"
          label="医院类别"
        ></el-table-column>
      </el-table>
    </div>
    <div>
      <el-button type="primary" @click="ok">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataForm: {
        hospitalName: "",
        hospitalType: ""
      },
      //loading
      listLoading: false,
      importVisible: false,
      apComServerData: {
        current: 1,
        size: 10,
        pageNum: 1,
        total: 0
      },
      //table表格数据
      tableList: [],
      multipleSelection: [],
      tableColumns: [],
      hospitalType: [
        {
          value: "三级甲等",
          label: "三级甲等"
        },
        {
          value: "三级乙等",
          label: "三级乙等"
        },
        {
          value: "三级丙等",
          label: "三级丙等"
        }
      ]
    };
  },
  created() {
    this.initList();
    this.$nextTick(() => {
      this.$refs.multipleTable.toggleAllSelection();
    });
  },
  methods: {
    //初始化数据列表
    initList() {
      this.$http({
        url: this.$http.adornUrl("/hospitalBasicInfo/getPageList"),
        method: "get",
        params: this.$http.adornParams({
          pageCount: "1",
          pageSize: "10000",
          hospitalName: this.dataForm.hospitalName,
          hospitalType: this.dataForm.hospitalType
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableList = data.result.records;
        } else {
          this.tableList = [];
        }
      });
    },
    //重置
    resetForm() {
      this.dataForm = {
        hospitalName: "",
        hospitalType: ""
      };
      this.initList();
    },
    //查询
    getDataList() {
      this.initList();
    },
    //确定
    ok() {
      this.$emit("ok");
      this.$emit("returnData", this.multipleSelection);
    },
    //取消
    close() {
      this.$emit("close");
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.f_right {
  float: right;
  padding: 5px;
}
.line {
  text-align: center;
}
</style>
