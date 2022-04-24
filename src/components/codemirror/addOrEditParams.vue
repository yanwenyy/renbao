<template>
  <el-dialog
    :title="!dataForm.id ? '新增' :type=='look'?'查看': '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-tabs type="border-card" class="self-tabs" v-model="activeName">
        <el-tab-pane name="1" label="基本信息">
          <div class="tabs1-div">
            <el-form-item label="参数名称" prop="planName">
              <el-input :disabled="type=='look'" v-model="dataForm.planName" placeholder="参数名称" maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="数据类型" prop="planName">
              <el-select v-model="dataForm.planName" placeholder="请选择">
                <el-option label="数字" value="数字"></el-option>
                <el-option label="文本" value="文本"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="输入方式" prop="planName">
              <el-select v-model="dataForm.planName" placeholder="请选择">
                <el-option label="文本框" value="文本框"></el-option>
                <el-option label="列表" value="列表"></el-option>
                <el-option label="树" value="树"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="示例" prop="planName">
              <el-input :disabled="type=='look'" v-model="dataForm.planName" placeholder="示例" maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="允许为空">
              <el-input :disabled="type=='look'" v-model="dataForm.planName" placeholder="示例" maxlength="255"></el-input>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2" label="关联参数配置">

        </el-tab-pane>
      </el-tabs>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        activeName: "1", //tab页切换时的状态值
        type:'',
        visible: false,
        dataForm: {
          id: 0,
          planName: '',
          planCode: '',
          multipartFiles :[],
        },
        dataRule: {
          planName: [
            { required: true, message: '方案名称不能为空', trigger: 'blur' }
          ],
          planCode: [
            { required: true, message: '方案编号不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      cleanMsg(){
        this.dataForm={
          id: 0,
          planName: '',
          planCode: '',
          multipartFiles :[],
        }
        this.fileList=[];
        this.removeFileIdList=[];
      },
      init (id,type) {
        this.type=type;
        this.cleanMsg();
        this.visible = true;
        this.dataForm.id=id;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        });
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/plan/selectByUuid/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              var datas=data.result;
              this.dataForm.planName = datas.planName;
              this.dataForm.planCode = datas.planCode;
              this.dataForm.multipartFiles = datas.fileInfos;
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {

          }
        })
      }
    }
  }
</script>
<style scoped>
  >>>.no-autofill-pwd .el-input__inner{
    -webkit-text-security:disc!important;
  }
</style>
