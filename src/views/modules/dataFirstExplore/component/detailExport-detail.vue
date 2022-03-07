<template>
  <div class="threeData">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="医院名称：">
        <el-input
          v-model="dataForm.basicName"
          placeholder="请输入搜索内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="医院类别：">
        <el-select
          v-model="dataForm.basicType"
          placeholder="请输入搜索内容"
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
          label="医院名称"
        ></el-table-column>
        <el-table-column
          prop="basicCode"
          header-align="center"
          align="center"
          label="医院编码"
        ></el-table-column>
        <el-table-column
          prop="HospitalNature"
          header-align="center"
          align="center"
          label="医院性质"
        >
        </el-table-column>
        <el-table-column
          prop="basicType"
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
      //table表格数据
      tableList: [
        {
          id: "0",
          basicName: "商洛市中心医院",
          basicCode: "1650000",
          HospitalNature: "专科医院",
          basicType: "三级甲等",
          absicamount: "105468215.22"
        },
        {
          id: "1",
          basicName: "幼妇保健院",
          basicCode: "1650000",
          HospitalNature: "综合医院",
          basicType: "三级甲等",
          absicamount: "1224759234.53"
        }, 
        {
          id: "2",
          basicName: "中医医院",
          basicCode: "1650000",
          HospitalNature: "专科医院",
          basicType: "三级甲等",
          absicamount: "105468215.22"
        },
        {
          id: "3",
          basicName: "商洛市中心医院",
          basicCode: "1650000",
          HospitalNature: "专科医院",
          basicType: "三级甲等",
          absicamount: "105468215.22"
        },
        {
          id: "4",
          basicName: "商洛康健精神病医院",
          basicCode: "1650000",
          HospitalNature: "综合医院",
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
     this.$nextTick(() => {
      this.$refs.multipleTable.toggleAllSelection();
    });
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
