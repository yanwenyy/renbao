<template>
  <div>
    <el-dialog
      @close="deletCm"
      custom-class="rule-dialog"
      width="80%"
      :title="!demandCollaboration.DEMANDCOLLABORATIONID ? '新增' : '修改'"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form class="infoForm" :model="demandCollaboration" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="80px">
        <el-tabs type="border-card" class="self-tabs" v-model="activeName">
        <el-tab-pane name="1" label="基本信息">
            <div class="tabs1-div">
              <el-form-item label="规则名称" prop="ruleName">
                <el-input v-model="demandCollaboration.DEMANDNAME" :readonly="readonly" placeholder="规则名称"></el-input>
              </el-form-item>
              <el-form-item label="规则类别" prop="ruleCategory">
                <el-select :disabled="readonly" v-model="demandCollaboration.RULECATEGORY">
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
              <el-form-item label="规则备注" prop="ruleRemark" class="markItem">
                <el-input type="textarea" :rows="6" :readonly="readonly" v-model="demandCollaboration.RULEREMARK" placeholder="规则备注"></el-input>
              </el-form-item>
              
            </div>

        </el-tab-pane>
        
          
      </el-tabs>
      </el-form>
      <div class="itemBtn" v-if="showBtn">
      <span slot="footer" class="dialog-footer">
        <el-button @click="sqlEditMsg.msg='',visible = false,cleanMsg()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { isInteger } from '@/utils/validate'
  import { transSql } from '@/utils/publicFun'
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
      projectId:"",
      demandCollaboration: {},
      demandCollaborationId:"",
      showBtn: { type: Boolean },
      readonly: { type: Boolean }
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
        sqlKey:0,
        mustList:{},//sql编译器必填的项
        paramsSqlSelf:'',//选择参数后返回的转义的sql
        slqTabelEdt:[],//sql执行结果
        sqlEditMsg:{msg:''},//回显时候的sql语句
        sqlMsgCopy:'',
        activeName:'1',//tab页切换时的状态值
        sqlVisible:false,//sql编译器显示状态
        treeVisible:false,//规则分类显示名称
        menuList: [],//规则树数据
        menuListTreeProps: {
          label: 'folderName',
          children: 'children',
          disabled: this.readonly
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
          ruleId:'',
          paramRule:[],
          ruleRemark:'',
          ruleSqlStatisticsValue:'',
        },


        treedata: [{
          id: 1,
          columnName: '结果表',
          type:'funFolder',
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'columnName'
        },
        inputValue:'',


        dataRule: {
          DEMANDNAME: [
            { required: true, message: '需求标题不能为空', trigger: 'blur' }
          ],
          RULECATEGORY: [
            { required: true, message: '规则类别不能为空', trigger: ['blur',"change"] }
          ],
          // ruleRemark: [
          //   { required: true, message: '规则备注不能为空', trigger: ['blur',"change"] }
          // ],
          treeVisible: [
            { required: true, message: '规则分类不能为空', trigger: 'change' }
          ],
          // dataTime: [
          //   { required: true, message: '规则分类不能为空', trigger: 'blur' }
          // ],
          // ruleSqlValue: [
          //   { required: true, message: 'sql编译器内容不能为空', trigger:['blur',"change"] }
          // ],
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
      //验证唯一性
      verification(val,msg,name){
        var params={};
        params[name]=val;
        if(val&&val!=this.dataFormCopy.project[name]){
          this.$http({
            url: this.$http.adornUrl("/xmProject/selectRepeat"),
            method: "get",
            isLoading:false,
            params:this.$http.adornParams(params)
            // params: this.$http.adornParams({
            //   projectCode: name == 'projectCode' && val || this.dataForm.project.projectCode,
            //   projectName:   name == 'projectName' && val || this.dataForm.project.projectName ,
            // })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              if(data.result===false){
                this.$message.error(msg);
                this.$forceUpdate();
                this.dataForm.project[name]='';
                this.$set(this.dataForm,this.dataForm)
              }
            }
          });
        }
      },
      //清除信息
      clearMsg(){
        this.dataForm={
          project:{
            projectId: 0,
            projectCode: '',
            projectName: '',
            dataTime: [],
            auditedUnit: '',
            projectRemark: '',
            projectPeriodBegin: '',
            projectPeriodEnd: '',
          },
          projectCosts:[],
          xmProjectGroupUsers:[],
          xmProjectRoleUsers:[]
        };
        this.dataFormCopy={
          project:{},
          projectCosts:[],
          xmProjectGroupUsers:[],
          xmProjectRoleUsers:[],
        };
      },
      init (id, ruleCheckData) {
        this.deletCm();
        this.getMustList();
        this.cleanMsg();
        this.visible = true;
        this.ruleCheckData = ruleCheckData; // 获取左侧树选择的规则
        this.projectId = id;
        this.dataForm.folderId = this.ruleCheckData.folderId;
        this.dataForm.folderPath = this.ruleCheckData.folderPath;
        this.sqlMsgCopy='';
        //this.getUserInfo();
        this.$nextTick(() => {
          //this.$refs['dataForm'].resetFields();
          this.$refs['dataForm'].clearValidate();
          // 初始化规则树
          this.$refs.menuListTree.setCheckedKeys([]);
          this.$refs.menuListTree.setCurrentKey(null);
        });

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
              this.dataForm.ruleSqlStatisticsValue = datas.ruleSqlStatisticsValue;
              this.dataForm.ruleRemark = datas.ruleRemark;
              this.dataForm.folderId = datas.folderId;
              this.dataForm.folderPath = datas.folderPath;
              this.dataForm.createUserName = datas.createUserName;
              this.dataForm.createTime = datas.createTime;
              this.sqlEditMsg.msg = datas.ruleSqlValue;
              this.sqlMsgCopy = JSON.parse(JSON.stringify(datas.ruleSqlValue));

              if(datas.ruleStatisticsColumns){
                var list=[];
                datas.ruleStatisticsColumns.forEach((item)=>{
                  var v={columnName:item.ruleStatisticsColumnName};
                  list.push(v);
                })
                this.treedata[0].children=list;
              }
              this.dataForm.ruleType = datas.ruleType;
              if(datas.params){
                datas.params.forEach(item=>{
                  item.id=item.paramId;
                  item.name=item.paramName;
                });
              }
              var _list=[
                {
                  name:'参数',
                  id:'0',
                  children:datas.params
                },
              ];
              this.dataForm.paramRules = datas.params;
              var str=JSON.parse(JSON.stringify(datas.ruleSqlValue));
              this.dataForm.ruleSqlValue =this.stringToBtn(_list,datas.ruleSqlValue) ;
              this.menuListTreeSetCurrentNode();
            }
          })
        }
        this.menuListTreeSetCurrentNode();

      },
      cleanMsg(){

        this.activeName='1';
        this.dataForm.id = 0;
        this.dataForm.ruleName = '';
        this.dataForm.ruleCategory = '';
        this.treedata[0].children =[];
        this.dataForm.ruleSqlStatisticsValue = '';
        this.dataForm.ruleRemark = '';
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
      getMustList(){
        this.$http({
          url: this.$http.adornUrl('/batch/getMedicalInformation'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.mustList=data.result;
          }
        })
      },
      //删除智能提示框
      deletCm(){
        var cm_complete=document.getElementsByClassName("CodeMirror-hints");
        if(cm_complete[0]){
          cm_complete[0].parentNode.removeChild(cm_complete[0])
        }
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
        if (this.demandCollaboration.FOLDERID) {
          if (this.$refs.menuListTree) {
            this.$refs.menuListTree.setCurrentKey(this.demandCollaboration.FOLDERID);
          }
          this.dataForm.parentName = this.getTreeData(this.ruleData,this.demandCollaboration.FOLDERID)[0].folderName;
        }

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
        // var ruleStatisticsColumns=[];
        // this.treedata[0].children.forEach(item=>{
        //   var v={ruleStatisticsColumnName:item.columnName};
        //   ruleStatisticsColumns.push(v);
        // });
        // if(this.dataForm.ruleSqlStatisticsValue!=''){
        //   if(this.dataForm.ruleSqlStatisticsValue.indexOf("总人次")==-1||this.dataForm.ruleSqlStatisticsValue.indexOf("总金额")==-1){
        //     this.$message.error('统计sql编写的总人次和总金额是必填');
        //     return false;
        //   }
        // }
        
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          
            this.$http({
              url: this.$http.adornUrl(`/demandCollaboration/${!this.dataForm.ruleId ? 'add' : 'updateByUuId'}`),
              method: 'post',
              data: this.$http.adornData({
                'ruleId': this.dataForm.ruleId || undefined,
                'ruleName': this.demandCollaboration.DEMANDNAME,
                'ruleCategory': this.demandCollaboration.RULECATEGORY,
                'ruleRemark': this.demandCollaboration.RULEREMARK,
                'folderId': this.dataForm.folderId,
                'folderPath' : this.dataForm.folderPath,
                'demandCollaborationId': this.demandCollaborationId,
                'projectId': this.projectId,
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
  .table-list{
    width: 100%;
    margin-top:10px;
  }
  .table-btn{
    margin-left: 20px;
  }
  .input-hasBtn{
    width: 70%;
  }
  .tabelForm >>>.el-form-item__error{
    top: 22%;
    left: 40%;
    text-align: right;
    padding-right: 15%;
    display: inline-block;
    width: auto;
  }
  .folder-icon {
  background: url(../../../assets/img/folder.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: inline-block;
  width: 13px;
  height: 16px;
  }
  .userList{
   width: 80%;
  }
  .userList >>>.el-input{
    width: 100%;
    box-sizing: border-box;
  }
  .time-two{
    width: 44%!important;
    display: inline-block;
  }
  .time-two .el-input{
    width: 100%!important;
  }
  .time-two-nolabel{
    margin-left: 0!important;
  }
  >>>.imitate-red>.el-form-item__label:before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
</style>

