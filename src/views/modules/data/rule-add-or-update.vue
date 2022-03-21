<template>
  <div>
    <el-dialog
      custom-class="rule-dialog"
      width="80%"
      :title="!dataForm.ruleId ? '新增' : '修改'"
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
                  :data="ruleData"
                  :props="menuListTreeProps"
                  node-key="folderId"
                  ref="menuListTree"
                  @current-change="menuListTreeCurrentChangeHandle"
                  :default-expand-all="false"
                  :highlight-current="true"
                  :expand-on-click-node="false">
                   <span  slot-scope="{ node }">
                      <span class="tree-label">
                          <span class="folder-icon"></span>
                          <span :title="node.label" > {{node.label}}</span>
                      </span>
                  </span>
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
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择时间">
              </el-date-picker>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="sql编写">
          <el-button type="primary" @click="openSql()">sql编译器</el-button>
          <el-button type="primary">图形化工具</el-button>
          <el-form-item prop="ruleSqlValue" class="no-label">
            <div class="sqlDiv-html" v-html="dataForm.ruleSqlValue"></div>
            <!--<el-input-->
              <!--class="sql-text"-->
              <!--type="textarea"-->
              <!--:rows="4"-->
              <!--readonly-->
              <!--placeholder="sql编译器"-->
              <!--v-model="dataForm.ruleSqlValue">-->
            <!--</el-input>-->
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
      style="height:100vh;overflow: hidden;box-sizing: border-box"
      title="sql编译器"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="sqlVisible">
      <div class="sqlDialog-btn">
        <el-button @click="sqlVisible = false">取消</el-button>
        <el-button type="primary" @click="sqlSave">确定</el-button>
      </div>
      <sql-element ref="sqler" :sqlEditMsg="sqlEditMsg" :slqTabelEdt="slqTabelEdt"></sql-element>
    </el-dialog>
  </div>
