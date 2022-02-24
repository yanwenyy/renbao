<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="车牌号:">
        <el-input v-model="dataForm.carNum" placeholder="车牌号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="pageIndex=1,pageSize=10,getDataList()">查询</el-button>
        <!--<el-button type="warning" @click="down">导出</el-button>-->
        <!--<el-button v-if="isAuth('biz:outcar:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        <template slot-scope="scope">
          <span>{{scope.row.registTime&&scope.row.registTime.split(" ")[0]}}</span>
        </template>
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
        align="center"
        label="行驶证">
        <template slot-scope="scope">
          <img @click="preImg(scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:imgUrlfront+scope.row.drivinglLicense)" class="table-list-img" v-if="scope.row.drivinglLicense" :src="scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:scope.row.drivinglLicense?imgUrlfront+scope.row.drivinglLicense:''" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="checkStatus"
        header-align="center"
        align="center"
        label="不通过分类">
        <template slot-scope="scope">
          {{scope.row.checkStatus==2?'排放阶段不符合':scope.row.checkStatus==1?'格式不通过':' '}}
        </template>
      </el-table-column>
      <el-table-column
        prop="operateBy"
        header-align="center"
        align="center"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="remaks"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button v-if="isAuth('biz:outcar:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>-->
          <el-button v-if="isAuth('biz:notPass:delete')" type="text" size="small" @click="deleteHandle(scope.row.carNum)">删除</el-button>
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
  </div>
</template>

<script>
  import AddOrUpdate from './externalVehicle-add-or-update'
  import ImgPre from './img-pre'
  export default {
    data () {
      return {
        path:window.SITE_CONFIG.cdnUrl,
        dataForm: {
          timeStart: '',
          timeEnd: '',
          carNum:''
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
          url: this.$http.adornUrl('/biz/tran/nocheck/status/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'carnum': this.dataForm.carNum||''
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
        var url='/jinding/outcar/port?timeStart='+this.dataForm.timeStart+'&timeEnd='+this.dataForm.timeEnd+ '&emissionStand='+this.dataForm.emissionStand+'&fuelType='+this.dataForm.fuelType+'&carnum='+this.dataForm.carNum;
        window.open(this.$http.adornUrl(url));
        console.log(url)
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
</style>
