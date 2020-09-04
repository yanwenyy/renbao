<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="门岗:">
        <el-select clearable  v-model="dataForm.doorPostName" placeholder="请选择">
          <el-option
            v-for="item in mgList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="磅房:">
        <el-select clearable  v-model="dataForm.poundRoom" placeholder="请选择">
          <el-option
            v-for="item in bfList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="集装箱号:">
        <el-select clearable  v-model="dataForm.ifconm" placeholder="请选择">
          <el-option
            v-for="item in ifJzx"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运输方式:">
        <el-select clearable  v-model="dataForm.tranType" placeholder="请选择">
          <el-option
            v-for="item in ysfs"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="燃油种类:">
        <el-select clearable  v-model="dataForm.fuelType" placeholder="请选择">
          <el-option
            v-for="item in ryzl"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排放标准:">
        <el-select clearable  v-model="dataForm.emissionStand" placeholder="请选择">
          <el-option
            v-for="item in pfbz"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="磅单类型:">
        <el-select clearable  v-model="dataForm.meaType" placeholder="请选择">
          <el-option
            v-for="item in bdClass"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="searchMore" label="车牌号:">
        <el-input v-model="dataForm.carNum" placeholder="车牌号" clearable></el-input>
      </el-form-item>
      <el-form-item v-show="searchMore" label="物料大类:">
        <el-input v-model="dataForm.materialsPname" placeholder="物料大类" clearable></el-input>
      </el-form-item>
      <el-form-item v-show="searchMore" label="运输货物名称:">
        <el-input v-model="dataForm.materialsName" placeholder="运输货物名称" clearable></el-input>
      </el-form-item>
      <el-form-item v-show="searchMore" label="开始时间:">
        <el-date-picker
          v-model="dataForm.timeStart"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-show="searchMore" label="结束时间:">
        <el-date-picker
          v-model="dataForm.timeEnd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <span class="showMore" @click="searchMore=!searchMore">{{searchMore?'收起':'显示更多'}}</span>
      <el-form-item style="text-align: right;display: block">
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('biz:tran:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-popover v-model="drVisibel" v-if="isAuth('biz:tran:save')"
        placement="left"
        width="400"
        trigger="click">
          <template>
            <div class="dr-notice-body">
              <div class="dr-notice-list">
                <div class="inline-block dr-notice-title">1.下载excel模板</div>
                <a :href="path+'/static/file/vehicle.xls'" download="vehicle.xls">点击下载模板</a>
              </div>
              <div class="dr-notice-list">
                <div class="inline-block dr-notice-title">2.上传编辑好的文件</div>
                <el-upload
                  class="inline-block"
                  :headers="{'token':token}"
                  :action="this.$http.adornUrl('/biz/tran/import/tran/car')"
                  :on-success="handleChange"
                  :on-error="handleChange"
                  :show-file-list="false"
                >
                  <el-button type="warning">选择文件</el-button>
                </el-upload>
              </div>
              <div class="dr-notice-warn">
                <div>
                  <i class="el-icon-warning"></i>
                  注意:
                </div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;excel批量导入将覆盖询单内现有物料;上传文件类型仅限excel文件!</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计量单号、重量不能重复，数值不能是公式，时间格式为yyyy/m/d hh:mm:ss，例：2020/7/1 01:46:10。请严格按照模板格式填写!</div>

              </div>
            </div>
          </template>
          <el-button type="warning" slot="reference">批量导入</el-button>
        </el-popover>
        <!--<el-upload-->
          <!--class="inline-block"-->
          <!--:headers="{'token':token}"-->
          <!--:action="this.$http.adornUrl('/biz/tran/import/tran/car')"-->
          <!--:on-success="handleChange"-->
          <!--:on-error="handleChange"-->
          <!--:show-file-list="false"-->
        <!--&gt;-->
          <!--<el-button type="warning">批量导入</el-button>-->
        <!--</el-upload>-->
        <el-button type="warning" @click="down">导出</el-button>
        <el-popover
          placement="right"
          width="400"
          trigger="click">
          <template>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox class="showCheckbox" v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <el-button slot="reference">批量隐藏列</el-button>
        </el-popover>
        <el-button type="danger" @click="reload()">刷新</el-button>
        <el-button v-if="isAuth('biz:tran:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <div v-if="dataList" @scroll="barScroll" class="elScrollbar">
      <div :style="{width:(tabelWidth*2.6)+'px',height: '1px',lineHeight:'30px'}"></div>
    </div>
    <el-table ref="tableList"
              height="80vh"
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
        v-if="checkedCities.indexOf('ID')!=-1"
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('进厂时间')!=-1"
        prop="enterTime"
        align="center"
        label="进厂时间">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('计量时间')!=-1"
        prop="weighTime"
        align="center"
        label="计量时间">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('退卡时间')!=-1"
        prop="checkOutTime"
        align="center"
        label="退卡时间">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('出厂时间')!=-1"
        prop="outFactoryTime"
        header-align="center"
        align="center"
        label="出厂时间">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('进厂照片')!=-1"
        header-align="center"
        align="center"
        label="进厂照片">
        <template slot-scope="scope">
          <img @click="preImg(item&&item.indexOf('http')!=-1?item:imgUrlfront+item)" v-for="item in (scope.row.enterImg?scope.row.enterImg.split(','):[])" class="table-list-img" :src="item&&item.indexOf('http')!=-1?item:imgUrlfront+item" alt=" ">
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('出厂照片')!=-1"
        header-align="center"
        align="center"
        label="出厂照片">
        <template slot-scope="scope">
          <img @click="preImg(item&&item.indexOf('http')!=-1?item:imgUrlfront+item)" v-for="item in (scope.row.outImg?scope.row.outImg.split(','):[])" class="table-list-img" :src="(item&&item.indexOf('http')!=-1?item:imgUrlfront+item)" alt=" ">
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('门岗名称')!=-1"
        prop="doorPostName"
        header-align="center"
        align="center"
        label="门岗名称">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('磅房名称')!=-1"
        prop="poundRoom"
        header-align="center"
        align="center"
        label="磅房名称">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('车牌号')!=-1"
        prop="carNum"
        header-align="center"
        align="center"
        label="车牌号">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('注册日期')!=-1"
        prop="registTime"
        header-align="center"
        align="center"
        label="注册日期">
        <template slot-scope="scope">
          {{ scope.row.registTime&&scope.row.registTime.split(" ")[0]}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('车辆识别代号')!=-1"
        prop="vehicleNum"
        align="center"
        label="车辆识别代号(VIN)">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('发动机号码')!=-1"
        prop="engineNum"
        align="center"
        label="发动机号码">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('燃油种类')!=-1"
        prop="fuelType"
        align="center"
        label="燃油种类">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('车队名称')!=-1"
        prop="owner"
        align="center"
        label="车队名称">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('随车清单')!=-1"
        header-align="center"
        align="center"
        label="随车清单">
        <template slot-scope="scope">
          <img  @click="preImg(scope.row.carCheckList&&scope.row.carCheckList.indexOf('http')!=-1?scope.row.carCheckList:imgUrlfront+scope.row.carCheckList)" class="table-list-img" v-if="scope.row.carCheckList" :src="(scope.row.carCheckList&&scope.row.carCheckList.indexOf('http')!=-1?scope.row.carCheckList:scope.row.carCheckList?imgUrlfront+scope.row.carCheckList:'')" alt=" ">
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('行驶证')!=-1"
        header-align="center"
        align="center"
        label="行驶证">
        <template slot-scope="scope">
          <img @click="preImg(scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:imgUrlfront+scope.row.drivinglLicense)" class="table-list-img" v-if="scope.row.drivinglLicense" :src="(scope.row.drivinglLicense&&scope.row.drivinglLicense.indexOf('http')!=-1?scope.row.drivinglLicense:scope.row.drivinglLicense?imgUrlfront+scope.row.drivinglLicense:'')" alt=" ">
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('排放阶段')!=-1"
        prop="doorEmissionStand"
        header-align="center"
        align="center"
        label="排放阶段">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('供应商')!=-1"
        prop="clientName"
        align="center"
        label="供应商">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('物料编码')!=-1"
        prop="materialsNum"
        align="center"
        label="物料编码">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('物料大类')!=-1"
        prop="materialsPname"
        align="center"
        label="物料大类">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('物料名称')!=-1"
        prop="materialsName"
        align="center"
        label="物料名称">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('磅房照片')!=-1"
        align="center"
        label="磅房照片">
        <template slot-scope="scope">
          <img @click="preImg(scope.row.poundImg&&scope.row.poundImg.indexOf('http')!=-1?scope.row.poundImg:imgUrlfront+scope.row.poundImg)" class="table-list-img" v-if="scope.row.poundImg" :src="(scope.row.poundImg&&scope.row.poundImg.indexOf('http')!=-1?scope.row.poundImg:scope.row.poundImg?imgUrlfront+scope.row.poundImg:'')" alt=" ">
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('计量单号')!=-1"
        prop="measureNum"
        align="center"
        label="计量单号">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('磅单类型')!=-1"
        align="center"
        label="磅单类型">
        <template slot-scope="scope">
          <div v-if="scope.row.measureType==null||scope.row.measureType==''">
            <span v-if="scope.row.measureNum&&scope.row.measureNum.indexOf('RecIn')!=-1">采购</span>
            <span v-if="scope.row.measureNum&&scope.row.measureNum.indexOf('SaleOut')!=-1">销售</span>
          </div>
          <span v-if="scope.row.measureType!=null&&scope.row.measureType!=''">{{scope.row.measureType==1?'采购 ':scope.row.measureType==2?'销售 ':''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('毛重')!=-1"
        prop="crossWeigh"
        align="center"
        label="毛重">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('皮重')!=-1"
        prop="tareWeigh"
        header-align="center"
        align="center"
        label="皮重">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('净重')!=-1"
        prop="netWeigh"
        header-align="center"
        align="center"
        label="净重">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('集装箱号')!=-1"
        prop="containerNum"
        header-align="center"
        align="center"
        label="集装箱号">
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('运输方式')!=-1"
        header-align="center"
        align="center"
        label="运输方式">
        <template slot-scope="scope">
          {{scope.row.tranType==0?'铁路':scope.row.tranType==1?'公路':scope.row.tranType==2?'纯电动':''}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkedCities.indexOf('运输单位')!=-1"
        prop="transportUnit"
        header-align="center"
        align="center"
        label="运输单位">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button v-if="" type="text" size="small" @click="addOrUpdateHandle(scope.row.id,'look')">查看</el-button>-->
          <el-button v-if="isAuth('biz:tran:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('biz:tran:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="vehicle-pagin"
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
  const cityOptions = ['ID', '进厂时间', '计量时间', '退卡时间','出厂时间','进厂照片','出厂照片','门岗名称','磅房名称',
    '车牌号','注册日期','车辆识别代号','发动机号码','燃油种类','随车清单','行驶证','排放阶段','供应商',
  '物料编码','物料名称','计量单号','毛重','皮重','净重','集装箱号','运输方式','运输单位','磅单类型','车队名称','物料大类','磅房照片'];
  import AddOrUpdate from './vehicle-add-or-update';
  import ImgPre from './img-pre'
  import {PxSocket,randomString} from '@/utils'
  export default {
    data () {
      return {
        path:window.SITE_CONFIG.cdnUrl,
        dataForm: {
          timeStart: '',
          timeEnd: '',
          carNum:'',
          materialsName:'',
          doorPostName:'',
          poundRoom: '',
          ifconm: '',
          tranType:'',
          emissionStand:'',
          fuelType:'',
          meaType:'',
          materialsPname:''
        },
        searchMore:false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        ImgPreVisible:false,
        checkAll: false,
        checkedCities: cityOptions,
        cities: cityOptions,
        isIndeterminate: true,
        imgUrlfront:'',
        token:'',
        tabelWidth:0,
        minwidth:0,
        ws:'',
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
          },
          {
            value: '纯电动',
            label: '纯电动'
          }],
        ysfs:[
          {
            value: '0',
            label: '铁路'
          },
          {
            value: '1',
            label: '公路'
          },
          {
            value: '2',
            label: '纯电动'
          }
        ],
        mgList:[
          {
            value: '三号门西进口',
            label: '三号门西进口'
          },
          {
            value: '三号门东进口',
            label: '三号门东进口'
          },
          {
            value: '北门进口',
            label: '北门进口'
          },
        ],
        bfList:[
          {
            value: 'sohao磅',
            label: 'sohao磅'
          },
          {
            value: '一号磅东',
            label: '一号磅东'
          },
          {
            value: '三号西',
            label: '三号西'
          },
        ],
        ifJzx:[
          {
            value:'1',
            label:'是'
          },
          {
            value:'2',
            label:'否'
          }
        ],
        bdClass:[
          {
            value:'RecIn',
            label:'采购 '
          },
          {
            value:'SaleOut',
            label:'销售'
          }
        ],
        pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.dataForm.outFactoryTime;
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.dataForm.enterTime;
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime()
              );
            }
          },
        },
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
      this.token=this.$cookie.get('token');
    },
    mounted(){
      var num="_"+randomString();
      this.ws=new PxSocket({
        url:this.$http.wsUrl('jinding'+num),
        name:'getData',
        data:'jinding'+num,
        succ:this.getDataList
      });
      this.ws.connect();
      this.tabelWidth=this.$refs.tableList.bodyWrapper.scrollWidth;
    },
    beforeDestroy(){
      this.ws.close();
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/jinding/tran/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'timeStart': this.dataForm.timeStart || '',
            'timeEnd': this.dataForm.timeEnd || '',
            'carNum': this.dataForm.carNum,
            'materialsName': this.dataForm.materialsName,
            'doorPostName': this.dataForm.doorPostName,
            'poundRoom': this.dataForm.poundRoom,
            'ifconm': this.dataForm.ifconm,
            'tranType': this.dataForm.tranType,
            'emissionStand': this.dataForm.emissionStand,
            'fuelType': this.dataForm.fuelType,
            'meaType': this.dataForm.meaType,
            'materialsPname': this.dataForm.materialsPname
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
      addOrUpdateHandle (id,look) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,look)
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
            url: this.$http.adornUrl('/biz/tran/delete'),
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


      //显示隐藏
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
        var url='/jinding/po/list?pageNum='+this.pageIndex+'&pageSize='+this.pageSize+'&enterTime='+this.dataForm.enterTime+'&outFactoryTime='+this.dataForm.outFactoryTime+ '&carNum='+this.dataForm.carNum+'&materialsName='+this.dataForm.materialsName+ '&doorPostName='+this.dataForm.doorPostName+'&poundRoom='+this.dataForm.poundRoom+'&containerNum='+ this.dataForm.containerNum+'&tranType='+this.dataForm.tranType+'&emissionStand='+this.dataForm.emissionStand+ '&fuelType='+this.dataForm.fuelType;
        window.open(this.$http.adornUrl(url));
      },

      //刷新页面
      reload(){
        this.pageIndex = 1
        this.getDataList()
      },

      //自定义滚动条
      barScroll(e){
        this.$refs.tableList.bodyWrapper.scrollLeft =e.target.scrollLeft;
      },
    }
  }
</script>
<style>
  .inline-block{
    display: inline-block;
  }
  .showCheckbox{
    width: 80px!important;
    display: inline-block;
    margin-left: 0!important;
  }
  .el-input{
    width: 150px;
  }
  .showMore{
    color:cornflowerblue;
    cursor: pointer;
    margin-right: 30px;
    display: inline-block;
    margin-top: 10px;
  }
  .table-list-img{
    margin-bottom: 10px;
  }
  .elScrollbar{
    width: 78%;
    overflow-x: auto;
    position: fixed;
    /*left: 20%;*/
    left: 250px;
    box-sizing: border-box;
    bottom:5px;
    z-index: 999;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
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
