<!-- 数据备份管理 -->
<template>
  <div class='dataBackUp'>
    <el-form :inline="true" :model="dataForm" ref="ruleForm">
      <el-form-item label="文件名称:">
        <el-input v-model="dataForm.fileName" placeholder="请输入搜索内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="文件路径:">
        <el-input v-model="dataForm.filePath" placeholder="请输入文件路径"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="dataForm.backupStatus" placeholder="请选择" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="listDisplay">
      <div class='f_right'>
        <el-button type="primary" @click="backupsClick">备份</el-button>
        <el-button type="primary" @click="reductionClick">还原</el-button>
      </div>
      <div>
        <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}" :height="tableHeight-120"
                  style="width: 100%" v-loading="listLoading">
          <!--            <el-table-column type="selection" align="center" width="50"></el-table-column>-->
          <el-table-column
            type="index"
            header-align="center"
            align="center"
            label="序号"
            width="50">
          </el-table-column>
          <!--              <el-table-column label="项目名称" align="center" prop="projectName"></el-table-column>-->
          <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
          <el-table-column label="时间" align="center" prop="dataTime">
            <template slot-scope="scope">{{scope.row.dataTime | datetimeformat}}</template>
          </el-table-column>
          <el-table-column label="路径" align="center" prop="backupPath"></el-table-column>
          <el-table-column label="类型" align="center" prop="backupType">
            <template slot-scope="scope">
              <div class="tac" v-if="scope.row.backupType=='1'">全系统数据备份</div>
              <div class="tac" v-if="scope.row.backupType=='2'">全系统数据还原</div>
              <div class="tac" v-if="scope.row.backupType=='3'">项目备份</div>
              <div class="tac" v-if="scope.row.backupType=='4'">项目还原</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="backupStatus">
            <template slot-scope="scope">
              <div class="tac" v-if="scope.row.backupStatus=='1'">已完成</div>
              <div class="tac" v-if="scope.row.backupStatus=='2'">正在执行</div>
              <div class="tac" v-if="scope.row.backupStatus=='3'">失败</div>
            </template>
          </el-table-column>
          <el-table-column label="进度" align="center" prop="backupStatus">
            <template slot-scope="scope">
              <el-progress v-if="scope.row.backupStatus=='3'" :percentage="0"></el-progress>
              <el-progress v-if="scope.row.backupStatus=='2'" :percentage="50"></el-progress>
              <el-progress v-if="scope.row.backupStatus=='1'" :percentage="100"></el-progress>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="detailClick(scope.row.dataBackupInfoId)" type="text">查看日志</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="apComServerData.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="apComServerData.pageSize"
        :total="apComServerData.total"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog title='查看日志' :close-on-click-modal="false" width="60%" :modal-append-to-body="false"
               :visible.sync="showDetailVisible">
      <query-log v-if="showDetailVisible" @close="showDetailVisible = false" @ok="showDetailVisible = false"
                 :collectPlanMonitorId="dataBackupInfoId"></query-log>
    </el-dialog>
    <el-dialog title="备份" :visible.sync="ShowAddVisible">
      <el-form :model="addMemberForm" ref="addMemberForm" label-width="150px">
        <el-form-item label="备份名:">
          <el-input class="input-hasBtn" v-model="addMemberForm.dataName" placeholder="请输入备份名"
                    style="width:75%"></el-input>
        </el-form-item>
      </el-form>
      <div style='text-align:center'>
        <el-button @click="ShowAddVisible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="还原" :visible.sync="ShowRestoreVisible">
      <el-form :model="addRestoreForm" ref="addMemberForm" label-width="150px">
        <el-form-item label="选择文件:">
          <el-input class="input-hasBtn" v-model="addRestoreForm.dataAmount" placeholder="选择"
                    style="width:75%"></el-input>
          <el-button type="primary" @click="chooseListVisible=true" style="margin-left:10px">选择</el-button>
        </el-form-item>
      </el-form>
      <div style='text-align:center'>
        <el-button @click="ShowRestoreVisible = false">取消</el-button>
        <el-button type="primary" @click="SubmitClick()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="项目备份列表" :visible.sync="chooseListVisible" :close-on-click-modal="false" width="60%"
               :modal-append-to-body="false">
      <backUpList v-if="chooseListVisible" @close="closeChooseDrawer" @ok="ChooseSucceed"
                  @satDatalist='satDatalist'></backUpList>
    </el-dialog>
  </div>
