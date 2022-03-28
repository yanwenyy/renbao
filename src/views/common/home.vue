<template>
  <div class="mod-home">
    <el-row :gutter="20">
      <!-- 项目详情 -->
      <el-col :span="8">
        <div class="projectInfo">
          <div class="cardTitle"><el-row style="margin-left:10px">项目详情</el-row></div>
           <div class="restore_content">
              <span class="restore-label">项目编号:</span>
              <span :title="project.projectCode">{{project.projectCode}}</span>
            </div>
            <div class="restore_content">
              <span class="restore-label">项目名称:</span>
              <span :title="project.projectName">{{project.projectName}}</span>
            </div>
            <div class="restore_content">
                <span class="restore-label">项目周期:</span>
                <span>{{project.projectPeriodBegin}} - {{project.projectPeriodEnd}}</span>
            </div>
            <div class="restore_content">
                <span class="restore-label">被审核单位:</span>
                <span :title="project.auditedUnit">{{project.auditedUnit}}</span>
            </div>
            <div class="restore_content">
                <span class="restore-label">项目成本:</span>
                <div> 
                    <el-table :data="project.projectCosts" width="85%" class="demo-ruleForm">
                        <el-table-column prop="projectItem" align="center" label="成本事项"></el-table-column>
                        <el-table-column prop="costMoney" align="center" label="成本金额（元/天）"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
      </el-col>
      <!-- 流程中心  -->
      <el-col :span="16">
        <div class="todoList">
          <div class="cardTitle"><el-row style="margin-left:10px">流程中心<div class="cardMore" @click="toDetailPage()">查看更多</div></el-row></div>
          <div>
             <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="我的代办" name="todo">
                <div> 
                  <el-table :data="todoList" width="85%">
                      <el-table-column prop="title" label="需求标题" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="roleType" label="规则类型" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="role" align="center" label="规则属性"></el-table-column>
                      <el-table-column prop="isTrue" align="center" label="是否已反馈"></el-table-column>
                      <el-table-column prop="status" align="center" label="状态"></el-table-column>
                      <el-table-column prop="createUser" align="center" label="创建人"></el-table-column>
                      <el-table-column prop="createTime" align="center" show-overflow-tooltip label="创建时间"></el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="我的已办" name="done">
                <div> 
                  <el-table :data="todoList" width="85%" class="demo-ruleForm">
                      <el-table-column prop="title" label="需求标题" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="roleType" label="规则类型" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="role" align="center" label="规则属性"></el-table-column>
                      <el-table-column prop="isTrue" align="center" label="是否已反馈"></el-table-column>
                      <el-table-column prop="status" align="center" label="状态"></el-table-column>
                      <el-table-column prop="createUser" align="center" label="创建人"></el-table-column>
                      <el-table-column prop="createTime" align="center" show-overflow-tooltip label="创建时间"></el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:10px">
      <!-- 数据采集进度信息 -->
      <el-col :span="12">
        <div class="collectionList">
          <div class="cardTitle">
            <el-row style="margin-left:10px">
              数据采集进度信息
              <div class="cardMore">
                 <el-button :class="isYbData ? buttonClass :''" size="mini" round @click="collectCheckYb">医保数据</el-button>
                 <el-button :class="!isYbData ? buttonClass :''" size="mini" round @click="collectCheckYy">医院数据</el-button>
                 <span @click="toDetailPage('dataAcquisition-collection')">查看更多</span>
              </div>
            </el-row>
          </div>
          <el-row v-if="isYbData">
              <el-table :data="collectionYbList" style="width: 100%">
                  <el-table-column label="采集表名称" show-overflow-tooltip prop="collectTableName"/>
                  <el-table-column label="数据类型" align="center" prop="dataType">
                    <template slot-scope="scope">
                      <div class="tac" v-if="scope.row.dataType=='1'">医院数据</div>
                      <div class="tac" v-if="scope.row.dataType=='2'">医保数据</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="采集人" align="center" prop="collectUserName"/>
                  <el-table-column label="进度" align="center" prop="collectStatus">
                      <template slot-scope="scope">
                          <el-progress v-if="scope.row.collectStatus=='0'" :percentage="0"></el-progress>
                          <el-progress v-if="scope.row.collectStatus=='1'" :percentage="50"></el-progress>
                          <el-progress v-if="scope.row.collectStatus=='2'" :percentage="100"></el-progress>
                          <el-progress v-if="scope.row.collectStatus=='3'" :percentage="0"></el-progress>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="日志">
                      <template slot-scope="scope">
                          <el-button @click="ybLogView(scope.row.collectPlanMonitorId)" type="text" size="small">查看</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </el-row>
          <el-row v-if="!isYbData">
            <el-table :data="collectionYyList" ref="collectionYyList" style="width: 100%">
                  <!-- <el-table-column label="批次" show-overflow-tooltip prop="hospitalCollectPlanBath"> </el-table-column> -->
                  <el-table-column label="医院名称" show-overflow-tooltip  prop="hospitalName"></el-table-column>
                  <el-table-column label="数据类型" align="center">
                    <template slot-scope="scope">医院数据</template>
                  </el-table-column>
                  <el-table-column label="采集人" align="center" prop="collectUserName"> </el-table-column>
                  <el-table-column label="进度" align="center" prop="collectStatus">
                      <template slot-scope="scope">
                          <el-progress v-if="scope.row.collectStatus=='0'" :percentage="0"></el-progress>
                          <el-progress v-if="scope.row.collectStatus=='1'" :percentage="50"></el-progress>
                          <el-progress v-if="scope.row.collectStatus=='2'" :percentage="100"></el-progress>
                          <el-progress v-if="scope.row.collectStatus=='3'" :percentage="0"></el-progress>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                          <el-button @click="yyCollectView(scope.row.hospitalCollectPlanId)" type="text" size="small">查看进度</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </el-row>
        </div>
      </el-col>
      <!-- 项目内数据表  -->
      <el-col :span="12">
        <div class="dataList">
          <div class="cardTitle">
            <el-row style="margin-left:10px">
              项目内数据表
              <div class="cardMore">
                 <el-button :class="isYbTable ? buttonClass :''" size="mini" round @click="getProjectTable(2)">医保数据</el-button>
                 <el-button :class="!isYbTable ? buttonClass :''" size="mini" round @click="getProjectTable(1)">医院数据</el-button>
                 <span @click="toDetailPage(isYbTable ? 'dataImp-ybDataImp' : 'dataImp-yyDataImp')">查看更多</span>
              </div>
            </el-row>
          </div>
          <el-row>
            <el-table :data="projectTable" style="width: 100%;" class="projectTable">
              <el-table-column prop="tableName" show-overflow-tooltip label="表名" />
              <el-table-column prop="numRows" show-overflow-tooltip align="center" label="数据量" width="65"/>
              <el-table-column prop="lastUpdate" show-overflow-tooltip align="center" label="更新时间" />
              <el-table-column  prop="tableSize" align="center" show-overflow-tooltip  label="大小"/> 
              <el-table-column header-align="center" align="center" label="操作" min-width="143">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="tableDataView(scope.row.tableName)">查看数据</el-button>
                  <el-button type="text" size="small" @click="tableColumnView(scope.row.tableName)">查看字段</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 医保采集监控查看日志 -->
    <el-dialog title='查看日志' :close-on-click-modal="false" width="60%" :modal-append-to-body="false" :visible.sync="yBCollectLogDialog">
          <yb-collect-log v-if="yBCollectLogDialog" @close="yBCollectLogDialog = false" @ok="yBCollectLogDialog = false" :collectPlanMonitorId="yBCollectPlanId"></yb-collect-log>
    </el-dialog>
    <!-- 医院采集监控查看进度弹框-->
    <el-dialog title='查看进度' :close-on-click-modal="false" width="80%" :modal-append-to-body="false" :visible.sync="yYCollectDialog">
        <yy-collect v-if="yYCollectDialog" @close="yYCollectDialog = false" @ok="yYCollectDialog = false" :collectPlanMonitorIds='yYCollectPlanId'></yy-collect>
    </el-dialog>
    <!-- 查看数据 -->
    <el-dialog
      :title="checkTableName"
      :visible.sync="tableDataViewDialogVisible"
      v-if="tableDataViewDialogVisible"
      width="70%"
      :close-on-click-modal="false">
      <data-view :table-name="checkTableName"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tableDataViewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看字段 -->
    <el-dialog
      :title="checkTableName"
      :visible.sync="tableColumnViewDialogVisible"
      v-if="tableColumnViewDialogVisible"
      width="50%"
      :close-on-click-modal="false">
      <column-view :table-name="checkTableName"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tableColumnViewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import YbCollectLog from '@/views/modules/dataAcquisition/component/edit.vue'
  import YyCollect from '@/views/modules/dataAcquisition/component/viewProgress.vue'
  import ColumnView from '@/views/modules/dataImp/columnView'
  import DataView from '@/views/modules/dataImp/dataView'
  export default {
    components:{
      // 医保采集日志
      YbCollectLog,
      // 医院采集进度
      YyCollect,
      // 查看列信息
      ColumnView,
      // 查看数据
      DataView
    },
    data(){
      return{
        // 代办列表
        todoList:[
          {
            'title': '吸痰护理每日收费违规',
            'roleType': '计费数量异常',
            'role': '共享规则',
            'isTrue': '是',
            'status': '已完成',
            'createUser': '刘专家',
            'createTime': '2022-03-24'
          },{
            'title': '吸痰护理每日收费违规',
            'roleType': '计费数量异常',
            'role': '共享规则',
            'isTrue': '是',
            'status': '已完成',
            'createUser': '刘专家',
            'createTime': '2022-03-24'
          },{
            'title': '吸痰护理每日收费违规',
            'roleType': '计费数量异常',
            'role': '共享规则',
            'isTrue': '是',
            'status': '已完成',
            'createUser': '刘专家',
            'createTime': '2022-03-24'
          },{
            'title': '吸痰护理每日收费违规',
            'roleType': '计费数量异常',
            'role': '共享规则',
            'isTrue': '是',
            'status': '已完成',
            'createUser': '刘专家',
            'createTime': '2022-03-24'
          }
        ],
        // 代办页签
        activeName: 'todo',
        // 按钮样式
        buttonClass: 'el-button--danger',
        // 是否选择医保，默认为医保
        isYbData: true,
        isYbTable: true,
        // 医保采集监控
        collectionYbList: [],
        // 医院采集监控
        collectionYyList: [],
        // 医保采集监控Id
        yBCollectPlanId: '',
        // 医保查看日志弹窗
        yBCollectLogDialog: false,
        // 医院查看日志弹窗
        yYCollectLogDialog: false,
        // 医院查看采集进度弹窗
        yYCollectDialog: false,
        // 医院采集监控Id
        yYCollectPlanId: '',
        // 项目内数据表
        projectTable: [],
        // 查看数据弹窗
        tableDataViewDialogVisible: false,
        // 查看表字段弹窗
        tableColumnViewDialogVisible: false,
        // 查看数据和表字段的表名
        checkTableName: '',
        // 项目信息
        project: {}
      }
    },
    computed: {
      // 项目Id
      projectId () {
        return this.$store.state.common.projectId;
      }
    },
    watch: {
      // 监听项目是否切换
      projectId (newVal, oldVal) {
        this.isYbData = true
        this.isYbTable = true
        // 默认为医保数据
        this.getCollectYbList()
        this.getProjectTable(2)
        this.getProjectMsg()
      }
    },
    activated () {
      // 默认为医保数据
      this.getCollectYbList()
      this.getProjectTable(2)
      this.getProjectMsg()
    },
    methods: {
      // 获取项目信息
      getProjectMsg(){
        if(this.projectId != '')
        this.$http({
          url: this.$http.adornUrl(`/xmProject/selectDetailsByProjectId/${this.projectId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.project = data.result.project
            this.project.projectCosts = []
            if (data.result.projectCosts) {
              for(var i=0;i< (data.result.projectCosts.length > 2 ? 2 : data.result.projectCosts.length);i++){
                this.project.projectCosts.push(data.result.projectCosts[i])
              }
            }
            
          }
        })
      },
      // 代办页签切换
      handleClick(tab, event) {

      },
      // 采集监控选择医保
      collectCheckYb(){
        this.isYbData = true
        this.getCollectYbList()
      },
      // 采集监控选择医院
      collectCheckYy(){
        this.isYbData = false
        this.getCollectYyList()
      },
      // 获取医保采集监控
      getCollectYbList(){
        this.collectionYbList = []
        this.$http({
            url:this.$http.adornUrl('/collectPlanMonitor/selectPageList'),
            method: 'get',
            params: this.$http.adornParams({
              pageSize:5,
              pageNo:1,
              dataType:2
            })
        }).then(({data}) =>{
            if(data && data.code === 200){
                this.collectionYbList = data.result.records     
            }else{
                this.collectionYbList = []
            }
        })
      },
      // 获取医院采集监控
      getCollectYyList(){
        this.collectionYyList = []
        this.$http({
            url:this.$http.adornUrl('/hospitalCollectPlan/selectPageList'),
            method: 'get',
            params: this.$http.adornParams({
              pageSize:5,
              pageNo:1,
              dataType:1
            })
        }).then(({data}) =>{
            if(data && data.code === 200){
                this.collectionYyList = data.result.records     
            }else{
                this.collectionYyList = []
            }
        })
      },
      // 医保查看日志
      ybLogView(id){
        this.yBCollectLogDialog = true
        this.yBCollectPlanId = id
      },
      // 医院查看进度
      yyCollectView(id) {
        this.yYCollectDialog = true
        this.yYCollectPlanId = id
      },
      // 获取项目内数据表
      getProjectTable(type){
        if(type == 2) {
          this.isYbTable = true
        } else{
          this.isYbTable = false
        }
        this.projectTable = []
        this.$http({
          url: this.$http.adornUrl('/dataInfoBase/selectPageByTableType'),
          method: 'get',
          params: this.$http.adornParams({
            'tableType': type
          }),
          isLoading: false
        }).then(({data}) => {
          if (data && data.code === 200) {
            if(data.result) {
            this.projectTable = []
              for(var i=0; i < (data.result.length>5 ? 5 : data.result.length);i++){
                this.projectTable.push(data.result[i])
              }
            }
          } else {
            this.projectTable = []
          }
        })
      },
      // 查看字段
      tableColumnView (tableName) {
        this.checkTableName = tableName
        this.tableColumnViewDialogVisible = true
      },
      // 查看数据
      tableDataView (tableName) {
        this.checkTableName = tableName
        this.tableDataViewDialogVisible = true
      },
      // 查看更多
      toDetailPage(pathName) {
        this.$router.push({ name: pathName })
      }
    }
  }
</script>

<style lang="scss" scoped>
/* 4个模块的公共样式 */
.projectInfo,.todoList,.collectionList,.dataList{
  font-size: 12px;
  border: 1px solid #eaedf1;
  border-radius: 20px;
  padding: 10px;
  overflow: hidden;
  /*模块标题 */
  .cardTitle{
    border-left: 5px solid #aa0f17;
    font-size: 14px;
    font-weight: 400;
    color: #1f2f3d;
    line-height: 16px;
    height: 16px;
    margin-bottom: 10px;
    .cardMore{
      float: right;
      font-size: 12px;
      color: #aa0f17;
      cursor: pointer;
    }
  }
}
.projectInfo,.todoList{
  height: 41vh;
}
.collectionList,.dataList{
  height: 38vh;
}

/*项目详情样式 */
.projectInfo{
  .restore_content{
    padding-bottom: 8px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .restore-label{
        margin-right: 10px;
        margin-left: 8px;
    }
  }
  .el-table{
    border-radius: 0;
  }
  /deep/ .el-table thead tr, /deep/ .el-table thead th {
    background: #aa0f17 !important;
    border-radius: 0;
    color: #ffffff;
  }
}

/*el-table样式 */
.el-table{
  border: 0;
  padding: 0;
  font-size: 12px;
  .el-table__row {
    height: 30px !important;
  }
  /deep/ td, /deep/ th {
    padding: 3px;
  }
}
/*代办样式 */
.todoList{
  /deep/ .el-table .el-table__header-wrapper {
	  padding-top: 0px;
  }
}
/* 采集监控样式*/
.collectionList,.dataList{
  /deep/ .el-button--mini, .el-button--mini.is-round,.el-button--text {
    padding: 5px 6px;
    border: 0;
    margin: 0;
  }
  .projectTable {
    .el-button--text {
      padding: 5px 2px;
    }
  }
  .el-button--text,.el-button--text:focus, .el-button--text:hover {
    color: #aa0f17;
    font-size: 11px ;
  }
  .cardMore .el-button:focus,.cardMore .el-button:hover {
    color: #aa0f17; 
    font-weight: 400;
    background: #f7edf0;
    }
  .el-button--danger{
    color: #aa0f17;
    font-weight: 400;
    background: #f7edf0;
  }
  /deep/ .el-progress__text{
    font-size: 12px !important;
  }
}

.mod-home {
  margin-top: 0;
}
</style>

