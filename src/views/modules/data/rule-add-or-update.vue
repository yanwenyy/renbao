<template>
  <div>
    <el-dialog
      custom-class="rule-dialog"
      width="80%"
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form class="infoForm" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="80px">
        <el-tabs type="border-card" class="self-tabs" v-model="activeName">
        <el-tab-pane name="1" label="基本信息">

            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="dataForm.ruleName" placeholder="规则名称"></el-input>
            </el-form-item>
            <el-form-item label="规则类别" prop="ruleCategory">
              <el-select v-model="dataForm.ruleCategory">
                <el-option label="请选择" value=""></el-option>
                <el-option label="门诊规则" :value="1"></el-option>
                <el-option label="住院规则" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则分类"  prop="folderId">
              <el-popover
                ref="menuListPopover"
                placement="bottom-start"
                trigger="click"
                v-model="treeVisible">
                <el-tree
                  class="rule-tree"
                  :data="menuList"
                  :props="menuListTreeProps"
                  node-key="folderId"
                  ref="menuListTree"
                  @current-change="menuListTreeCurrentChangeHandle"
                  :default-expand-all="false"
                  :highlight-current="true"
                  :expand-on-click-node="false">
                </el-tree>
              </el-popover>
              <el-input @click="treeVisible=true" v-popover:menuListPopover v-model="dataForm.parentName" :readonly="true"
                        placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
            </el-form-item>
            <el-form-item label="创建人">
              <el-input readonly v-model="dataForm.createUserName" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                readonly
                v-model="dataForm.createTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择时间">
              </el-date-picker>
            </el-form-item>



        </el-tab-pane>
        <el-tab-pane name="2" label="sql编写">
          <el-button type="primary" @click="openSql()">sql编译器</el-button>
          <el-button type="primary">图形化工具</el-button>
          <el-form-item prop="ruleSqlValue" class="no-label">
            <el-input
              class="sql-text"
              type="textarea"
              :rows="4"
              readonly
              placeholder="sql编译器"
              v-model="dataForm.ruleSqlValue">
            </el-input>
          </el-form-item>

        </el-tab-pane>
      </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false,cleanMsg()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      custom-class="sql-dialog"
      width="100%"
      title="sql编译器"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="sqlVisible">
      <div class="sqlDialog-btn">
        <el-button @click="sqlVisible = false">取消</el-button>
        <el-button type="primary" @click="sqlSave">确定</el-button>
      </div>
      <sql-element ref="sqler" :sqlEditMsg="sqlEditMsg"></sql-element>
    </el-dialog>
  </div>
</template>