</template>
<script>
  import { isInteger } from '@/utils/validate'
  import sqlElement from '../projectManage/codemirror'
  import formatDate from '@/utils/formatDate'
  export default {
    components: {
      sqlElement
    },
    props:{
      ruleData: {
        default: [],
      },
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
        paramsSqlSelf:'',//选择参数后返回的转义的sql
        slqTabelEdt:[],//sql执行结果
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
          folderPath: '',
          ruleId:''
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
        },
        ruleCheckData: {}
      }
    },
    methods: {
      transSql(str,list,nameList){
        var _str=JSON.parse(JSON.stringify(str));

        if(list.length>1){

        }else if(list.length==1){

        }
      },
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
        this.dataForm.createTime = formatDate.getDate();
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
        this.sqlEditMsg=this.dataForm.ruleSqlValue;

        // this.sqlEditMsg='select 医疗机构编码 id, 医疗机构编码 idName from 医院基本信息{#yljgbm#}';
        console.log(this.sqlEditMsg)
        this.slqTabelEdt=[];
        this.sqlVisible=true;
      },
      //sql编译器点击保存
      sqlSave(){
        var paramData=this.$refs.sqler.paramsData;
        var resultTableTabs=this.$refs.sqler.resultTableTabs;
        if(resultTableTabs.length==0){
          this.$message.error("请先执行sql");
          return false;
        }
        var canSave=true;
        resultTableTabs.forEach(item=>{
          if(item.codeName=='error'){
            canSave=false;
            return false;
          }
        });
        // if(this.$refs.sqler.sqlMsg.indexOf("医疗机构编码")==-1||this.$refs.sqler.sqlMsg.indexOf("医疗机构名称")==-1){
        if(!canSave){
          this.$message.error("医疗机构编码和医疗机构名称是必填项")
        }else{
          var SqlStr=JSON.parse(JSON.stringify(this.$refs.sqler.sqlMsg));
          console.log(SqlStr)
          paramData.forEach(item=>{
            if(item.children&&item.children.length>0){
              item.children.forEach(vtem=>{
                if(SqlStr.indexOf("{#"+vtem.id+"#}")!=-1){
                  var _reg=new RegExp("{#"+vtem.id+"#}",'g');
                  var dom = document.createElement("button");
                  dom.className = "parmasBtn";
                  dom.innerHTML = vtem.name;
                  dom.id=vtem.id;
                  SqlStr=SqlStr.replace(_reg,`<button class="parmasBtn">${vtem.name}</button>`)
                }
              })
            }
          });
          this.paramsSqlSelf=this.$refs.sqler.paramsSqlMsg;
          this.sqlVisible=false;
          this.dataForm.ruleSqlValue=SqlStr;
          this.dataForm.ruleType='1';
          this.dataForm.folderId = this.ruleCheckData.folderId;
          this.dataForm.folderPath = this.ruleCheckData.folderPath;
        }

      },
      cleanMsg(){
        this.activeName='1';
        this.dataForm.id = 0;
        this.dataForm.ruleName = '';
        this.dataForm.ruleCategory = '';
        this.dataForm.folderId = '';
        this.dataForm.parentName = '';
        this.dataForm.ruleSqlValue = '';
        this.dataForm.ruleType = '';
        this.dataForm.folderPath = '';
        this.dataForm.ruleId = '';
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate()
        }
      },
      init (id, ruleCheckData) {

        this.cleanMsg();
        this.visible = true;
        this.ruleCheckData = ruleCheckData; // 获取左侧树选择的规则
        this.dataForm.ruleId = id;
        this.dataForm.folderId = this.ruleCheckData.folderId;
        this.dataForm.folderPath = this.ruleCheckData.folderPath;

        this.getUserInfo();
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.$refs['dataForm'].clearValidate();
          // 初始化规则树
          this.$refs.menuListTree.setCheckedKeys([]);
          this.$refs.menuListTree.setCurrentKey(null);
        })

        if (this.dataForm.ruleId) {
          this.$http({
            url: this.$http.adornUrl(`/rule/selectByUuid/${this.dataForm.ruleId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 200) {
              var datas = data.result;
              this.dataForm.ruleId = datas.ruleId;
              this.dataForm.ruleName = datas.ruleName;
              this.dataForm.ruleCategory = datas.ruleCategory;
              this.dataForm.folderId = datas.folderId;
              this.dataForm.folderPath = datas.folderPath;
              this.dataForm.createUserName = datas.createUserName;
              this.dataForm.createTime = datas.createTime;
              this.dataForm.ruleSqlValue = datas.ruleSqlValue;
              this.sqlEditMsg = datas.ruleSqlValue;

              this.dataForm.ruleType = datas.ruleType;
              // this.menuListTreeSetCurrentNode();
            }
          })
        }
        this.menuListTreeSetCurrentNode();

      },
      // 规则树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.folderId = data.folderId;
        this.dataForm.parentName = data.folderName;
        this.dataForm.folderPath =  data.folderPath;
        this.ruleCheckData = data;
        this.treeVisible=false;
      },
      // 规则树设置当前选中节点
      menuListTreeSetCurrentNode () {
        if (this.dataForm.folderId) {
          if (this.$refs.menuListTree) {
            this.$refs.menuListTree.setCurrentKey(this.dataForm.folderId);
          }
          this.dataForm.parentName = this.getTreeData(this.ruleData,this.dataForm.folderId)[0].folderName;
        }

         // if (this.dataForm.folderId) {

        //   // this.$refs.menuListTree.setCurrentKey(this.dataForm.folderId);
        //   // this.getTreeData(this.treeData, this.checkedData[0].folderId);
        //   // console.log(this.getTreeData(this.ruleData,this.dataForm.folderId), '1111111')
        //   // this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['folderName']
        //   // this.$forceUpdate()
        //   // if (this.$refs.menuListTree) {
        //   //   alert(1)
        //   //   this.$refs.menuListTree.setCurrentKey(this.dataForm.folderId);
        //   // }
        //   // this.dataForm.parentName = this.getTreeData(this.ruleData,this.dataForm.folderId)[0].folderName;
        // }
      },
      // 通过folderId 获取对应的item
      getTreeData (treeData,folderId) {
          const getTreeDataItem = [];
          const traverse = function(treeData,folderId) {
              treeData.map(i => {
                  if (i.folderId == folderId) {
                      getTreeDataItem.push(i);
                  }
                  if (i.children) {
                    traverse(i.children, folderId);
                  }
              })

          }
          traverse(treeData,folderId)
          return getTreeDataItem
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/rule/${!this.dataForm.ruleId ? 'add' : 'updateByUuId'}`),
              method: 'post',
              data: this.$http.adornData({
                'ruleId': this.dataForm.ruleId || undefined,
                'ruleName': this.dataForm.ruleName,
                'ruleCategory': this.dataForm.ruleCategory,
                'folderId': this.dataForm.folderId,
                'createUserName': this.dataForm.createUserName,
                'createTime': this.dataForm.createTime,
                'ruleSqlValue': this.paramsSqlSelf,
                'ruleType': this.dataForm.ruleType,
                'folderPath': this.dataForm.folderPath,
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
                this.$message.error(data.message)
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
    },
    watch : {
      'visible'(nval, oval) {
          // if (nval ) {
          //   this.cleanMsg();
          // }
      },
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
  .folder-icon {
    background: url(../../../assets/img/folder.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: inline-block;
    width: 13px;
    height: 16px;
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
    max-height: 100vh;
    overflow: auto;
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
  .parmasBtn{
    border:1px solid #000;
    border-radius: 4px;
    padding: 5px;
    display: inline-block;
  }
  .sqlDiv-html{
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #999;
    margin-top: 10px;
    border-radius: 4px;
    min-height: 150px;
    height: auto;
  }
</style>

