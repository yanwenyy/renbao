<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="物料名称:">
        <el-input v-model="dataForm.materialsName" placeholder="物料名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="时间:">
        <el-date-picker
          v-model="value1"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <!--<el-form-item label="月份:">-->
        <!--<el-date-picker-->
          <!--v-model="dataForm.monthTime"-->
          <!--value-format="yyyy-MM"-->
          <!--type="month"-->
          <!--placeholder="选择月份" @change="dataForm.dayTime=''">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="日期:">-->
        <!--<el-date-picker-->
          <!--v-model="dataForm.dayTime"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--type="date"-->
          <!--placeholder="选择日期"  @change="dataForm.monthTime=''">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!--<el-button v-if="" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      height="80vh"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="materialsPname"
        align="center"
        label="物料大类">
      </el-table-column>
      <el-table-column
        prop="materialsName"
        align="center"
        label="物料名称">
      </el-table-column>
      <el-table-column
        prop="carWeigh"
        header-align="center"
        align="center"
        label="汽车运输量(吨)">
        <template slot-scope="scope">
          <span>{{scope.row.carWeigh.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="trainWeigh"
        header-align="center"
        align="center"
        label="火车运输量(吨)">
        <template slot-scope="scope">
          <span>{{scope.row.trainWeigh.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sumWeigh"
        header-align="center"
        align="center"
        label="总运输量(吨)">
        <template slot-scope="scope">
          <span>{{scope.row.sumWeigh.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="percentage"
        header-align="center"
        align="center"
        label="清洁运输占比(%)">
        <template slot-scope="scope">
          <span>{{scope.row.percentage%1===0?scope.row.percentage*100+'%':(scope.row.percentage*100).toFixed(2)+'%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="" type="text" size="small" @click="addOrUpdateHandle(scope.row)">查看</el-button>
          <!--<el-button v-if="isAuth('biz:pdbaidudate:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './summary-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          monthTime: '',
          dayTime: '',
          materialsName:'',
          timeStart:'',
          timeEnd:''
        },
        value1:'',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        this.dataForm.timeStart=this.value1[0];
        this.dataForm.timeEnd=this.value1[1];
        this.$http({
          url: this.$http.adornUrl('/jinding/sum/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            // 'monthTime': this.dataForm.monthTime||'',
            // 'dayTime': this.dataForm.dayTime||'',
            'timeStart': this.dataForm.timeStart,
            'timeEnd': this.dataForm.timeEnd,
          })
        }).then(({data}) => {
          if (data && data.code === 10000) {
            this.dataList = data.data;
            for(var i in this.dataList){
              this.dataList[i].trainWeigh=this.dataList[i].sumWeigh-this.dataList[i].carWeigh
            }
            this.totalPage = data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        // this.addOrUpdateVisible = true
        // this.$nextTick(() => {
        //   this.$refs.addOrUpdate.init(id)
        // })

        this.$router.push({
          name: 'summary-detail',
          // name: 'mallList',
          params: {
            list: id
          }
        })
      },

      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }else if (index === 1||index === 7||index === 2) {
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        });
        return sums;
      },
    }
  }
</script>
