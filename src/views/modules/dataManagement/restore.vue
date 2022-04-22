<!-- 项目还原 -->
<template>
    <div class='restore'>
      <el-form :inline="true" :model="dataForm" ref="dataForm">
        <el-form-item label="文件名:">
          <el-input v-model="dataForm.fileName" placeholder="请输入文件名"></el-input>
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
          <el-button type="primary" @click="getSearch()">查询</el-button>
          <el-button @click="getReset()">重置</el-button>
          <!-- <el-button type="warning" @click="getStopCollection()">停止采集</el-button> -->
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="examine()">备份</el-button>
          <el-button type="primary" @click="restoreClick()">还原</el-button>
          <!-- <el-button type="warning" @click="getStopCollection()">停止采集</el-button> -->
        </el-form-item>

      </el-form>


      <!-- 列表 -->
      <el-tabs type="border-card" @tab-click="handleClick">
        <div>
          <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}"  :height="tableHeight-120" style="width: 100%" v-loading="dataLoading" @selection-change="handleSelectionChange">
<!--            <el-table-column type="selection" align="center" width="50"></el-table-column>-->
            <el-table-column
              type="index"
              header-align="center"
              align="center"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column label="项目名称" align="center" prop="projectName"></el-table-column>
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
                <el-button @click="editClick(scope.row.dataBackupInfoId)" type="text">查看日志</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          :page-size="apComServerData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="apComServerData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="apComServerData.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
        ></el-pagination>

      </el-tabs>


      <el-dialog title='查看日志' :close-on-click-modal="false" width="60%" :modal-append-to-body="false" :visible.sync="editShowVisible">
        <query-log v-if="editShowVisible" @close="editShowVisible = false" @ok="editShowVisible = false" :collectPlanMonitorId="dataBackupInfoId"></query-log>
      </el-dialog>

        <el-dialog title="还原" :visible.sync="ShowAddVisible">
            <el-form :model="addMemberForm" ref="addMemberForm" label-width="150px">
                <el-form-item label="请选择该项目备份">
                    <el-input class="input-hasBtn" v-model="addMemberForm.dataAmount" placeholder="选择" style="width:75%"></el-input>
                    <el-button type="primary" @click="chooseListVisible=true" style="margin-left:10px">选择</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ShowAddVisible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmits()">确定</el-button>
            </span>
        </el-dialog>
         <el-dialog title="项目备份列表" :visible.sync="chooseListVisible" :close-on-click-modal="false" width="60%" :modal-append-to-body="false">
            <backUpList  v-if="chooseListVisible" @close="closeChooseDrawer" @ok="ChooseSucceed" @satDatalist='satDatalist'></backUpList>
         </el-dialog>
      <el-dialog title="选择备份项目" :visible.sync="ShowProjectVisible" width="70%">
        <el-tabs type="border-card" @tab-click="handleClick">
            <el-table
              :height="tableHeight-75"
              :data="dataList"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
              <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="projectCode"
                header-align="center"
                align="center"
                width="120"
                label="项目编号">
              </el-table-column>
              <el-table-column
                prop="projectName"
                align="center"
                label="项目名称"
                min-width="160">
                <template slot-scope="scope">
                  <!--<div :title="scope.row.projectName" class="show-ellipsis">{{scope.row.projectName}}</div>-->
                  <el-button :title="scope.row.projectName" type="text" size="small" @click="addOrUpdateHandle(scope.row.projectId,'look')">{{scope.row.projectName}}</el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="dataAmount"
                header-align="center"
                align="center"
                label="项目周期"
                min-width="160">
                <template slot-scope="scope">
                  {{scope.row.projectPeriodBegin }}至{{scope.row.projectPeriodEnd}}
                </template>
              </el-table-column>
              <el-table-column
                prop="auditedUnit"
                header-align="center"
                align="center"
                label="委托单位">
              </el-table-column>
              <el-table-column
                prop="createUserName"
                header-align="center"
                align="center"
                label="创建人">
              </el-table-column>
              <el-table-column
                prop="createTime"
                header-align="center"
                align="center"
                label="创建时间"
                min-width="160">
                <template slot-scope="scope">
                  {{scope.row.createTime }}
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

        </el-tabs>
        <span slot="footer" class="dialog-footer">
                <el-button @click="ShowProjectVisible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
      </el-dialog>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    </div>
