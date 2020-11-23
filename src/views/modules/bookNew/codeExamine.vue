<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="车牌号:">
        <el-input v-model="dataForm.carNum" placeholder="车牌号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="warning" @click="down">导出</el-button>
        <el-button  type="primary" v-if="isAuth('biz:outcar:save')" @click="addOrUpdateHandle()">新增</el-button>
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
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="carNum"
        align="center"
        label="车牌号">
      </el-table-column>
      <el-table-column
        prop="registTime"
        header-align="center"
        align="center"
        label="注册日期">
      </el-table-column>
      <el-table-column
        prop="vehicleNum"
        header-align="center"
        align="center"
        label="车辆识别代号(VIN)">
      </el-table-column>
      <el-table-column
        prop="engineNum"
        header-align="center"
        align="center"
        label="发动机号码">
      </el-table-column>
      <el-table-column
        prop="emissionStand"
        header-align="center"
        align="center"
        label="排放阶段">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="录入时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="随车清单">
        <template slot-scope="scope">
          <img  @click="preImg(scope.row.carCheckList&&scope.row.carCheckList.indexOf('http')!=-1?scope.row.carCheckList:imgUrlfront+scope.row.carCheckList)" class="table-list-img" v-if="scope.row.carCheckList" :src="scope.row.carCheckList&&scope.row.carCheckList.indexOf('http')!=-1?scope.row.carCheckList:scope.row.carCheckList?imgUrlfront+scope.row.carCheckList:''" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="fuelType"
        header-align="center"
        align="center"
        label="燃油方式">
      </el-table-column>
      <el-table-column
        prop="remaks"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        align="center"
        label="行驶证">
        <template slot-scope="scope">
          <img @click="preImg(scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:imgUrlfront+scope.row.drivinglLicense)" class="table-list-img" v-if="scope.row.drivinglLicense" :src="scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:scope.row.drivinglLicense?imgUrlfront+scope.row.drivinglLicense:''" alt="">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
           <span :class="scope.row.status==1?'orange':scope.row.status==3?'red':''">{{scope.row.status==1?'待审核':scope.row.status==3?'审核未通过':''}}</span>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      header-align="center"
      align="center"
      width="150"
      label="操作">
      <template slot-scope="scope">
      <el-button v-if="isAuth('biz:car:check')" type="text" size="small" @click="examine(),dataForm.status=1,dataForm.id=scope.row.carNum">通过</el-button>
        <el-button v-if="isAuth('biz:car:check')" type="text" size="small" @click="dialogFormVisible = true,dataForm.remaks='',dataForm.status='',dataForm.id=scope.row.carNum">不通过</el-button>
        <el-button v-if="isAuth('biz:outcar:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.carNum)">修改</el-button>
        <el-button v-if="isAuth('biz:outcar:delete')" type="text" size="small" @click="deleteHandle(scope.row.carNum)">删除</el-button>
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
    <ImgPre v-if="ImgPreVisible"  ref="preImgList" @refreshClose="imgClose"></ImgPre>
    <el-dialog title="审核不通过" :visible.sync="dialogFormVisible">
      <el-form :model="dataForm">
        <el-form-item label="原因" :label-width="formLabelWidth">
          <el-radio v-model="dataForm.status" label="0">格式不通过</el-radio>
          <el-radio v-model="dataForm.status" label="-1">排放阶段不通过</el-radio>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="dataForm.remaks">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="examine()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import AddOrUpdate from './codeExamine-add-or-update'
  import ImgPre from './img-pre'
  export default {
    data () {
      return {
        path:window.SITE_CONFIG.cdnUrl,
        dataForm: {
          timeStart: '',
          timeEnd: '',
          carNum:'',
          status:'',
          remaks:'',
          id:''
        },
        dialogFormVisible:false,
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
    components: {
      AddOrUpdate,
      ImgPre
    },
    activated () {
      this.getDataList();
      this.imgUrlfront=this.$http.adornUrl('/jinding/showImg/');
      this.token=this.$cookie.get('token')
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/tran/qrcode/status/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'carnum': this.dataForm.carNum
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
      addOrUpdateHandle (id,status) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //审核通过不通过
      examine(id){
        this.$confirm(`确认${this.dataForm.status==1?'通过':'不通过'}审核吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`biz/tran/check/car`),
            method: 'POST',
            data: this.$http.adornData({
              'carnum': this.dataForm.id,
              'remaks': this.dataForm.remaks,
              'status': this.dataForm.status,
            })
          }).then(({data}) => {
            if (data && data.code === 10000) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataForm.carNum='';
                  this.getDataList();
                  this.dialogFormVisible = false;
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
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
          return item.carNum
        })
        console.log(id)
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/tran/outcar/delete'),
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
        var url='/biz/tran/port/carstatus/list?carnum='+this.dataForm.carNum;
        console.log(this.$http.adornUrl(url))
        window.open(this.$http.adornUrl(url));
      },
    }
  }
</script>
<style>
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
  .orange{
    color: orange;
  }
  .red{
    color: red;
  }
</style>
