<template>
  <div class="yb-data-imp">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="表名:">
        <el-input v-model="dataForm.tableName" placeholder="数据表名称" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="最后更新时间:">
        <el-date-picker
          v-model="lastUpdateTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button @click="resetSelect()">重置</el-button>
        <span style="margin-left:30px;color:#af0f16">数据采集完成需要收集表信息，数据会造成时间差。</span>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="warning" @click="deletDmpData()">清除缓存数据</el-button>
        <el-button type="warning" @click="getDmpReImpList()">查看已导入dmp文件</el-button>
        <el-button type="warning" @click="getFileTree()">导入数据</el-button>
      </el-form-item>
    </el-form>
    <!-- height="60vh" -->
    <el-table
      :data="dataList"
      :height="tableHeight-26"
      border
      v-loading="dataListLoading"
      element-loading-text="努力加载中..."
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="tableName"
        align="center"
        label="表名">
      </el-table-column>
      <el-table-column
        prop="numRows"
        align="center"
        label="数据量">
      </el-table-column>
      <el-table-column
        prop="lastUpdate"
        align="center"
        label="最后更新时间">
      </el-table-column>
      <el-table-column
        prop="tableSize"
        align="center"
        label="大小">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="tableDataView(scope.row.tableName)">查看数据</el-button>
          <el-button type="text" size="small" @click="tableColumnView(scope.row.tableName)">查看字段</el-button>
          <!--<el-button v-if="isAuth('biz:pdbaidudate:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 文件树弹窗 -->
    <el-dialog
      title="导入数据"
      :visible.sync="fileTreeDialogVisible"
      width="70%"
      :close-on-click-modal="false"
      >
      <el-row  v-if="!hosBatchFlag">
        医院名称：
        <el-select v-model="hospitalName" placeholder="" filterable @blur="selectBlur" clearable>
          <el-option v-for="(item, index) in hospitalList"
                    :label="item['医疗机构名称']"
                    :value="item['医疗机构名称']"
                    :key="index"
          ></el-option>
          </el-select>
          <el-button type="primary" @click="getHosBatch">选择已有批次</el-button>
      </el-row>
      <el-row v-if="hosBatchFlag">
        批次名称：
        <el-select  v-model="hosBatchId" placeholder="" filterable clearable>
          <el-option v-for="(item, index) in hosBatchList"
                    :label="item.hospitalCollectPlanBath"
                    :value="item.hospitalCollectPlanId"
                    :key="index"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getHospital">选择医院</el-button>
      </el-row>
      <el-row style="font-weight:700">数据文件路径：<span style="color:red">{{sysPath}}</span></el-row>
      <!-- 文件树 -->
      <el-row :gutter="6">
        <el-col :span="12" style="height:36vh; overflow:auto;">
          <el-row>请选择导入文件:</el-row>
          <el-table
            ref="fileTree"
            v-loading="fileTreeLoading"
            stripe
            fit
            :data="fileTreeData"
            border
            highlight-current-row
            lazy
            row-key="path"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            @row-click="fileClick"
            style="cursor:pointer"
          >
            <el-table-column
              label="目录名称"
              align="left"
              prop="name"
            />
            <el-table-column
              label="文件类型"
              align="center"
              prop="fileType"
            />
            <el-table-column
              label="文件大小"
              align="center"
              prop="sizeString"
            />
          </el-table>
        </el-col>
        <!-- 已选择文件 -->
        <el-col :span="12" style="height:36vh; overflow:auto;">
          <el-row>已选文件:</el-row>
          <el-table
            title="已选文件"
            v-loading="fileTreeLoading"
            stripe
            fit
            :data="selectedFileData"
            border
            highlight-current-row
          >
            <el-table-column
              label="目录名称"
              align="left"
              prop="name"
            />
            <el-table-column
              label="文件类型"
              align="center"
              prop="fileType"
            />
            <el-table-column
              label="文件大小"
              align="center"
              prop="sizeString"
            />
          </el-table>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fileTreeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkFileTable">下一步</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="数据表匹配"
      :visible.sync="checkFileTableDialogVisible"
      v-if="checkFileTableDialogVisible"
      width="60%"
      :close-on-click-modal="false">
      <el-table
        border
        style="width: 100%;height:45vh; overflow:auto;"
        :row-class-name="tableRowClassName"
        :data="this.selectedFileData">
        <!-- fileTableInfos  -->
        <el-table-column
          align="center"
          label="文件名">
          <template slot-scope="scope">
            {{ scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="目标表">
            <template slot-scope="scope">
              <!-- scope.row[getMapKey(scope.row)] -->
              <el-select
                v-model="fileTableInfos[scope.row.path]"
                v-if="checkType(scope.row.fileType)"
                multiple
                value-key="tableInfoId"
                placeholder="请选择匹配表"
                >
                <el-option
                  v-for="itemdbm in tableInfos"
                  :key="itemdbm.tableInfoId"
                  :label="itemdbm.tableNameCn"
                  :value="itemdbm">
                </el-option>
              </el-select>
              <el-select
                v-model="fileTableInfos[scope.row.path][0]"
                v-if="!checkType(scope.row.fileType)"
                value-key="tableInfoId"
                placeholder="请选择匹配表"
                clearable
                @clear="setTableNull(scope.row.path)"
                filterable
                >
                <el-option
                  v-for="itemdbm in tableInfos"
                  :key="itemdbm.tableInfoId"
                  :label="itemdbm.tableNameCn"
                  :value="itemdbm">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkFileTableDialogVisible = false">返回上一步</el-button>
        <el-button type="primary" @click="findFileTable">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 字段匹配 -->
     <el-dialog
      title="字段匹配"
      :visible.sync="fileTableDialogVisible"
      width="60%"
      top="5vh"
      :close-on-click-modal="false"
      >
      <el-tabs
        v-model="fileTableActiveName"
        type="card"
        @tab-click="fileTabClick">
        <el-tab-pane v-for="(item,index) in importDataModelList" :label="item.fileName" :name="item.fileName" :key="index">
          <el-row>
            <el-col :offset="9">
              请选择要匹配的数据表：
              <el-select
                v-model="selectTableNames[index]"
                value-key="tableInfoId"
                filterable
                placeholder="请选择要匹配的数据表">
                <el-option
                  v-for="it in item.tableInfos"
                  :key="it.tableInfoId"
                  :label="it.tableNameCn"
                  :value="it.tableNameCn">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="width: 100%;height:39vh; overflow:auto; margin-top:10px">
            <el-table
              border
              style="width: 73%; overflow: auto; margin-left: 15%;"
              :data="item.fileColumnMaps[selectTableNames[index]]">
              <el-table-column
                prop="fileColumnName"
                align="center"
                label="数据表字段">
                <template slot-scope="scope">
                {{ getMapKey(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="dbColumn"
                align="center"
                label="目标表字段">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row[getMapKey(scope.row)]"
                      value-key="columnInfoId"
                      placeholder="请选择匹配字段"
                      filterable
                      clearable
                      @clear="setColumnNull(scope.row,getMapKey(scope.row))"
                      >
                      <el-option
                        v-for="itemdbm in item.dbColumns[selectTableNames[index]]"
                        :key="itemdbm.columnInfoId"
                        :label="itemdbm.columnNameCn"
                        :value="itemdbm">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fileTableDialogVisible = false">返回上一步</el-button>
        <el-button type="primary" @click="checkTableColumn">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 字段匹配预览 -->
     <el-dialog
      title="字段匹配预览"
      :visible.sync="columnTableDialogVisible"
      width="60%"
      top="5vh"
      :close-on-click-modal="false"
      >
      <el-tabs
        v-model="columnTableActiveName"
        type="card"
        @tab-click="columnTabClick">
        <el-tab-pane v-for="(item,index) in importDataModelList" :label="item.fileName" :name="item.fileName" :key="index">
          <el-row>
            <el-col :offset="9">
              请选择要预览的数据表：
              <el-select
                v-model="selectTableViewNames[index]"
                placeholder="请选择要预览的数据表">
                <el-option
                  v-for="it in item.tableInfos"
                  :key="it.tableInfoId"
                  :label="it.tableNameCn"
                  :value="it.tableNameCn">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="width: 100%;height:39vh; overflow:auto; margin-top:10px">
            <el-table
              border
              style="width: 73%; overflow: auto; margin-left: 15%;"
              :data="item.fileColumnMaps[selectTableViewNames[index]]">
              <el-table-column
                prop="fileColumnName"
                align="center"
                label="数据表字段">
                <template slot-scope="scope">
                {{ getMapKey(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="dbColumn"
                align="center"
                label="目标表字段">
                  <template slot-scope="scope">
                  {{ scope.row[getMapKey(scope.row)] ? scope.row[getMapKey(scope.row)].columnNameCn : ''}}
                  </template>
                </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="columnTableDialogVisible = false">返回上一步</el-button>
        <el-button type="primary" @click="impYYData">导入</el-button>
      </span>
    </el-dialog>
     <!-- dmp数据表匹配 -->
    <el-dialog
      title="数据表匹配"
      :visible.sync="checkDmpFileTableDialogVisible"
      width="60%"
      :close-on-click-modal="false">
      <el-table
        border
        style="width: 100%;height:45vh; overflow:auto;"
        :data="dmpImp.dmpTableInfoMaps">
        <el-table-column
          align="center"
          label="数据表">
          <template slot-scope="scope">
            {{ getMapKey(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="目标表">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row[getMapKey(scope.row)]"
                value-key="tableInfoId"
                placeholder="请选择匹配表"
                clearable
                filterable
                @clear="setColumnNull(scope.row,getMapKey(scope.row))"
                >
                <el-option
                  v-for="itemdbm in tableInfos"
                  :key="itemdbm.tableInfoId"
                  :label="itemdbm.tableNameCn"
                  :value="itemdbm">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, dmpImp.dmpTableInfoMaps)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDmpFileTableDialogVisible = false">返回上一步</el-button>
        <el-button type="primary" @click="findFileTableDmp">下一步</el-button>
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
    <!-- 查看数据 -->
    <el-dialog
      :title="checkTableName"
      :visible.sync="tableDataViewDialogVisible"
      v-if="tableDataViewDialogVisible"
      width="70%"
      :close-on-click-modal="false">
      <data-view :table-name="checkTableName" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="tableDataViewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="dmp还原日志"
      :visible.sync="dmpLogDialogVisible"
      width="60%"
      class="dmpLogDia"
      :before-close="dmpLoghandleClose"
      :close-on-click-modal="false">
      <el-row style="color:#af0f16">数据正在还原中，如果关闭则会造成垃圾，需要人工介入才能清理。</el-row>
      <el-row
        v-loading="dmpLogLoading"
        element-loading-text="数据库还原中..."> 
        <el-row style="width: 100%;height:42vh; overflow:auto;">
          <el-row
            v-for="(log,index) in webSocketDataList"
            :key="index">
            {{log}}
          </el-row>
        </el-row>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeLog" v-if="dmpImpFlag">{{countDown}}s</el-button>
        <el-button type="primary" @click="dmpLogDialogVisible = false" v-if="dmpImpFalseFlag">返回上一步</el-button>
      </span>
    </el-dialog>
    <el-dialog 
    title="已导入dmp文件"
      :visible.sync="dmpReImpDialogVisible"
      show-overflow-tooltip
      width="60%">
      <el-table
        border
        style="width: 100%;height:45vh; overflow:auto;"
        :data="dmpReImpList">
        <el-table-column
          align="center"
          prop="dmpFilePath"
          show-overflow-tooltip
          label="文件名"/>
          <el-table-column
          align="center"
          prop="endTime"
          label="采集结束时间"
          />
          <el-table-column
          align="center"
          prop="dmpStatus"
          label="采集状态"
          >
          <template slot-scope="scope">
            {{scope.row.dmpStatus == 1?"已完成":"失败"}}
          </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.dmpStatus == 1" @click.native.prevent="reImpDmp(scope.row)" type="text" size="small">继续采集</el-button>
              <el-button type="text" size="small" @click="delReImpDmp(scope.row)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dmpReImpDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ColumnView from './columnView'
  import DataView from './dataView'
  import {PxSocket} from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          tableName:'',
          //timeStart:'',
          //timeEnd:''
        },
        lastUpdateTime:'',
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        // 系统文件路径
        sysPath: '',
        // 控制文件夹树弹窗显示
        fileTreeDialogVisible: false,
        // 控制文件表弹窗
        fileTableDialogVisible: false,
        // 控制匹配预览弹窗
        columnTableDialogVisible: false,
        // 查看字段弹窗
        tableColumnViewDialogVisible: false,
        // 查看数据弹窗
        tableDataViewDialogVisible: false,
        // 匹配表弹窗
        checkFileTableDialogVisible: false,
        // dmp文件匹配表弹窗
        checkDmpFileTableDialogVisible: false,
        // dmp还原日志
        dmpLogDialogVisible: false,
        // dmp继续采集弹窗
        dmpReImpDialogVisible: false,
        // 医保表信息
        tableInfos: [],
        // 文件选中数据
        fileSelections: [],
        // 文件树
        fileTreeData: [],
        // 文件树加载
        fileTreeLoading: false,
        // 被选中的文件
        selectedFileData: [],
        // 字段匹配tab选中页名称
        fileTableActiveName: '',
        // 匹配预览tab选中页名称
        columnTableActiveName: '',
        // 匹配字段时选中的表
        selectTableNames: [],
        // 匹配预览是选中的表
        selectTableViewNames: [],
        // 查看表数据，表结构选中的表
        checkTableName: '',
        // 导入数据集合
        importDataModelList: [],
        // 文件名
        fileName: '',
        // 医院名
        hospitalName: '',
        // 医院采集路径
        hospitalPath: '',
        // 医院批次Id
        hosBatchId: '',
        // 医院批次名称
        hosBatchFlag: false,
        // 导入数据集合
        importDataModelList: [],
        // 文件表对应关系
        fileTableInfos: {},
        //dmp文件表对应关系
        dmpFileTables: [],
        // dmp文件对象
        dmpImp: {},
        // 所有医院列表
        hospitalList: [],
        // 所有医院批次列表
        hosBatchList: [],
        // 长连接
        webSocket: null,
        // webSocket返回值
        webSocketDataList: [],
        // 登录用户ID
        userId: sessionStorage.getItem("userId"),
        // dmp导入成功标志
        dmpImpFlag: false,
        // dmp导入失败标志
        dmpImpFalseFlag: false,
        // count 倒计时
        countDown: 0,
        //websocketId
        webSocketId: '',
        // 出错的文件
        errFiles: [],
        // dmp日志加载loading
        dmpLogLoading: true,
        // 继续导入的implist
        dmpReImpList: [],
        // 是否强行关闭了
        isForceColse: false
      }
    },
    computed:{
      tableHeight: {
        get () { return this.$store.state.common.tableHeight}
      },
    },
    components: {
      ColumnView,DataView
    },
    activated () {
      this.getDataList()
    },
    mounted(){
      this.webSocketId = this.getUuid()
      this.webSocket = new PxSocket({
          url:this.$http.wsUrl('websocket?' + this.webSocketId),
          succ: this.getLogList
        })
        // 当服务端打开连接
        this.webSocket.connect()
    },
    beforeDestory(){
      this.webSocket.close()
    },
    watch: {
      dmpImpFlag(val) {
        if(val) {
          this.countDown = 10
          this.countDmpDown()
        }
      },
      webSocketDataList(val) {
        this.dmpLogLoading = false
      }
    },
    methods: {
      deletDmpData(){
        this.$confirm('<span style="color:#af0f16">将删除该项目dmp文件采集中产生的所有数据，是否确认删除？</span>'
         ,{dangerouslyUseHTMLString: true,
          confirmButtonText: '确认'})
          .then(_ => {
            this.$http({
              url: this.$http.adornUrl(`dmpCollectPlan/deleteDmpUserAndTableSpace`),
              method: 'get',
            }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message.success("清除缓存数据成功")
                }else{
                  this.$message({
                    showClose: true,
                    message: data.message? data.message : "数据清除失败！",
                    type: 'error',
                    duration: 0
                  })
                }
            })
          })
      },
       //获取继续导入的dmp列表
      getDmpReImpList(){
        this.dmpReImpDialogVisible = true
        this.dmpReImpList = []
        this.$http({
          url: this.$http.adornUrl(`dmpCollectPlan/selectPage`),
          method: 'get',
          params: this.$http.adornParams({"busType":"1"})
        }).then(({data}) => {
            if (data && data.code == 200) {
              if(data.result != null) {
                this.dmpReImpList = data.result.records
              }
            }
        })
      },
      // 恢复采集dmp
      reImpDmp(data){
        this.checkDmpFileTableDialogVisible = true
        this.$http({
          url: this.$http.adornUrl(`dmpCollectPlan/startCollectDmp`),
          method: 'get',
          params: this.$http.adornParams({"dmpCollectPlanId":data.dmpCollectPlanId})
        }).then(({data}) => {
            if (data && data.code == 200) {
              if(data.result != null) {
                // 请求dmp
                this.dmpImp = data.result
                this.$http({
                  url: this.$http.adornUrl(`dataImp/getTableInfos/${1}`),
                  method: 'get'
                }).then(({data}) => {
                    if (data && data.code == 200) {
                      if(data.result != null) {
                        this.tableInfos = data.result
                      }
                    }
                })
              }
            }
        })
        
      },
      // 删除已导入的dmp文件
      delReImpDmp(data){
        this.$confirm('<span style="color:#af0f16">将删除该dmp文件采集中产生的所有数据，是否确认删除？</span>'
         ,{dangerouslyUseHTMLString: true,
          confirmButtonText: '确认'})
          .then(_ => {
            this.$http({
              url: this.$http.adornUrl(`dmpCollectPlan/delete/${data.dmpCollectPlanId}`),
              method: 'post'
            }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message.success("清除缓存数据成功")
                  this.getDmpReImpList()
                }else{
                  this.$message({
                    showClose: true,
                    message: data.message? data.message : "数据清除失败！",
                    type: 'error',
                    duration: 0
                  })
                }
            })
          })
      },
      // dmp日志关闭
      dmpLoghandleClose(done){
         this.$confirm('<span style="color:#af0f16">数据正在还原中，如果关闭则会造成垃圾，需要人工介入才能清理。</span>'
         ,{dangerouslyUseHTMLString: true,
          confirmButtonText: '仍要关闭'})
          .then(_ => {
            this.checkDmpFileTableDialogVisible = false
            this.isForceColse = true
            done()
          })
          .catch(_ => {})
      },
      // 检查文件获取表头情况
      tableRowClassName({row, rowIndex}){
        if(this.errFiles.length > 0) {
          let flag = this.errFiles.findIndex(item => item ==  row.name)
          if(flag != -1) {
            return 'warning-row'
          }
        }
        return ''
      },
      getUuid() {
        var s = []
        var hexDigits = '0123456789abcdef'
        for (var i = 0; i < 32; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23]
        var uuid = s.join('')
        return uuid
      },
      // 获取医院批次
      getHosBatch() {
        this.hosBatchFlag = true
        this.hosBatchId = ''
        this.hospitalName = ''
        this.$http({
          url: this.$http.adornUrl(`hospitalCollectPlan/selectList`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            // 获取医院批次列表
            this.hosBatchList = data.result
          }
        })
      },
      getHospital(){
        this.hosBatchFlag = false
        this.hospitalName = ''
        this.hosBatchId = ''
        this.$http({
          url: this.$http.adornUrl(`hospitalBasicInfo/getPageList`),
          method: 'get',
          params: this.$http.adornParams({
                'pageNum': 1,
                'pageSize': 1000,
            })
        }).then(({data}) => {
          if (data && data.code === 200) {
            // 获取医院列表
            this.hospitalList = data.result.result
          }
        })
      },
      // 关闭日志弹窗
      closeLog(){
          this.dmpLogDialogVisible = false
          this.checkDmpFileTableDialogVisible = true
          this.countDown = 0
      },
       // 倒计时十秒
      countDmpDown(){
        if(this.countDown && this.countDown>0) {
          this.timer = setInterval(()=>{
            this.countDown--
            if(this.countDown==0){
              clearInterval(this.timer)
              this.dmpLogDialogVisible = false
               if(!this.isForceColse) {
                  this.checkDmpFileTableDialogVisible = true
               }
            }
          },1000)
        }
      },
      //获取sql运行websocket返回的数据
      getLogList(datas){
        if(datas && datas != 'ping'){
          datas=JSON.parse(datas)
          if(datas.data){
             this.webSocketDataList.push(datas.data)
          }
          if(datas.code && datas.code == 200) {
            // 单次导入成功
            this.dmpImpFlag = true
          }
          if(datas.code && datas.code == 500) {
            // 单次导入失败
            this.dmpImpFalseFlag = true
          }
        }
      },
      // 获取医保数据文件树
      getFileTree () {
        this.fileTreeData = []
        this.selectedFileData = []
        this.fileTreeDialogVisible = true
        this.fileTreeLoading = true
        // 医院名称清空
        this.hospitalName = ''
        this.fileName = ''
        this.hosBatchFlag = false
        this.$http({
          url: this.$http.adornUrl(`dataImp/getFileTree/${1}`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            // 获取文件数据
            this.fileTreeData = data.result.fileTree
            // 获取系统地址
            this.sysPath = data.result.sysPath
          }
        })
        this.getHospital()
        this.fileTreeLoading = false
      },
      // 获取输入项
      selectBlur(e){
        this.hospitalName= e.target.value
      },
      // 检查文件和匹配的表信息
      checkFileTable () {
        this.errFiles = []
        if (this.selectedFileData.length == 0) {
          this.$message.error("请选择要采集的文件")
          return
        }
        if(this.hosBatchFlag) {
          if(this.hosBatchId == '') {
             this.$message.error("请选择批次")
             return
          }
        } else{
          if(this.hospitalName == '') {
             this.$message.error("请选择医院")
             return
          }
        }
         // 不包含dmp的标准
        var flag = true
        // 全为 dmp的标准
        var dmpFileFlag = true
        this.selectedFileData.forEach(item=>{
          if(!this.checkType(item.fileType)) {
            dmpFileFlag = false
          }
          if(this.checkType(item.fileType)) {
            flag = false
          }
        })
        // 包含dmp但是不全为dmp
        if(!flag && !dmpFileFlag) {
          this.$message.error("dmp文件不能和其它类型文件一起导入")
          return
        }
        if(dmpFileFlag) {
          if (this.selectedFileData.length >1) {
            this.$confirm('<span style="color:#af0f16">检测到选择了多个dmp文件，只有分卷dmp可以批量导入，请确认您选择的文件是否为分卷dmp，若不是请返回上一步<span>', '确认信息', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '返回上一步'
            })
            .then(() => {
              // dmp还原日志
              this.webSocketDataList = []
              this.webSocketDataList.push('正在还原文件，请耐心等待......')
              this.dmpLogLoading = true
              this.dmpImpFlag = false
              this.dmpImpFalseFlag = false
              this.dmpLogDialogVisible = true
               this.timer = setInterval(()=>{
                if(this.dmpImpFlag || this.dmpImpFalseFlag) {
                    this.dmpLogLoading = false
                }
                if(!this.dmpImpFlag && !this.dmpImpFalseFlag) {
                  this.dmpLogLoading = true
                }
              },3000)
              this.$http({
                url: this.$http.adornUrl(`dataImp/impDmpFile/${1}/${this.webSocketId}`),
                method: 'post',
                data: this.selectedFileData
              }).then(({data}) => {
                  if (data && (data.code === 200 || data.code == 500) && data.result) {
                    //  this.fileTableInfos = data.result
                    //  this.findFileTable()
                  //} else if (data && data.code == 500 && data.result) {
                    //this.dmpFileTables = data.result
                    this.dmpImp = data.result
                    this.$http({
                      url: this.$http.adornUrl(`dataImp/getTableInfos/${1}`),
                      method: 'get'
                    }).then(({data}) => {
                        if (data && data.code == 200) {
                          if(data.result != null) {
                            this.tableInfos = data.result
                          }
                        }
                    })
                    //this.checkDmpFileTableDialogVisible = true
                  } else {
                    this.$message({
                      showClose: true,
                      message: data.message? data.message : "读取文件失败，请检查数据文件！",
                      type: 'error',
                      duration: 0
                    })
                  }
              })
              return
            })
            .catch(action => {
              return
            });
            return
          }
          if(this.selectedFileData.length ==1) {
            // dmp还原日志
            this.webSocketDataList = []
            this.webSocketDataList.push('正在还原文件，请耐心等待......')
            this.dmpLogLoading = true
            this.dmpImpFlag = false
            this.dmpImpFalseFlag = false
            this.dmpLogDialogVisible = true
             this.timer = setInterval(()=>{
                if(this.dmpImpFlag || this.dmpImpFalseFlag) {
                    this.dmpLogLoading = false
                }
                if(!this.dmpImpFlag && !this.dmpImpFalseFlag) {
                  this.dmpLogLoading = true
                }
              },3000)
            this.$http({
              url: this.$http.adornUrl(`dataImp/impDmpFile/${1}/${this.webSocketId}`),
              method: 'post',
              data: this.selectedFileData
            }).then(({data}) => {
                if (data && (data.code === 200 || data.code == 500) && data.result) {
                  //  this.fileTableInfos = data.result
                  //  this.findFileTable()
                //} else if (data && data.code == 500 && data.result) {
                  //this.dmpFileTables = data.result
                  this.dmpImp = data.result
                  this.$http({
                    url: this.$http.adornUrl(`dataImp/getTableInfos/${1}`),
                    method: 'get'
                  }).then(({data}) => {
                      if (data && data.code == 200) {
                        if(data.result != null) {
                          this.tableInfos = data.result
                        }
                      }
                  })
                  //this.checkDmpFileTableDialogVisible = true
                } else {
                  this.$message({
                    showClose: true,
                    message: data.message? data.message : "读取文件失败，请检查数据文件！",
                    type: 'error',
                    duration: 0
                  })
                }
            })
            return
          }
        }
        if(flag){
          this.$http({
            url: this.$http.adornUrl(`dataImp/checkFileTable/${1}`),
            method: 'post',
            data: this.selectedFileData
          }).then(({data}) => {
              if (data && (data.code === 200 || data.code == 500) && data.result) {
                //  this.fileTableInfos = data.result
                //  this.findFileTable()
              //} else if (data && data.code == 500 && data.result) {
                this.fileTableInfos = data.result
                this.$http({
                  url: this.$http.adornUrl(`dataImp/getTableInfos/${1}`),
                  method: 'get'
                }).then(({data}) => {
                    if (data && data.code == 200) {
                      if(data.result != null) {
                        this.tableInfos = data.result
                      }
                    }
                })
                this.checkFileTableDialogVisible = true
              } else {
                this.$message({
                  showClose: true,
                  message: data.message? data.message : "读取文件失败，请检查数据文件！",
                  type: 'error',
                  duration: 0
                })
              }
          })
         }
      },
      // dmp文件匹配
      findFileTableDmp(){
        //const map = new Map();
       // map.set(this.selectedFileData[0].path,this.dmpFileTables)
       // const path = this.selectedFileData[0].path
        //this.fileTableInfos = {}
        //this.fileTableInfos[this.selectedFileData[0].path] = this.dmpFileTables
        if(!this.dmpImp.filePath) {
            this.dmpImp.filePath = this.selectedFileData[0].path
        }
        this.$http({
          url: this.$http.adornUrl(`dataImp/getDmpFileTable/${1}`),
          method: 'post',
          data: this.dmpImp
        }).then(({data}) => {
          if (data && data.code === 200) {
            // 获取表和列的信息
            if (data.result != null) {
              this.importDataModelList = data.result
              // 页签默认选中第一个
              this.fileTableActiveName = this.importDataModelList[0].fileName
              this.selectTableNames[0] = this.importDataModelList[0].tableInfos[0].tableNameCn
              this.columnTableActiveName = this.importDataModelList[0].fileName
              this.selectTableViewNames[0] =this.importDataModelList[0].tableInfos[0].tableNameCn
            }
            // 打开文件表弹窗
            this.fileTableDialogVisible = true
          } else {
            this.$message({
              showClose: true,
              message: data.message? data.message : "读取文件失败，请检查数据文件！",
              type: 'error',
              duration: 0
            })
          }
        })

      },
      // 获取文件中涉及到的表名
      findFileTable () {
        this.$http({
          url: this.$http.adornUrl(`dataImp/getFileTable/${1}`),
          method: 'post',
          data: this.fileTableInfos
        }).then(({data}) => {
          if (data && data.code === 200) {
            // 获取表和列的信息
            if (data.result != null) {
              this.importDataModelList = data.result
              // 页签默认选中第一个
              this.fileTableActiveName = this.importDataModelList[0].fileName
              this.selectTableNames[0] = this.importDataModelList[0].tableInfos[0].tableNameCn
              this.columnTableActiveName = this.importDataModelList[0].fileName
              this.selectTableViewNames[0] =this.importDataModelList[0].tableInfos[0].tableNameCn
            }
            // 打开文件表弹窗
            this.fileTableDialogVisible = true
          } else {
            if(data.result != null) {
              this.errFiles = data.result
              this.$message({
                showClose: true,
                message: data.message? data.message : "读取文件失败，请检查数据文件！",
                type: 'error',
                duration: 0
              })
            } else {
              this.$message({
                showClose: true,
                message: data.message? data.message : "读取文件失败，请检查数据文件！",
                type: 'error',
                duration: 0
              })
            }
          }
        })
      },
      // 获取map的key
      getMapKey(map) {
        for (const key in map) {
         return key
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        // this.dataForm.timeStart=this.value1[0];
        // this.dataForm.timeEnd=this.value1[1];
        this.$http({
          url: this.$http.adornUrl('/dataInfoBase/selectPageByTableType'),
          method: 'get',
          params: this.$http.adornParams({
            'tableType': 1,
            'tableName': this.dataForm.tableName
          }),
          isLoading: false
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result;
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
        //this.dataList = [{ tableName : "医保病案首页",tableSize: 11 ,numRows: 123,lastUpdateTime: "2020-01-02"},
        //{ tableName : "医保医疗机构信息",tableSize: 11 ,numRows: 123,lastUpdateTime: "2020-01-02"}]
      },
      // 列表多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 匹配页签切换
      fileTabClick (tab, event) {
        this.selectTableNames[tab.index] = this.importDataModelList[tab.index].tableInfos[0].tableNameCn
      },
      // 匹配预览
      columnTabClick (tab, event) {
        this.selectTableViewNames[tab.index] = this.importDataModelList[tab.index].tableInfos[0].tableNameCn
      },
      // 查看字段匹配情况
      checkTableColumn () {
        // 校验列信息是否重复
         this.$http({
          url: this.$http.adornUrl('dataImp/checkColumn'),
          method: 'post',
          data: this.importDataModelList
        }).then(({data}) => {
          if (data && data.code !== 200){
            this.$message({
              showClose: true,
              message: data.message? data.message : "文件数据列信息重复",
              type: 'error',
              duration: 0
            })
            return
          }
          if (data && data.code === 200) {
            this.columnTableDialogVisible = true
          }
        })
      },
      // 导入数据
      impYYData () {
        this.$http({
          url: this.$http.adornUrl(`dataImp/impData/${1}/${this.hospitalName? this.hospitalName: -1}/${this.fileName}/${this.hosBatchId ? this.hosBatchId: -1}`),
          method: 'post',
          data: this.importDataModelList,
          isLoading: false
        }).then(({data}) => {
          //if (data && data.code === 200) {
           // this.$message.success("导入成功")
         // }else {
          //  this.$message.error(data.message? data.message : "导入失败，请检查数据文件！")
         // }
        })
        this.$message.success("数据采集已开始，请前往采集进度监控进行查看")
        // 控制文件夹树弹窗
        this.fileTreeDialogVisible = false
        // 控制文件表弹窗
        this.fileTableDialogVisible = false
        // 控制匹配预览弹窗
        this.columnTableDialogVisible = false
        // 查看字段弹窗
        this.tableColumnViewDialogVisible = false
        // 表匹配弹窗
        this.checkFileTableDialogVisible = false
        // dmp表匹配弹窗
        this.checkDmpFileTableDialogVisible = false
      },
      // 查看字段
      tableColumnView (tableName) {
        this.checkTableName = tableName
        this.tableColumnViewDialogVisible = true
      },
      tableDataView (tableName) {
        this.checkTableName = tableName
        this.tableDataViewDialogVisible = true
      },
      // 重置查询条件
      resetSelect() {
         this.dataForm.tableName = null
      },
      // 文件类型是否为dmp或者bak
      checkType(fileType) {
        //case 'BAK':
         switch (fileType.toUpperCase()) {
            case 'DMP':
              return true
              break
          }
          return false
      },
      // 数据表匹配清空
      setTableNull(val) {
        this.fileTableInfos[val] = []
      },
      deleteRow(index, rows) {
        rows.splice(index, 1)
      },
      // 列清空
      setColumnNull(val,key) {
        val[key] = null
      },
      // 点击文件树
      fileClick(row){
        if (row.ifDir) {
          this.selectedFileData = []
          this.hospitalName = row.name
          this.fileName = row.name
          this.hospitalPath = row.path
          row.children.forEach(item => {
            // 去除选中的文件夹
            if (!item.ifDir) {
              this.selectedFileData.push(item)
            }
          })
        }
      }
    }
  }
</script>
<style scoped lang="scss">
/deep/.el-table .warning-row {
    color: #af0f16;
  }
  
.dmpLogDia /deep/ .el-loading-mask {
	background-color: rgba(255,255,255,.1);
}
</style>