</template>
<script>
import backUpList from './component/backUpList.vue';
import queryLog from '@/views/modules/dataAcquisition/component/edit.vue';
import AddOrUpdate from '../projectManage/project-add-or-update';
export default {
    name:'restore',
    components:{

      backUpList,
      AddOrUpdate,
      queryLog
    },
    data(){
        return{
          remaks:'',
          dataForm:{
          fileName:'',
          filePath:'',
          backupStatus:'',
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
          addMemberForm:{
            dataAmount:''
          },
          tableList:[],//医保数据 医院基本信息
          editShowVisible:false,  //弹框显示
          apComServerData:{
            current: 1,
            pageSize: 10,
            pageIndex:1,
            total:0,
          },
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          collectPlanMonitorId:'',
          dataLoading:false,
          dataList:[],
          showViewVisible:false,
          multipleSelection:[],
          dataListLoading:false,
          collectPlanMonitorIds:'',
          chooseListVisible:false,//备份列表弹框
          ShowAddVisible:false,//还原列表
          ShowProjectVisible:false,//备份查询项目列表
          dataListSelections:[],//备份查询项目列表中的多选
          addOrUpdateVisible: false,//查看详情
          fileTreeLoading:false,
          selectedFileData:[],
          dataBackupInfoId: '',//业务主键id
        }
    },
    computed:{
      tableHeight: {
        get () { return this.$store.state.common.tableHeight}
      },

    },
    activated(){
      this.getInitList();
      this.getDataList();
    },
    methods:{
      //获取项目备份内容
      satDatalist(data){
        console.log(data)
          this.addMemberForm.dataAmount = data[0].name;
          this.selectedFileData = data
      },
      //还原
      restoreClick(){
          this.ShowAddVisible = true
      },
      //备份
      examine(){
        this.ShowProjectVisible = true
        this.getDataList();
      },
      //关闭
      close(){},
      dataFormSubmit(){
        if (this.dataListSelections.length != 1)
          return this.$message({
            message: "请选择一条数据进行操作",
            type: "warning"
          });
        this.$confirm('是否确认将所选项目备份?','提示',{
          confirmButtonText:'确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {

          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl(`/dataBackupInfo/projectBackupDB/${this.dataListSelections[0].projectId}`),
            method: 'post',
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.dataList = data.result.records;
              this.totalPage = data.result.total
              this.$message({
                type: 'success',
                message: '备份成功!'
              });
              this.getInitList();
              this.ShowProjectVisible = false;
            } else if(data && data.code === 20000){
              console.log(data);
              this.$message({
                type: 'success',
                message: data.message,
              });
            }else {
              this.dataList = [];
              this.totalPage = 0
            }
            this.dataListLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消备份'
          });
        })
      },
      dataFormSubmits(){
        this.$confirm('是否确认将所选项目备份?','提示',{
          confirmButtonText:'确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {

          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/dataBackupInfo/projectRestoreDB'),
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
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消还原'
          });
        })
      },
      //关闭弹框
      ChooseSucceed(){
          this.closeChooseDrawer()
      },
      closeChooseDrawer(){
          this.chooseListVisible = false
      },
      //多选
      handleSelectionChange(val){
        this.multipleSelection = val
      },
      /**
       * 查询项目分页及多选
       * ------------------------------
       * @param val
       */

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
      addOrUpdateHandle (id,type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,type)
        })
      },
      //-------------------------------

      //tab事件
      handleClick(tab,event){
          this.getInitList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/xmProject/selectPage'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNo': this.pageIndex,
            'pageSize': this.pageSize,
            'projectCode': this.dataForm.projectCode||null,
            'projectName': this.dataForm.projectName||null,
            'createTimeBegin': this.dataForm.createTimeBegin||null,
            'createTimeEnd': this.dataForm.createTimeEnd||null
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result.records;
            this.totalPage = data.result.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      //初始化数据备份及还原数据
      getInitList(){
        this.dataLoading = true
        this.$http({
          url:this.$http.adornUrl('/dataBackupInfo/selectPageDataBackup'),
          method: 'get',
          params: this.$http.adornParams({
            pageSize:this.apComServerData.pageSize,
            pageNo:this.apComServerData.pageIndex,
            fileName:this.dataForm.fileName || '',
            backupPath:this.dataForm.filePath || '',
            backupStatus:this.dataForm.backupStatus || '0',
            // backType:3,
            num:'3,4',
          })
        }).then(({data}) =>{
          if(data && data.code === 200){
            this.tableList = data.result.records
            this.apComServerData.total = data.result.total
          }else{
            this.tableList = []
            this.apComServerData.total = 0
          }
          this.dataLoading = false;
        })
      },

      //查看
      editClick(id){
        this.editShowVisible = true
        this.dataBackupInfoId = id
      },
      //查看进度
      edit(val){
        this.showViewVisible = true,
          this.collectPlanMonitorIds = val.hospitalCollectPlanId
      },

      // 页数
      handleSizeChange(val){
        this.apComServerData.pageSize = val;
        this.apComServerData.pageIndex = 1
        this.getInitList()
      },
      //当前页
      handleCurrentChange(val){
        this.apComServerData.pageIndex = val;
        this.getInitList()
      },
      //重置
      getReset(){
        this.dataForm.fileName = '',
          this.dataForm.filePath = '',
          this.dataForm.backupStatus = '',
        this.apComServerData.pageIndex = 1
      },
      //查询
      getSearch(){
          this.getInitList()
      },
    }
}
</script>
<style lang="scss" scoped>
  .title {
    width: 100%;
    height: auto;
    font-family: 黑体;
    font-size: 16pt;
    font-weight: 600;
  }
  .content{
      width: 100%;
    height: auto;
    font-size: 18pt;
  }
.restore_content{
    padding-bottom: 12px;
    .restore-label{
        margin-right: 10px;
    }
}

</style>
