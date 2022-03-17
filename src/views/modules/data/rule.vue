<template>
  <div>
    <div class="box">
      <div class="left list-left-tree">
        <div class="custom-tree-container">
          <!-- <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input> -->
          <!-- <el-tree
            class="treeClass"
            :data="treeData"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="tree-btn">
                <el-button
                  type="text"
                  size="mini"
                  @click="() => append(data,'add')">
                  <i class="el-icon-circle-plus-outline" title="新增"></i>
                </el-button>
                 <el-button
                   type="text"
                   size="mini"
                   @click="() => append(data,'edit')">
                  <i class="el-icon-edit" title="编辑"></i>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
                  <i class="el-icon-delete" title="删除"></i>
                </el-button>
              </span>
            </span>
          </el-tree> -->
          <ruleTree ref="ruleTree" :isShowSearch="true" :isShowCheckBox="false" :isShowEdit="true" parentGetTreeData="getTreeData"></ruleTree>
        </div>
      </div>
      <div class="right">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="规则名称:">
            <el-input v-model="dataForm.ruleName" placeholder="规则名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建人:">
            <el-input v-model="dataForm.createUserName" placeholder="创建人" clearable></el-input>
          </el-form-item>
          <!--<el-form-item label="风险等级:">-->
            <!--<el-select clearable  v-model="dataForm.fuelType" placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in ryzl"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="pageIndex=1,getDataList()">查询</el-button>
            <el-button @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="search-btn">
          <el-button type="primary" @click="addOrUpdateHandle('')">新增</el-button>
          <!--<el-button type="primary" @click="getDataList()">修改</el-button>-->
          <el-button type="warning" @click="ruleImport">导入</el-button>
          <el-button type="warning" @click="ruleExport('all')" :loading="ruleExportAllLoading">全部导出</el-button>
          <el-button type="warning" @click="ruleExport('one')" :loading="ruleExportLoading">导出</el-button>
          <!--<el-button type="danger" @click="getDataList()">删除</el-button>-->
        </div>
        <el-table
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
            prop="ruleName"
            align="center"
            label="规则名称">
          </el-table-column>
          <el-table-column
            prop="avgRunTime"
            header-align="center"
            align="center"
            label="平均运行时间">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="createUserName"
            header-align="center"
            align="center"
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="ruleType"
            header-align="center"
            align="center"
            label="规则类型">
            <template slot-scope="scope">
              {{scope.row.ruleType=='1'?'sql编辑器':scope.row.ruleType=='2'?'图形化':''}}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small"
                         @click="addOrUpdateHandle(scope.row.ruleId)">修改
              </el-button>
              <el-button type="text" size="small"
                         @click="deleteHandle(scope.row.ruleId)">删除
              </el-button>
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
      </div>

    </div>
    <el-dialog :title="treeTitle" :visible.sync="treeVisible">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeVisible = false">取 消</el-button>
        <el-button type="primary" @click="treeVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update  ref="addOrUpdate" @refreshDataList="getDataList" :ruleData="ruleData"></add-or-update>
    <Import-file ref="ImportFile"></Import-file>
  </div>
</template>

