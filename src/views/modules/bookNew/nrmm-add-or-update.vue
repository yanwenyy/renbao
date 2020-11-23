<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="环保登记编码">
        <el-input v-model="dataForm.evnProNum" placeholder="环保登记编码"></el-input>
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="dataForm.produceTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排放阶段">
        <el-select v-model="dataForm.emission" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="器械环保代码">
        <el-input v-model="dataForm.emissionNum" placeholder="器械环保代码"></el-input>
      </el-form-item>
      <el-form-item label="发动机铭牌">
        <el-input v-model="dataForm.engineNum" placeholder="发动机铭牌"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable  v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in zt"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        dialogImageUrl: '',
        dialogVisible: false,
        dataForm: {
          id: 0,
          evnProNum: '',
          produceTime: '',
          emission: '',
          emissionNum: '',
          engineNum:'',
          status:''
        },
        zt:[
          {
            value: '0',
            label: '在用'
          }, {
            value: '1',
            label: '淘汰'
          }
        ],
        options: [
          {
          value: '国三',
          label: '国三'
          },{
          value: '国四',
          label: '国四'
          },{
          value: '国五',
          label: '国五'
          },{
          value: '国六',
          label: '国六'
          },{
          value: '电动',
          label: '电动'
          }],
        value: '',
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
    created(){
      this.dataForm.evnProNum = "";
      this.dataForm.produceTime = "";
      this.dataForm.emission = "";
      this.dataForm.emissionNum = "";
      this.dataForm.engineNum = "";
      this.dataForm.status ='';
      },
    methods: {
      init (id) {
        this.dataForm.id = id||0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/biz/offroad/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.evnProNum = data.data.evnProNum;
                this.dataForm.produceTime = data.data.produceTime;
                this.dataForm.emission = data.data.emission;
                this.dataForm.emissionNum = data.data.emissionNum;
                this.dataForm.engineNum = data.data.engineNum;
                this.dataForm.status = String(data.data.status);
              }
            })
          }else{
            this.dataForm.evnProNum = "";
            this.dataForm.produceTime = "";
            this.dataForm.emission = "";
            this.dataForm.emissionNum = "";
            this.dataForm.engineNum = "";
            this.dataForm.status ='';
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/offroad/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'produceTime': this.dataForm.produceTime+" 00:00:00",
                'evnProNum': this.dataForm.evnProNum,
                'emission': this.dataForm.emission,
                'emissionNum': this.dataForm.emissionNum,
                'engineNum': this.dataForm.engineNum,
                'status': this.dataForm.status,
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

