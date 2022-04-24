<template>
  <div>
    <el-dialog
      :title="!dataForm.id ? '新增' :type=='look'?'查看': '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
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
                <el-select v-model="dataForm.planCode" placeholder="请选择">
                  <el-option label="文本框" value="文本框"></el-option>
                  <el-option label="列表" value="列表"></el-option>
                  <el-option label="树" value="树"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="示例" prop="planName">
                <el-input :disabled="type=='look'" v-model="dataForm.planName" placeholder="示例" maxlength="255"></el-input>
              </el-form-item>
              <el-form-item label="允许为空">
                <el-radio-group v-model="dataForm.planName">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="形式类型" v-if="dataForm.planCode=='列表'||dataForm.planCode=='树'">
                <el-radio-group v-model="dataForm.planName">
                  <el-radio :label="1">单选</el-radio>
                  <el-radio :label="2">多选</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="参数值长度" v-if="dataForm.planCode=='文本框'">
                <el-input type="Number" :disabled="type=='look'" v-model="dataForm.planName" placeholder="参数值长度"></el-input>
              </el-form-item>
              <el-form-item label="备选值设置"  v-if="dataForm.planCode=='列表'||dataForm.planCode=='树'">
                <el-tabs v-model="activeName2">
                  <el-tab-pane label="自定义动态" name="first" v-if="dataForm.planCode=='列表'">
                    <ul class="sa-list">
                      <li v-for="(item,index) in selfActionsList">
                        <el-input placeholder="名称"></el-input>
                        <el-input placeholder="值"></el-input>
                        <el-button v-if="index==0" type="primary" size="small" @click="selfActionsList.push({})">加</el-button>
                        <el-button v-if="index>0" type="primary" size="small" @click="selfActionsList.splice(index,1)">减</el-button>
                      </li>
                    </ul>
                  </el-tab-pane>
                  <el-tab-pane label="SQL动态" name="second">
                    <el-input
                      style="margin-bottom: 10px"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入SQL"
                      v-model="dataForm.planName">
                    </el-input>
                    <el-button type="primary" @click="sqlRuleVisible = true">查看SQL规则</el-button>
                    <el-button type="primary">预览</el-button>
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
              <el-form-item label="说明">
                <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请输入SQL"
                  v-model="dataForm.planName">
                </el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="dataForm.planCode=='树'" name="2" label="关联参数配置">
            <div class="tabs1-div">
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      title="查看SQL规则"
      :visible.sync="sqlRuleVisible"
      width="40%">
      <div v-if="dataForm.planCode=='列表'">
        <div>1、SQL语句的格式为：SELECT A,B FROM C</div>
        <div>2、其中【A】字段为真实值，【B】字段为显示值，若字段过多（或者存在【*】），则默认只使用前两列进行真实值与显示值的匹配</div>
      </div>
      <div v-if="dataForm.planCode=='树'">
        <div>1、SQL语句的格式为：SELECT A,B,C FROM D</div>
        <div>2、其中【A】字段为子项真实值，【B】字段为子项显示值，【C】字段为父项真实值，将使用【A】字段与【C】字段进行父子节点关系匹配，若字段过多（或者存在【*】），则默认只使用前三列进行匹配</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sqlRuleVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        sqlRuleVisible:false,//查看sql规则状态
        activeName: "1", //tab页切换时的状态值
        activeName2: "first", //tab页切换时的状态值
        type:'',
        visible: false,
        selfActionsList:[{}],
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
  .tabs1-div{
    height: 40vh;
    overflow-y: auto;
  }
  >>>.el-dialog{
    margin-top: 10vh!important;
  }
  .sa-list{
    list-style:none;
    padding-left: 0;
  }
  .sa-list li{
    margin-bottom: 10px;
  }
  .sa-list .el-input{
    width: 40%;
  }
</style>
