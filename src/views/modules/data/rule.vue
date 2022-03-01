<template>
  <div>
    <div class="box">
      <div class="left">
        <div class="custom-tree-container">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
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
          </el-tree>
        </div>
      </div>
      <div class="right">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="规则名称:">
            <el-input v-model="dataForm.carnum" placeholder="车牌号" clearable></el-input>
          </el-form-item>
          <el-form-item label="审计事项:">
            <el-input v-model="dataForm.carnum" placeholder="车牌号" clearable></el-input>
          </el-form-item>
          <el-form-item label="风险等级:">
            <el-select clearable  v-model="dataForm.fuelType" placeholder="请选择">
              <el-option
                v-for="item in ryzl"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataList()">查询</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
        <div class="search-btn">
          <el-button type="primary" @click="getDataList()">新增</el-button>
          <el-button type="primary" @click="getDataList()">修改</el-button>
          <el-button type="warning" @click="getDataList()">导入</el-button>
          <el-button type="warning" @click="getDataList()">全部导出</el-button>
          <el-button type="warning" @click="getDataList()">导出</el-button>
          <el-button type="danger" @click="getDataList()">删除</el-button>
        </div>
        <el-table
          :data="dataList"
          border
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
            prop="carNum"
            align="center"
            label="规则名称">
          </el-table-column>
          <el-table-column
            prop="registTime"
            header-align="center"
            align="center"
            label="平均运行时间">
          </el-table-column>
          <el-table-column
            prop="registTime"
            header-align="center"
            align="center"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="vehicleNum"
            header-align="center"
            align="center"
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="engineNum"
            header-align="center"
            align="center"
            label="规则类型">
          </el-table-column>
          <!--<el-table-column-->
          <!--fixed="right"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--width="150"-->
          <!--label="操作">-->
          <!--<template slot-scope="scope">-->
          <!--<el-button v-if="isAuth('biz:factorycar:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>-->
          <!--<el-button v-if="isAuth('biz:factorycar:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form:{
          name:'',
        },
        treeTitle:'',
        treeVisible:false,
        filterText: '',
        treeData:[{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        path:window.SITE_CONFIG.cdnUrl,
        dataForm: {
          timeStart: '',
          timeEnd: '',
          emissionStand:'',
          fuelType:'',
          carnum:''
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
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    components: {

    },
    activated () {
      // this.getDataList();
    },
    methods: {
      append(data,type) {
        // console.log(data)
       this.treeTitle=type=='add'?'填写分类信息':'编辑分类信息';
       this.treeVisible=true;
       this.form.name=type=='add'?'':data.label;

        // const newChild = { id: id++, label: 'testtest', children: [] };
        // if (!data.children) {
        //   this.$set(data, 'children', []);
        // }
        // data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/jinding/outcar/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'carnum': this.dataForm.carnum,
            'timeStart': this.dataForm.timeStart|| '',
            'timeEnd': this.dataForm.timeEnd|| '',
            'emissionStand': this.dataForm.emissionStand,
            'fuelType': this.dataForm.fuelType||'',
          })
        }).then(({data}) => {
          if (data && data.code === 10000) {
            this.dataList = data.data
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
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
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
            url: this.$http.adornUrl('/biz/factorycar/delete'),
            method: 'post',
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
    }
  }
</script>
<style>
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
    border: 1px solid #ddd;
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
