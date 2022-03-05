<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="表名:">
        <el-input v-model="dataForm.tableName" placeholder="数据表名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="最后更新时间:">
        <el-date-picker
          v-model="lastUpdateTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="getFileTree()">导入数据</el-button>
        <!--<el-button v-if="" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <!-- <el-row justify="end">
      <el-col>
        <el-button type="primary" size="small" @click="getDataList()">导入数据</el-button>
      </el-col>
    </el-row> -->
    <el-table
      :data="dataList"
      height="80vh"
      border
      v-loading="dataListLoading"
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
        prop="dataNumber"
        align="center"
        label="数据量">
      </el-table-column>
      <el-table-column
        prop="lastUpdateTime"
        align="center"
        label="最后更新时间">
      </el-table-column>
      <el-table-column
        prop="dataSize"
        align="center"
        label="大小">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">查看数据</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">查看字段</el-button>
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
    <!-- 文件树弹窗 -->
    <el-dialog
      title="导入数据"
      :visible.sync="fileTreeDialogVisible"
      width="70%"
      :close-on-click-modal="false"
      >
      <!-- 文件树 -->
      <el-row :gutter="6" >
        <el-col :span="12">
          <el-row>请选择导入文件:</el-row>
          <el-table
            ref="fileTree"
            title="请选择导入文件"
            v-loading="fileTreeLoading"
            stripe
            fit
            style="width: 100%;height:45vh; overflow:auto;"
            :data="fileTreeData"
            border
            highlight-current-row
            max-height="800"
            lazy
            row-key="path"
            @select="selectFiles"
            @select-all="selectAllFiles"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
            />
            <el-table-column
              label="目录名称"
              align="left"
              width="200"
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
        <el-col :span="12">
          <el-row>已选文件:</el-row>
          <el-table
            title="已选文件"
            v-loading="fileTreeLoading"
            stripe
            fit
            style="width: 100%;height:45vh; overflow:auto;"
            :data="selectedFileData"
            border
            highlight-current-row
            max-height="800"
          >
            <el-table-column
              label="目录名称"
              align="center"
              width="200"
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
        <el-button type="primary" @click="findFileTable">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 字段匹配 -->
     <el-dialog
      title="字段匹配"
      :visible.sync="fileTableDialogVisible"
      width="60%"
      :close-on-click-modal="false"
      >
      <el-tabs
        style="width: 100%;height:45vh; overflow:auto;"
        v-model="fileTableActiveName"
        type="card"
        @tab-click="fileTabClick">
        <el-tab-pane v-for="(item,index) in fileNameList" :label="item" :name="item" :key="index">
          <el-row>
            <el-col :offset="9">
              请选择要匹配的数据表：
              <el-select
                v-model="selectTableNames[index]"
                value-key="tableInfoId"
                placeholder="请选择要匹配的数据表">
                <el-option
                  v-for="it in fileTableMap[item]"
                  :key="it.tableInfoId"
                  :label="it.tableNameCn"
                  :value="it.tableNameCn">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-table
            border
            style="width: 70%; overflow: auto; margin-left: 15%; margin-top:10px"
            :data="fileColumnMap[selectTableNames[index]]">
            <el-table-column
              prop="fileColumnName"
              align="center"
              label="数据表字段">
              <template slot-scope="scope">
               {{scope.row.fileColumnName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="dbColumn"
              align="center"
              label="目标表字段">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.dbColumn"
                    value-key="columnInfoId"
                    placeholder="请选择匹配字段">
                    <el-option
                      v-for="itemdbm in dbColumnMap[selectTableNames[index]]"
                      :key="itemdbm.columnInfoId"
                      :label="itemdbm.columnNameCn"
                      :value="itemdbm">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fileTableDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkTableColumn">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 字段匹配预览 -->
     <el-dialog
      title="字段匹配预览"
      :visible.sync="columnTableDialogVisible"
      width="60%"
      :close-on-click-modal="false"
      >
      <el-tabs
        style="width: 100%;height:45vh; overflow:auto;"
        v-model="columnTableActiveName"
        type="card"
        @tab-click="columnTabClick">
        <el-tab-pane v-for="(item,index) in fileNameList" :label="item" :name="item" :key="index">
          <el-row>
            <el-col :offset="9">
              请选择要预览的数据表：
              <el-select
                v-model="selectTableViewNames[index]"
                placeholder="请选择要预览的数据表">
                <el-option
                  v-for="it in fileTableMap[item]"
                  :key="it.tableInfoId"
                  :label="it.tableNameCn"
                  :value="it.tableNameCn">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-table
            border
            style="width: 70%; overflow: auto; margin-left: 15%; margin-top:10px"
            :data="fileColumnMap[selectTableViewNames[index]]">
            <el-table-column
              prop="fileColumnName"
              align="center"
              label="数据表字段">
              <template slot-scope="scope">
               {{scope.row.fileColumnName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="dbColumn"
              align="center"
              label="目标表字段">
                <template slot-scope="scope">
                 {{scope.row.dbColumn ? scope.row.dbColumn.columnNameCn : ''}}
                </template>
              </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="columnTableDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="impYBData">导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          tableName:'',
          timeStart:'',
          timeEnd:''
        },
        lastUpdateTime:'',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        // 控制文件夹树弹窗显示
        fileTreeDialogVisible: false,
        // 控制文件表弹窗
        fileTableDialogVisible: false,
        // 控制匹配预览弹窗
        columnTableDialogVisible: false,
        // 文件选中数据
        fileSelections: [],
        // 文件树
        fileTreeData: [],
        // 文件树加载
        fileTreeLoading: false,
        // 被选中的文件
        selectedFileData: [],
        // 文件表结构信息
        fileColumnMap: {},
        // 数据表结构信息
        dbColumnMap: {},
        // 数据表集合
        tableNameList: [],
        // 字段匹配tab选中页名称
        fileTableActiveName: '',
        // 匹配预览tab选中页名称
        columnTableActiveName: '',
        // 文件表信息
        fileTableMap: {},
        // 文件列表
        fileNameList: [],
        // 匹配字段时选中的表
        selectTableNames: [],
        // 匹配预览是选中的表
        selectTableViewNames: []
      }
    },
    components: {
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取医保数据文件树
      getFileTree () {
        this.fileTreeDialogVisible = true
        this.fileTreeLoading = true
        this.$http({
          url: this.$http.adornUrl('ybDataImp/getFileTree'),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 200) {
            // 获取文件数据
            this.fileTreeData = data.result
          }
        })
        this.fileTreeLoading = false
      },
      // 选中文件
      handleSelectionChange (val) {
        this.selectedFileData = []
        this.fileSelections = val
        this.fileSelections.forEach(item => {
          // 去除选中的文件夹
          if (!item.ifDir) {
            this.selectedFileData.push(item)
          }
        })
      },
      setChildren (children, type) {
        // 编辑多个子层级
        children.map((j) => {
          this.toggleSelection(j, type)
          if (j.children) {
            this.setChildren(j.children, type)
          }
        })
      },
      // 选中父节点时，子节点一起选中取消
      selectFiles (selection, row) {
        if (
          selection.some((el) => {
            return row.path === el.path
          })
        ) {
          if (row.children) {
            // 解决子组件没有被勾选到
            this.setChildren(row.children, true)
          }
        } else {
          if (row.children) {
            this.setChildren(row.children, false)
          }
        }
      },
      toggleSelection (row, select) {
        if (row) {
          this.$nextTick(() => {
            this.$refs.fileTree && this.$refs.fileTree.toggleRowSelection(row, select)
          })
        }
      },
      // 选择全部
      selectAllFiles (selection) {
        // tabledata第一层只要有在selection里面就是全选
        const isSelect = selection.some((el) => {
          const treePaths = this.fileTreeData.map((j) => j.path)
          return treePaths.includes(el.path)
        })
        // tableDate第一层只要有不在selection里面就是全不选
        const isCancel = !this.fileTreeData.every((el) => {
          const selectPaths = selection.map((j) => j.path)
          return selectPaths.includes(el.path)
        })
        if (isSelect) {
          selection.map((el) => {
            if (el.children) {
              // 解决子组件没有被勾选到
              this.setChildren(el.children, true)
            }
          })
        }
        if (isCancel) {
          this.fileTreeData.map((el) => {
            if (el.children) {
              // 解决子组件没有被勾选到
              this.setChildren(el.children, false)
            }
          })
        }
        this.$emit('handleSelect', this.fileTreeData)
      },
      // 获取文件中涉及到的表名
      findFileTable () {
        this.$http({
          url: this.$http.adornUrl('ybDataImp/getFileTable'),
          method: 'post',
          data: this.selectedFileData
        }).then(({data}) => {
          if (data && data.code === 200) {
            // 获取表和列的信息
            if (data.result != null) {
              this.tableNameList = []
              this.fileNameList = []
              this.fileColumnMap = data.result.fileColumnMap
              this.dbColumnMap = data.result.dbColumnMap
              this.fileTableMap = data.result.fileTableMap
              // 获取表名
              for (const key in this.dbColumnMap) {
                this.tableNameList.push(key)
              }
              // 获取文件名
              for (const key in this.fileTableMap) {
                this.fileNameList.push(key)
              }
              // 页签默认选中第一个
              this.fileTableActiveName = this.fileNameList[0]
              this.selectTableNames[0] = this.fileTableMap[this.fileTableActiveName][0].tableNameCn
              this.columnTableActiveName = this.fileNameList[0]
              this.selectTableViewNames[0] = this.fileTableMap[this.fileTableActiveName][0].tableNameCn
            }
            // 打开文件表弹窗
            this.fileTableDialogVisible = true
          }
        })
      },
      // 获取数据列表
      getDataList () {
        // this.dataListLoading = true;
        // this.dataForm.timeStart=this.value1[0];
        // this.dataForm.timeEnd=this.value1[1];
        // this.$http({
        //   url: this.$http.adornUrl('/jinding/sum/list'),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     'pageNum': this.pageIndex,
        //     'pageSize': this.pageSize,
        //     // 'monthTime': this.dataForm.monthTime||'',
        //     // 'dayTime': this.dataForm.dayTime||'',
        //     'timeStart': this.dataForm.timeStart,
        //     'timeEnd': this.dataForm.timeEnd,
        //     'materialsName':this.dataForm.materialsName
        //   })
        // }).then(({data}) => {
        //   if (data && data.code === 10000) {
        //     this.dataList = data.data;
        //     for(var i in this.dataList){
        //       this.dataList[i].trainWeigh=this.dataList[i].sumWeigh-this.dataList[i].carWeigh
        //     }
        //     this.totalPage = data.total
        //   } else {
        //     this.dataList = []
        //     this.totalPage = 0
        //   }
        //   this.dataListLoading = false
        // })
        this.dataList = [{ tableName : "aaa",dataSize: 11 ,dataNumber: 123,lastUpdateTime: "2020-01-02"}]
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
      // 列表多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 匹配页签切换
      fileTabClick (tab, event) {
        this.selectTableNames[tab.index] = this.fileTableMap[tab.label][0].tableNameCn
      },
      // 匹配预览
      columnTabClick (tab, event) {
        this.selectTableViewNames[tab.index] = this.fileTableMap[tab.label][0].tableNameCn
      },
      // 查看字段匹配情况
      checkTableColumn () {
        this.columnTableDialogVisible = true
      },
      // 导入数据
      impYBData () {
        // 参数为 this.fileColumnMap 结构为Map<String,List<JSONObject>> JSONObject=>fileColumnName String,dbColumn Object
        this.$http({
          url: this.$http.adornUrl('ybDataImp/impYBData'),
          method: 'post',
          data: {tableColumnMap: this.fileColumnMap, fileTableMap: this.fileTableMap, files: this.selectedFileData}
        }).then(({data}) => {
          if (data && data.code === 200) {

          }
        })
      }
    }
  }
</script>