<script>
  import { isInteger } from '@/utils/validate'
  import sqlElement from '../projectManage/codemirror'
  export default {
    components: {
      sqlElement
    },
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
        sqlEditMsg:'',//回显时候的sql语句
        activeName:'1',//tab页切换时的状态值
        sqlVisible:false,//sql编译器显示状态
        treeVisible:false,//规则分类显示名称
        menuList: [],//规则树数据
        menuListTreeProps: {
          label: 'folderName',
          children: 'children'
        },
        visible: false,
        roleList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        dataForm: {
          id: 0,
          ruleName: '',
          ruleCategory: '',
          folderId: '',
          createUserName: '',
          createTime: '',
          ruleSqlValue: '',
          ruleType: '',
        },
        dataRule: {
          ruleName: [
            { required: true, message: '规则名称不能为空', trigger: 'blur' }
          ],
          ruleCategory: [
            { required: true, message: '规则类别不能为空', trigger: ['blur',"change"] }
          ],
          folderId: [
            { required: true, message: '规则分类不能为空', trigger: 'change' }
          ],
          dataTime: [
            { required: true, message: '规则分类不能为空', trigger: 'blur' }
          ],
          ruleSqlValue: [
            { required: true, message: 'sql编译器内容不能为空', trigger:['blur',"change"] }
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
      //获取当前日期，格式YYYY-MM-DD
      getNowFormatDay() {
        var nowDate=new Date();
        var char = "-";
        if(nowDate == null){
          nowDate = new Date();
        }
        var day = nowDate.getDate();
        var month = nowDate.getMonth() + 1;//注意月份需要+1
        var year = nowDate.getFullYear();
        //补全0，并拼接
        return year + char + this.completeDate(month) + char +this.completeDate(day);
      },
      //补全0
       completeDate(value) {
          return value < 10 ? "0"+value:value;
        },
      //获取当前登录人信息
      getUserInfo () {
        this.dataForm.createTime=this.getNowFormatDay();
        this.$http({
          url: this.$http.adornUrl('/sys/currentUser'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataForm.createUserName = data.result.userName;
          }
        })
      },
      openSql(){
        this.sqlVisible=true;
      },
      //sql编译器点击保存
      sqlSave(){
        this.sqlVisible=false;
        this.dataForm.ruleSqlValue=this.$refs.sqler.sqlMsg;
        this.dataForm.ruleType='1';
      },
      cleanMsg(){
        this.activeName='1';
        this.dataForm={
          id: 0,
          ruleName: '',
          ruleCategory: '',
          folderId: '',
          parentName: '',
          createUserName: '',
          createTime: '',
          ruleSqlValue: '',
          ruleType: '',
        };
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        });
      },
      init (id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.getUserInfo();
        this.$http({
          url: this.$http.adornUrl('/ruleFolder/getRuleFolder'),
          method: 'get',
          params: this.$http.adornParams({folderSorts: ''})
        }).then(({data}) => {
          this.menuList = data.result;
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
            this.$refs['dataForm'].clearValidate()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/rule/selectByUuid/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                var datas = data.result;
                this.dataForm.ruleName = datas.ruleName;
                this.dataForm.ruleCategory = datas.ruleCategory;
                this.dataForm.folderId = datas.folderId;
                this.dataForm.createUserName = datas.createUserName;
                this.dataForm.createTime = datas.createTime;
                this.dataForm.ruleSqlValue = datas.ruleSqlValue;
                this.sqlEditMsg = datas.ruleSqlValue;
                console.log(this.sqlEditMsg,33333)
                this.dataForm.ruleType = datas.ruleType;
                this.menuListTreeSetCurrentNode();
              }
            })
          }
        })
      },
      // 规则树选中
      menuListTreeCurrentChangeHandle (data, node) {
        console.log(data.folderId)
        this.dataForm.folderId = data.folderId;
        this.dataForm.parentName = data.folderName;
        this.treeVisible=false;
      },
      // 规则树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.folderId);
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['folderName']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/rule/${!this.dataForm.id ? 'add' : 'updateByUuId'}`),
              method: 'post',
              data: this.$http.adornData({
                'ruleId': this.dataForm.id || undefined,
                'ruleName': this.dataForm.ruleName,
                'ruleCategory': this.dataForm.ruleCategory,
                'folderId': this.dataForm.folderId,
                'createUserName': this.dataForm.createUserName,
                'createTime': this.dataForm.createTime,
                'ruleSqlValue': this.dataForm.ruleSqlValue,
                'ruleType': this.dataForm.ruleType,
              })
            }).then(({data}) => {
              if (data && data.code ===200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.cleanMsg();
                    this.$emit('refreshDataList');
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }else{
            this.$message.error("请完善信息!")
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
  .sql-text{
    margin-top: 10px;
  }
  .self-tabs{
    min-height:55vh;
    height: auto;
  }
  .sqlDialog-btn{
    text-align: right;
    width: 100%;
    position: absolute;
    top:20px;
    left: 0;
    padding-right: 2%;
    box-sizing: border-box;
  }
  .infoForm .el-input,.infoForm .el-select{
    width: 30%;
  }
  .infoForm .el-select >>>.el-input{
    width: 100%!important;
  }
  >>>.rule-dialog{
    margin-top: 7.5vh!important;
  }
  >>>.sql-dialog{
    margin-top: 0!important;
    height: 100%;
  }
  >>>.sql-dialog .el-dialog__body{
    padding-top: 0!important;
  }
  .rule-tree{
    height: 40vh;
    overflow: auto;
  }
  .no-label >>>.el-form-item__content{
    margin-left: 0!important;
  }
</style>

