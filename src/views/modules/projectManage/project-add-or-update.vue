<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="车号">
        <el-input v-model="dataForm.dataAmount" placeholder="车号"></el-input>
      </el-form-item>
      <el-form-item label="入厂时间">
        <el-date-picker
          v-model="dataForm.dataTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="过重时间">
        <el-date-picker
          v-model="dataForm.dataTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="dataForm.dataAmount" placeholder="物料编码"></el-input>
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="dataForm.effectiveData" placeholder="物料名称"></el-input>
      </el-form-item>
      <el-form-item label="毛重">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="毛重"></el-input>
      </el-form-item>
      <el-form-item label="皮重">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="皮重"></el-input>
      </el-form-item>
      <el-form-item label="净重">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="净重"></el-input>
      </el-form-item>
      <el-form-item label="发货工厂编号">
        <el-input v-model="dataForm.dataAmount" placeholder="发货工厂编号"></el-input>
      </el-form-item>
      <el-form-item label="发货工厂描述">
        <el-input v-model="dataForm.effectiveData" placeholder="发货工厂描述"></el-input>
      </el-form-item>
      <el-form-item label="发出库存地">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="发出库存地"></el-input>
      </el-form-item>
      <el-form-item label="计量单号">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="计量单号"></el-input>
      </el-form-item>
      <el-form-item label="联单号">
        <el-input v-model="dataForm.dataAmount" placeholder="联单号"></el-input>
      </el-form-item>
      <el-form-item label="收货工厂编码">
        <el-input v-model="dataForm.effectiveData" placeholder="收货工厂编码"></el-input>
      </el-form-item>
      <el-form-item label="收货工厂描述">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="收货工厂描述"></el-input>
      </el-form-item>
      <el-form-item label="接受库存地">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="接受库存地"></el-input>
      </el-form-item>
      <el-form-item label="回皮时间">
        <el-date-picker
          v-model="dataForm.dataTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出厂时间">
        <el-date-picker
          v-model="dataForm.dataTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="车辆排放标准">
        <el-input v-model="dataForm.todayConsumeMoney" placeholder="车辆排放标准"></el-input>
      </el-form-item>
      <el-form-item label="入厂出厂照片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>

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
      var validateInteger = (rule, value, callback) => {
        if(value===''){
          callback(new Error('不能为空'))
        }else if (!isInteger(value)) {
          callback(new Error('格式不正确'))
        } else {
          callback()
        }
      };
      var validateMoney = (rule, value, callback) => {
        if(!value){
          callback(new Error('不能为空'))
        }else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
          callback(new Error('金额格式不正确'))
        } else {
          callback()
        }
      };
      return {
        visible: false,
        roleList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        dataForm: {
          id: 0,
          dataTime: '',
          dataAmount: '',
          effectiveData: '',
          todayConsumeMoney: ''
        },
        dataRule: {
          dataTime: [
            { required: true, message: '数据时间不能为空', trigger: 'blur' }
          ],
          dataAmount: [
            { required: true,validator: validateInteger, trigger: 'blur' }
          ],
          effectiveData: [
            { required: true, validator: validateInteger,trigger: 'blur' }
          ],
          todayConsumeMoney: [
            { required: true, validator: validateMoney, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id||0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/biz/pdbaidudata/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.dataTime = data.data.dataTime;
                this.dataForm.dataAmount = data.data.dataAmount;
                this.dataForm.effectiveData = data.data.effectiveData;
                this.dataForm.todayConsumeMoney = data.data.todayConsumeMoney;
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/pdbaidudata/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dataTime': this.dataForm.dataTime+" 00:00:00",
                'dataAmount': this.dataForm.dataAmount,
                'effectiveData': this.dataForm.effectiveData,
                'todayConsumeMoney': this.dataForm.todayConsumeMoney
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
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
</style>

