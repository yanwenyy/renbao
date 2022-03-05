<!--初探报告导出-->
<template>
  <div class="threeData">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.basicName"
          placeholder="报告名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.basicType"
          placeholder="报告状态"
          clearable
        >
          <el-option
            v-for="item in options"
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
      <el-form-item style="float:right">
        <el-button type="primary" @click="getDataList()">新增</el-button>
        <el-button
          type="primary"
          :disabled="
            this.multipleSelection.length <= 0 ||
              this.multipleSelection.length > 1
          "
          @click="resetForm()"
          >修改</el-button
        >
        <el-button type="danger" @click="resetForm()">删除</el-button>
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
          prop="basicName"
          header-align="center"
          align="center"
          label="报告名称"
        ></el-table-column>
        <el-table-column
          prop="basicCode"
          header-align="center"
          align="center"
          label="报告模板"
        ></el-table-column>
        <el-table-column
          prop="administration"
          header-align="center"
          align="center"
          label="开始时间"
        >
        </el-table-column>
        <el-table-column
          prop="basicType"
          header-align="center"
          align="center"
          label="结束时间"
        ></el-table-column>
        <el-table-column
          prop="basicType"
          header-align="center"
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <div type="primary" v-if="scope.row.state == 1">执行中</div>
            <div type="primary" v-if="scope.row.state == 2">执行失败</div>
            <div type="primary">已完成</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          header-align="center"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="downLoad(scope.row.id)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataForm: {
        basicName: "",
        basicType: "",
        data2: "",
        data1: ""
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
      //多选
      multipleSelection:[],
      //table表格数据
      tableList: [
        {
          id: "0",
          basicName: "北京医院-初探报告",
          basicCode: "1650000",
          administration: "专科医院",
          basicType: "三级甲等",
          absicamount: "105468215.22"
        },
        {
          id: "1",
          basicName: "幼妇保健院",
          basicCode: "1650000",
          administration: "综合医院",
          basicType: "三级甲等",
          absicamount: "1224759234.53"
        },
        {
          id: "2",
          basicName: "中医医院",
          basicCode: "1650000",
          administration: "专科医院",
          basicType: "三级甲等",
          absicamount: "105468215.22"
        },
        {
          id: "3",
          basicName: "商洛市中心医院",
          basicCode: "1650000",
          administration: "专科医院",
          basicType: "三级甲等",
          absicamount: "105468215.22"
        },
        {
          id: "4",
          basicName: "商洛康健精神病医院",
          basicCode: "1650000",
          administration: "综合医院",
          basicType: "三级甲等",
          absicamount: "45423465.78"
        }
      ],
      tableColumns: [],
      options: [
        {
          value: "0",
          label: "三级甲等"
        },
        {
          value: "1",
          label: "三级乙等"
        },
        {
          value: "2",
          label: "三级丙等"
        }
      ]
    };
  },
  mounted() {
    // this.initList();
  },
  methods: {
    //初始化数据列表
    initList() {
      this.listLoading = true;
      // this.$http({

      // }).then(() =>{
      //     // this.listLoading =false
      // })
    },
    //重置
    resetForm() {},
    //查询
    getDataList() {},
    // 页数
    handleSizeChange(val) {
      this.apComServerData.size = val;
      this.initList();
    },
    //当前页
    handleCurrentChange(val) {
      this.apComServerData.pageNum = val;
      this.initList();
    },
    //下载
    downLoad() {},
    //确定
    ok() {
      this.$emit("ok");
    },
    //取消
    close() {
      this.$emit("close");
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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
