<template>
  <el-dialog
    title="修改"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="车牌号">
        <el-input disabled v-model="dataForm.carNum" placeholder="车牌号"></el-input>
      </el-form-item>
      <el-form-item label="注册日期">
        <el-date-picker
          v-model="dataForm.registTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="车辆识别代号(VIN)">
        <el-input v-model="dataForm.vehicleNum" placeholder="车辆识别代号(VIN)"></el-input>
      </el-form-item>
      <el-form-item label="发动机号码">
        <el-input v-model="dataForm.engineNum" placeholder="发动机号码"></el-input>
      </el-form-item>
      <el-form-item label="排放阶段">
        <el-select v-model="dataForm.emissionStand" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="随车清单">
        <div class="inline-block box-img" v-if="dataForm.carCheckList&&dataForm.carCheckList!=''">
          <el-image class="look-img" title="点击查看大图"
                    :src="dataForm.carCheckList.indexOf('http')!=-1?dataForm.carCheckList:imgUrlfront+dataForm.carCheckList" :preview-src-list="srcList" >
          </el-image>
          <i class="el-icon-error box-img-del" @click="dataForm.carCheckList=''"></i>
        </div>
        <div class="inline-block box-img"  v-if="dataForm.carCheckList==''||!dataForm.carCheckList">
          <el-upload
            :show-file-list="!dataForm.id&& dataForm.carCheckList==''"
            :headers="{'token':token}"
            :action="this.$http.adornUrl('/jinding/file/upload')"
            :on-success="handleChange"
            :on-error="handleChange"
            list-type="picture-card"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
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
      <el-form-item label="行驶证">
        <div class="inline-block box-img" v-if="dataForm.drivinglLicense&&dataForm.drivinglLicense!=''">
          <el-image class="look-img" title="点击查看大图"
                    :src="dataForm.drivinglLicense.indexOf('http')!=-1?dataForm.drivinglLicense:imgUrlfront+dataForm.drivinglLicense" :preview-src-list="srcList">
          </el-image>
          <i class="el-icon-error box-img-del" @click="dataForm.drivinglLicense=''"></i>
        </div>
        <div class="inline-block box-img" v-if="dataForm.drivinglLicense==''||!dataForm.drivinglLicense">
          <el-upload
            :show-file-list="!dataForm.id && dataForm.drivinglLicense==''"
            :headers="{'token':token}"
            :action="this.$http.adornUrl('/jinding/file/upload')"
            :on-success="handleChange2"
            :on-error="handleChange2"
            list-type="picture-card"
            :on-remove="handleRemove2">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isInteger } from '@/utils/validate'
  export default {
    data () {
      return {
        visible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        dataForm: {
          id: 0,
          carNum: '',
          registTime: '',
          vehicleNum: '',
          engineNum: '',
          emissionStand:'',
          carCheckList:'',
          drivinglLicense:'',
          fuelType:''
        },
        token:'',
        imgUrlfront:'',
        srcList: [],
        options: [  {
          value: '国五',
          label: '国五'
        }, {
          value: '国六',
          label: '国六'
        }],
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
        value: '',
      }
    },
    methods: {
      init (id) {
        this.imgUrlfront=this.$http.adornUrl('/jinding/showImg/');
        this.token=this.$cookie.get('token');
        this.dataForm=id;
        this.visible = true;
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields();
        //   if (this.dataForm.id) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/biz/factorycar/info/${this.dataForm.id}`),
        //       method: 'get',
        //       params: this.$http.adornParams()
        //     }).then(({data}) => {
        //       if (data && data.code === 200) {
        //         this.dataForm.evnCarNum = data.data.evnCarNum;
        //         this.dataForm.registTime = data.data.registTime;
        //         this.dataForm.vehicleNum = data.data.vehicleNum;
        //         this.dataForm.engineNum = data.data.engineNum;
        //         this.dataForm.emissionStand = data.data.emissionStand;
        //         this.dataForm.carCheckList = data.data.carCheckList;
        //         this.dataForm.drivinglLicense = data.data.drivinglLicense;
        //         this.dataForm.fuelType = data.data.fuelType;
        //         var list=[this.dataForm.carCheckList.indexOf('http')!=-1?this.dataForm.carCheckList:this.imgUrlfront+data.data.carCheckList,this.dataForm.drivinglLicense.indexOf('http')!=-1?this.dataForm.drivinglLicense:this.imgUrlfront+data.data.drivinglLicense];
        //         this.srcList=list;
        //       }
        //     })
        //   }else{
        //     this.dataForm.evnCarNum ='';
        //     this.dataForm.registTime = '';
        //     this.dataForm.vehicleNum = '';
        //     this.dataForm.engineNum = '';
        //     this.dataForm.emissionStand = '';
        //     this.dataForm.carCheckList = '';
        //     this.dataForm.drivinglLicense = '';
        //     this.dataForm.fuelType=''
        //   }
        // })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/tran/out/update`),
              method: 'post',
              data: this.$http.adornData({
                'registTime': this.dataForm.registTime,
                'carNum': this.dataForm.carNum,
                'vehicleNum': this.dataForm.vehicleNum,
                'engineNum': this.dataForm.engineNum,
                'emissionStand': this.dataForm.emissionStand,
                'doorEmissionStand':this.dataForm.emissionStand,
                'carCheckList': this.dataForm.carCheckList,
                'drivinglLicense': this.dataForm.drivinglLicense,
                'fuelType': this.dataForm.fuelType
              })
            }).then(({data}) => {
              if (data && data.code ===200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      handleRemove(file, fileList) {
        this.dataForm.carCheckList='';
      },
      //上传图片
      handleChange(response, file, fileList){
        if (response && response.code === 10000) {
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataForm.carCheckList=response.data;
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      },
      handleRemove2(file, fileList) {
        this.dataForm.drivinglLicense='';
      },
      //上传图片
      handleChange2(response, file, fileList){
        if (response && response.code === 10000) {
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dataForm.drivinglLicense=response.data;
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      }
    }
  }
</script>
<style scoped>
  >>> .el-form-item__label{
    width: 120px!important;
  }
  >>> .el-input{
    width: 90%;
  }
  >>>.look-img{
    width: 148px;
    height: 148px;
    margin-right: 10px;
  }
  .box-img{
    vertical-align: top;
  }
</style>

