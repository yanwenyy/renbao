<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="注册日期:">
        <el-date-picker
          v-model="dataForm.registTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="环保登记编码或内部管理号牌">
        <el-input v-model="dataForm.evnCarNum" placeholder="环保登记编码或内部管理号牌" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('biz:factorycar:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-popover v-model="drVisibel"  v-if="isAuth('biz:factorycar:save')"
          placement="left"
          width="400"
          trigger="click">
          <template>
            <div class="dr-notice-body">
              <div class="dr-notice-list">
                <div class="inline-block dr-notice-title">1.下载excel模板</div>
                <a :href="path+'/static/file/venueVehicle.xls'" download="venueVehicle.xls">点击下载模板</a>
              </div>
              <div class="dr-notice-list">
                <div class="inline-block dr-notice-title">2.上传编辑好的文件</div>
                <el-upload
                  class="inline-block"
                  :headers="{'token':token}"
                  :action="this.$http.adornUrl('/biz/factorycar/import/factory/car')"
                  :on-success="handleChange"
                  :on-error="handleChange"
                  :show-file-list="false"
                >
                  <el-button type="warning">批量导入</el-button>
                </el-upload>
              </div>
              <div class="dr-notice-warn">
                <div>
                  <i class="el-icon-warning"></i>
                  注意:
                </div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;excel批量导入将覆盖询单内现有物料;上传文件类型仅限excel文件!</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;模板内有内容的单元格为必填项,请严格按照模板格式填写!</div>
              </div>
            </div>
          </template>
          <el-button type="warning" slot="reference">批量导入</el-button>
        </el-popover>

        <el-button v-if="isAuth('biz:factorycar:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="evnCarNum"
        align="center"
        label="环保登记编码或内部管理号牌">
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
        align="center"
        label="随车清单">
        <template slot-scope="scope">
          <img  @click="preImg(scope.row.carCheckList&&scope.row.carCheckList.indexOf('http')!=-1?scope.row.carCheckList:imgUrlfront+scope.row.carCheckList)" class="table-list-img" v-if="scope.row.carCheckList" :src="scope.row.carCheckList&&scope.row.carCheckList.indexOf('http')!=-1?scope.row.carCheckList:scope.row.carCheckList?imgUrlfront+scope.row.carCheckList:''" alt="">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="行驶证">
        <template slot-scope="scope">
          <img @click="preImg(scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:imgUrlfront+scope.row.drivinglLicense)" class="table-list-img" v-if="scope.row.drivinglLicense" :src="scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:scope.row.drivinglLicense?imgUrlfront+scope.row.drivinglLicense:''" alt="">
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('biz:factorycar:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('biz:factorycar:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './venueVehicle-add-or-update'
  import ImgPre from './img-pre'
  export default {
    data () {
      return {
        path:window.SITE_CONFIG.cdnUrl,
        dataForm: {
          evnCarNum: '',
          registTime: '',
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
        drVisibel:false
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
          url: this.$http.adornUrl('/jinding/factory/car/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'evnCarNum': this.dataForm.evnCarNum,
            'registTime': this.dataForm.registTime||'',
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
          return item.id
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
      }
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
