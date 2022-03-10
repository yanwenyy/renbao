<template>
  <div class="threeData">
    <!-- 列表 -->
    <div class="listDisplay">
      <div class="f_right">
        <el-button type="primary" @click="searchList">查询</el-button>
        <el-button type="warning" @click="reportList">导出</el-button>
      </div>
      <div @click="handleChange" style="cursor:pointer;">
        查询条件<i
          v-show="!show"
          class="el-icon-arrow-down"
          style="padding-left:5px"
        ></i
        ><i v-show="show" class="el-icon-arrow-up" style="padding-left:5px"></i>
      </div>
      <transition name="sub-comments">
        <vue-query-builder
          :rules="rules"
          class="mask"
          v-show="show"
          v-model="output"
        ></vue-query-builder>
      </transition>
      <el-table
        :data="tableList"
        v-if="selectNum == 1"
        border
        style="100%"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
      >
        <template v-for="(item, index) in tableColumns">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            width
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <el-table
        :data="tableList2"
        v-if="selectNum == 2"
        border
        style="100%"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
      >
        <template v-for="(item, index) in tableColumns2">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            width
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <el-table
        :data="tableList3"
        v-if="selectNum == 3"
        border
        style="100%"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
      >
        <template v-for="(item, index) in tableColumns3">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            width
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <el-table
        :data="tableList4"
        v-if="selectNum == 4"
        border
        style="100%"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
      >
        <template v-for="(item, index) in tableColumns4">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            width
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <el-table
        :data="tableList5"
        v-if="selectNum == 5"
        border
        style="100%"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
      >
        <template v-for="(item, index) in tableColumns5">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            width
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <el-pagination
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="apComServerData.total"
      ></el-pagination>
    </div>
    <div>
      <el-button type="primary" @click="ok">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
<script>
import VueQueryBuilder from "@/views/modules/dataAcquisition/VueQueryBuilder.vue";
export default {
  props: {
    info: String
  },
  components: {
    VueQueryBuilder
  },
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
      show: false,
      output: null,
      //table表格数据
      tableList: [],
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
      ],
      rules: [
        {
          type: "text",
          id: "医疗机构编码",
          label: "医疗机构编码 "
        },
        {
          type: "text",
          id: "医疗机构名称",
          label: "医疗机构名称"
        },
        {
          type: "text",
          id: "结算单据号",
          label: "结算单据号"
        },
        {
          type: "text",
          id: " 住院号",
          label: " 住院号"
        },
        {
          type: "text",
          id: " 结算类别",
          label: " 结算类别"
        },
        {
          type: "text",
          id: "结算日期",
          label: "结算日期"
        },
        {
          type: "text",
          id: "入院科室名称",
          label: "入院科室名称"
        },
        {
          type: "text",
          id: "患者姓名",
          label: "患者姓名"
        }
      ],
      tableList2: [],
      tableList: [],
      tableList3: [],
      tableList4: [],
      tableList5: [],
      tableColumns2: [],
      tableColumns3: [],
      tableColumns4: [],
      tableColumns5: [],
      tableColumns: []
    };
  },
  created() {
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
    },
    //查询条件事件
    handleChange() {
      this.show = !this.show;
    }
  }
};
</script>
<style lang="scss" scoped>
.f_right {
  float: right;
  padding: 5px;
}
.mask {
  width: 85%;
  padding-top: 23px;
  position: fixed;
  z-index: 998;
  overflow: hidden;
}
.sub-comments-leave-active,
.sub-comments-enter-active {
  transition: all 1s ease;
}
.sub-comments-leave-active,
.sub-comments-enter {
  height: 0px !important;
}
.sub-comments-leave,
.sub-comments-enter-active {
  height: 500px;
}
</style>