<script>
import AddOrUpdate from './rule-add-or-update'
import ruleTree from '../../common/rule-tree.vue'
import ImportFile from './Import-file.vue'
  export default {
    data () {
      return {
        ruleData:{},//组件规则数数据
        form:{
          name:'',
        },
        treeTitle:'',
        treeVisible:false,

        path:window.SITE_CONFIG.cdnUrl,
        dataForm: {
          ruleName: '',
          createUserName: '',
          folderPath:'',//规则分类主键
          folderId: '',
        },
        token:'',
        imgUrlfront:'',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        ImgPreVisible:false,
        drVisibel:false,
        ryzl:[
          {
            value: '柴油',
            label: '柴油'
          },
          {
            value: '天然气',
            label: '天然气'
          },
          {
            value: '纯电动',
            label: '纯电动'
          },
          {
            value: '油电混动',
            label: '油电混动'
          },
        ],
        pfbz: [
          {
            value: '国五',
            label: '国五'
          }, {
            value: '国六',
            label: '国六'
          }],
        ruleExportLoading: false,
        ruleExportAllLoading: false,
        ruleCheckData: {}
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    components: {
      ruleTree,
      AddOrUpdate,
      ImportFile
    },
    activated () {
      // this.getDataList();
      this.getRuleFolder();
    },
    mounted () {
      this.$bus.$on('updateRuleData', () => {
        this.getRuleFolder()
      });
    },
    methods: {
      // 新增 / 修改
      addOrUpdateHandle (id) {
        // this.addOrUpdateVisible = true
        // this.$nextTick(() => {
          if (id) {
            this.$refs.addOrUpdate.init(id,this.ruleCheckData)
          } else {
            this.$refs.addOrUpdate.init('',this.ruleCheckData)
          }

        // })
      },
      // 获取规则树
      getRuleFolder () {
        this.$http({
          url: this.$http.adornUrl('/ruleFolder/getRuleFolder'),
          method: 'get',
          params: this.$http.adornParams({folderSorts: ''})
        }).then(({data}) => {
          this.ruleData = data.result;
        })
      },
      //重置点击
      reset(){
        this.dataForm.ruleName = '';
        this.dataForm.createUserName = ''
        this.pageIndex=1;
        this.pageSize=10;
      },
      // 获取数据列表
      getDataList () {
        // 判断不选左侧规则节点列表为空
        if (!this.ruleCheckData.folderId) {
          this.$message({message: '请选择对应的规则分类',type: 'warning'});
          return;
        }

        this.dataListLoading = true
        // 如何改规则节点有子节点的话folderId为空
        if (this.ruleCheckData.children) {
          this.dataForm.folderId = '';
        }
        this.$http({
          isLoading: false,
          url: this.$http.adornUrl('/rule/selectPage'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNo': this.pageIndex,
            'pageSize': this.pageSize,
            'ruleName': this.dataForm.ruleName,
            'createUserName': this.dataForm.createUserName,
            'folderPath': this.dataForm.folderPath,
            'folderId': this.dataForm.folderId,
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result.records
            this.totalPage = data.result.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 批量导出
      ruleExport (isAll) {
        var exportList = []
        // 判断是否为全部导出，全部导出的话exportList为空列表
        if (isAll == 'one') { // 单个导出
          if( this.dataListSelections.length === 0 ) return this.$message({message: '请选择至少一条数据',type: 'warning'});
          this.dataListSelections.forEach( item =>{
            exportList.push( item.ruleId )
          })
          this.ruleExportLoading = true
        } else { // 全部导出
          this.ruleExportAllLoading = true;
        }

        this.$http({
            isLoading:false,
            url: this.$http.adornUrl('/rule/setSessionRule'),
            method: 'post',
            data: this.$http.adornData(exportList, false)
        }).then(({data}) => {
            this.ruleExportLoading = false
            this.ruleExportAllLoading = false;
            if (data && data.code === 200) {
                let url = this.$http.adornUrl('/rule/ruleExport?token=') + this.$cookie.get("token");
                window.open(url);
              this.$message({message: '导出成功',type: 'success'});
              this.getDataList();
            } else {
              this.$message({message: data.message,type: 'error'});
            }
        })

      },
      // 导入
      ruleImport () {
        this.$refs.ImportFile.showDialog()
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
      //图片预览
      preImg(src){
        this.ImgPreVisible = true;
        this.$nextTick(() => {
          this.$refs.preImgList.init(src)
        })
      },
      imgClose(){
        this.ImgPreVisible = false;
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/rule/deleteByIds'),
            method: 'delete',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },

      //导入
      handleChange(response, file, fileList){
        if (response && response.code === 10000) {
          this.$message({
            message: '导入成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList();
              this.drVisibel=false;
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      },
      //导出
      down (){
        var url='/jinding/outcar/port?timeStart='+this.dataForm.timeStart+'&timeEnd='+this.dataForm.timeEnd+'&tranType=&emissionStand='+this.dataForm.emissionStand+ '&fuelType='+this.dataForm.fuelType;
        // console.log(url)
        window.open(this.$http.adornUrl(url));
      },
      getTreeData (data) {
        let checkedData = JSON.parse(JSON.stringify(data))
        this.ruleCheckData = data
        this.dataForm.folderPath=data.folderPath && data.folderPath || '';
        this.dataForm.folderId = data.folderId && data.folderId || '';
        this.getDataList();
      }
    }
  }
</script>
<style scoped>
  .search-btn{
    text-align: right;
    margin-bottom: 10px;
  }
  .tree-btn{
    margin-left: 10px;
  }
  .tree-btn>.el-button{
    margin-left: 0!important;
  }
  .custom-tree-container{
    overflow-y: hidden;
    overflow-x: auto;
    width:100%;
  }
  .el-tree {
    min-width: 100%;
    display:inline-block !important;
  }
  .box{
    display: flex;
    justify-content: space-between;
  }
  .box>div{
    height: 74vh;
    /*border: 1px solid #ddd;*/
    padding: 1%;
    overflow: auto;
  }
  .left{
    width: 25%;
    border-right: none;
  }
  .right{
    width: 75%;
  }

  .inline-block{
    display: inline-block;
  }
  .dr-notice-warn{
    width: 100%;
    box-sizing: border-box;
    padding:10px;
    background: #FFE5E0;
    color: red;
  }
  .dr-notice-body{
    padding:10px;
  }
  .dr-notice-body>div{
    margin-bottom: 20px;
  }
</style>