</template>
<script>
  import queryLog from '@/views/modules/dataAcquisition/component/edit.vue';
  import backUpList from './component/backUpList.vue';

  export default {
    components: {
      queryLog,
      backUpList
    },
    data() {
      return {
        dataForm: {
          formDate: '',
          filePath: '',
          backupStatus: '',
        },
        options:[{
          value:'1',
          label:'已完成'
        },{
          value:'2',
          label:'进行中'
        },{
          value:'3',
          label:'失败'
        }],
        addMemberForm: {
          dataAmount: '',
          dataName: ''
        },
        addRestoreForm: {
          dataAmount: ''
        },  //还原
        tableList: [],
        listLoading: false,
        apComServerData: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
        showDetailVisible: false,
        ShowAddVisible: false, //备份弹框
        ShowRestoreVisible: false,//还原弹框
        chooseListVisible: false,//选择文件
        dataBackupInfoId: '',//业务主键id
        selectedFileData: [],
      }
    },
    computed: {
      tableHeight: {
        get() {
          return this.$store.state.common.tableHeight
        }
      },
    },
    mounted() {
      this.initDataList()
    },
    methods: {
      //获取项目备份内容
      satDatalist(data) {
        this.addRestoreForm.dataAmount = data[0].name;
        this.selectedFileData = data
      },
      //初始化列表数据
      initDataList() {
        this.listLoading = true
        this.$http({
          url: this.$http.adornUrl('/dataBackupInfo/selectPageDataBackup'),
          method: 'get',
          params: this.$http.adornParams({
            pageSize: this.apComServerData.pageSize,
            pageNo: this.apComServerData.pageIndex,
            fileName: this.dataForm.fileName || '',
            backupPath: this.dataForm.filePath || '',
            backupStatus: this.dataForm.backupStatus || '0',
            // backType:3,
            num: '1,2',
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.tableList = data.result.records
            this.apComServerData.total = data.result.total
          } else {
            this.tableList = []
            this.apComServerData.total = 0
          }
          this.listLoading = false;
        })
      },
      ///查询
      getDataList() {
        this.initDataList()
      },

      //关闭弹框
      ChooseSucceed() {
        this.closeChooseDrawer()
      },
      closeChooseDrawer() {
        this.chooseListVisible = false
      },
      //重置
      resetForm(formName) {
        this.dataForm = {
          formDate: '',
          filePath: '',
          backupStatus: '',
        }
        this.$refs[formName].resetFields()
      },

      //备份事件
      backupsClick() {
        this.ShowAddVisible = true
      },
      //还原事件
      reductionClick() {
        this.ShowRestoreVisible = true
      },
      // 每页数
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.getAllList()
      },
      // 当前页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getAllList()
      },
      //查看日志
      detailClick(id) {
        this.showDetailVisible = true
        this.dataBackupInfoId = id
      },
      dataFormSubmit() {
        this.listLoading = true;
        this.$http({
          url: this.$http.adornUrl(`/dataBackupInfo/systemBackupDB/${this.addMemberForm.dataName}`),
          method: 'post',
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result.records;
            this.totalPage = data.result.total;
            this.$message({
              type: 'success',
              message: '备份成功!'
            });
            this.initDataList();
            this.ShowAddVisible = false;
          } else if (data && data.code === 20000) {
            this.$message({
              type: 'success',
              message: data.message,
            });
          } else {
            this.dataList = [];
            this.totalPage = 0
          }
          this.listLoading = false
        })
      },
      //还原确定事件
      SubmitClick() {
        if (this.selectedFileData.length != 1)
          return this.$message({
            message: "请选择文件进行操作",
            type: "warning"
          });
        this.$confirm('是否确认将此系统备份还原吗?该操作可能回影响某些数据丢失，请谨慎操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.listLoading = true
          this.$http({
            url: this.$http.adornUrl('/dataBackupInfo/systemRestoreDB'),
            method: 'post',
            data: this.selectedFileData
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.dataList = data.result.records;
              this.totalPage = data.result.total
              this.$message({
                type: 'success',
                message: '还原成功!'
              });
              this.initDataList();
              this.ShowRestoreVisible = false;
            } else if (data && data.code === 20000) {
              this.$message({
                type: 'success',
                message: data.message,
              });
            } else {
              this.dataList = [];
              this.totalPage = 0
            }
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消还原'
          });
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .f_right {
    float: right;
    padding: 5px;
  }

  .itemBtn {
    text-align: center;
  }
</style>
