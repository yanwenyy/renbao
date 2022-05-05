<template>
  <div>
    <el-dialog
      width="70vw"
      :title="type=='add' ? '新增' :type=='look'?'查看': '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
        <el-tabs v-if="visibleType=='params'" type="border-card" class="self-tabs" v-model="activeName">
          <el-tab-pane name="1" label="基本信息">
            <div class="tabs1-div">
              <el-form-item label="参数名称" prop="param.paramName">
                <el-input :disabled="type=='look'" v-model="dataForm.param.paramName" placeholder="参数名称" maxlength="255"></el-input>
              </el-form-item>
              <el-form-item label="数据类型" prop="param.dataType">
                <el-select :disabled="type=='look'" v-model="dataForm.param.dataType" placeholder="请选择">
                  <el-option label="数字" value="num"></el-option>
                  <el-option label="文本" value="str"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="输入方式" prop="param.inputType">
                <el-select :disabled="type=='look'" v-model="dataForm.param.inputType" placeholder="请选择">
                  <el-option label="文本框" value="textinp"></el-option>
                  <el-option label="列表" value="lineinp"></el-option>
                  <el-option label="树" value="treeinp"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="示例" prop="param.example">
                <el-input :disabled="type=='look'" v-model="dataForm.param.example" placeholder="示例" maxlength="255"></el-input>
              </el-form-item>
              <el-form-item label="允许为空">
                <el-radio-group v-model="dataForm.paramChoice.allowedNull">
                  <el-radio :disabled="type=='look'" :label="1">是</el-radio>
                  <el-radio :disabled="type=='look'" :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="形式类型" v-if="dataForm.param.inputType=='lineinp'||dataForm.param.inputType=='treeinp'">
                <el-radio-group v-model="dataForm.paramChoice.choiceType">
                  <el-radio :disabled="type=='look'" :label="1">单选</el-radio>
                  <el-radio :disabled="type=='look'" :label="0">多选</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="参数值长度" v-if="dataForm.param.inputType=='textinp'">
                <el-input type="Number" :disabled="type=='look'" v-model="dataForm.param.dataLength" placeholder="参数值长度"></el-input>
              </el-form-item>
              <el-form-item label="备选值设置"  v-if="dataForm.param.inputType=='lineinp'||dataForm.param.inputType=='treeinp'">
                <el-tabs v-model="activeName2">
                  <el-tab-pane label="自定义动态" name="first" v-if="dataForm.param.inputType=='lineinp'">
                    <ul class="sa-list">
                      <li v-for="(item,index) in dataForm.paramOptions">
                        <el-input :disabled="type=='look'" placeholder="名称" v-model="item.optionsName"></el-input>
                        <el-input :disabled="type=='look'" placeholder="值" v-model="item.optionsVal"></el-input>
                        <el-button v-if="index==0&&type!='look'" type="primary" size="small" @click="dataForm.paramOptions.push({ optionsName:'',optionsVal:''})">加</el-button>
                        <el-button v-if="index>0&&type!='look'" type="primary" size="small" @click="dataForm.paramOptions.splice(index,1)">减</el-button>
                      </li>
                    </ul>
                  </el-tab-pane>
                  <el-tab-pane label="SQL动态" name="second">
                    <el-input
                      :disabled="type=='look'"
                      style="margin-bottom: 10px"
                      type="textarea"
                      :rows="6"
                      placeholder="请输入SQL"
                      v-model="dataForm.paramChoice.optionsSql">
                    </el-input>
                    <el-button v-if="type!='look'" type="primary" @click="sqlRuleVisible = true">查看SQL规则</el-button>
                    <el-button v-if="type!='look'" type="primary">预览</el-button>
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
              <el-form-item label="说明">
                <el-input
                  :disabled="type=='look'"
                  type="textarea"
                  :rows="6"
                  placeholder="说明"
                  v-model="dataForm.param.description">
                </el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
          <!--<el-tab-pane v-if="dataForm.param.inputType=='treeinp'" name="2" label="关联参数配置">-->
            <!--<div class="tabs1-div">-->
              <!--<el-table-->
                <!--class="table-list"-->
                <!--border-->
                <!--:data="relationParamList"-->
                <!--stripe-->
                <!--style="width: 100%">-->
                <!--<el-table-column-->
                  <!--type="index"-->
                  <!--header-align="center"-->
                  <!--align="center"-->
                  <!--width="80"-->
                  <!--label="序号"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="associatedParamName"-->
                  <!--label="被关联参数名称"-->
                  <!--header-align="center"-->
                  <!--align="center"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="associatedParamCol"-->
                  <!--label="被关联参数值"-->
                  <!--header-align="center"-->
                  <!--align="center"-->
                <!--&gt;-->

                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--prop="paramValueType"-->
                  <!--label="关联参数值"-->
                  <!--header-align="center"-->
                  <!--align="center"-->
                <!--&gt;-->
                  <!--<template slot-scope="scope">-->
                    <!--{{scope.row.paramValueType=='realValue'?'真实值':scope.row.paramValueType=='displayValue'?'显示值':''}}-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                  <!--header-align="center"-->
                  <!--align="center"-->
                  <!--width="150"-->
                  <!--label="操作">-->
                  <!--<template slot-scope="scope">-->
                    <!--&lt;!&ndash;<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.rowId)">修改</el-button>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-button type="text" size="small" @click="deleteHandle(scope.row.rowId)">删除</el-button>&ndash;&gt;-->
                    <!--<el-button type="text" size="small" @click="">修改</el-button>-->
                    <!--<el-button type="text" size="small" @click="relationParamList.splice(scope.$index,1)">删除</el-button>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              <!--</el-table>-->
              <!--<el-form-item label="被关联参数名称" class="item-three">-->
                <!--<el-popover-->
                  <!--:disabled="type == 'look'"-->
                  <!--ref="menuListPopover"-->
                  <!--placement="bottom-start"-->
                  <!--trigger="click"-->
                  <!--v-model="treeVisible"-->
                <!--&gt;-->
                  <!--<el-tree-->
                    <!--class="rule-tree"-->
                    <!--:data="relationParamTree"-->
                    <!--:props="menuListTreeProps"-->
                    <!--node-key="folderId"-->
                    <!--ref="menuListTree"-->
                    <!--@current-change="menuListTreeCurrentChangeHandle"-->
                    <!--:default-expand-all="false"-->
                    <!--:highlight-current="true"-->
                    <!--:expand-on-click-node="false"-->
                  <!--&gt;-->
                    <!--<span slot-scope="{ node }">-->
                      <!--<span class="tree-label">-->
                        <!--<span class="folder-icon"></span>-->
                        <!--<span :title="node.label"> {{ node.label }}</span>-->
                      <!--</span>-->
                    <!--</span>-->
                  <!--</el-tree>-->
                <!--</el-popover>-->
                <!--<el-input-->
                  <!--:disabled="type == 'look'"-->
                  <!--@click="treeVisible = true"-->
                  <!--v-popover:menuListPopover-->
                  <!--v-model="relationForm.associatedParamName"-->
                  <!--:readonly="true"-->
                  <!--placeholder="点击选择"-->
                  <!--class="menu-list__input"-->
                <!--&gt;</el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="被关联参数值" class="item-three">-->
                <!--<el-select v-model="relationForm.associatedParamCol" placeholder="请选择">-->

                <!--</el-select>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="对应参数值" class="item-three">-->
                <!--<el-select v-model="relationForm.paramValueType" placeholder="请选择">-->
                  <!--<el-option label="真实值" value="realValue"></el-option>-->
                  <!--<el-option label="显示值" value="displayValue"></el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
              <!--<el-button type="primary" size="small" @click="relationFromSave">保存</el-button>-->
              <!--<div class="relationFormMsg">-->
                <!--<div>说明：</div>-->
                <!--<div>1、一个【参数A】可以选择多个【参数B】作为其被关联参数，当【参数A】值发生变化时，会将它的对应值（真实值或显示值）传给【被关联参数B】</div>-->
                <!--<div>2、【被关联参数B】接收到【参数A】传递的对应值后，将该对应值作为条件从而筛选【被关联参数B】中的数据</div>-->
                <!--<div>3、在修改被关联参数时，若发现反显的信息与列表展示信息不符，则该被关联参数已被修改，以反显的信息为主</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</el-tab-pane>-->
        </el-tabs>
        <div v-if="visibleType=='class'">
          <el-form-item label="文件夹名称" prop="paramFolderName">
            <el-input v-model="dataForm.paramFolderName" placeholder="文件夹名称"></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="paramFolderName">
            <el-input v-model="dataForm.folderSort" placeholder="排序号"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false,cleanMsg()">取消</el-button>
      <el-button v-if="type!='look'" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      :append-to-body='true'
      title="查看SQL规则"
      :visible.sync="sqlRuleVisible"
      width="40%">
      <div v-if="dataForm.param.inputType=='lineinp'">
        <div>1、SQL语句的格式为：SELECT A,B FROM C</div>
        <div>2、其中【A】字段为真实值，【B】字段为显示值，若字段过多（或者存在【*】），则默认只使用前两列进行真实值与显示值的匹配</div>
      </div>
      <div v-if="dataForm.param.inputType=='treeinp'">
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
    props:{
      //添加分类点击确定事件
      addParamsClassClick:{
        type: Function,
        default: null,
      },
      //添加参数确定点击事件
      addParamsClick: {
        type: Function,
        default: null,
      },
      //参数详情
      paramsDetail: {
        type: Object,
        default: null,
      },
      //分类详情
      paramsClassDetail: {
        type: Object,
        default: null,
      },
      //参数的类型
      paramsType: {
        type: String,
        default: null,
      },
    },
    data () {
      return {
        sqlRuleVisible:false,//查看sql规则状态
        activeName: "1", //tab页切换时的状态值
        activeName2: "first", //tab页切换时的状态值
        type:'add',
        visible: false,
        visibleType: 'params',
        selfActionsList:[{
          names:'',
          value1:'',
        }],
        relationParamTree:[],
        treeVisible: false,
        relationForm:{
          associatedParamName:'',//被关联参数名称
          associatedParamId:'',//被关联参数id
          associatedParamCol:'',//被关联参数值
          paramValueType:'',//对应参数值
        },
        menuListTreeProps: {
          label: "name",
          children: "children"
        },
        relationParamList:[],
        dataForm: {
          id: 0,
          param:{
            paramName:'',
            paramAlias:'',
            dataType:'',
            inputType:'',
            example:'',
            dataLength:'',
            description:'',
            ammParamTypeUuid:'',
            signForSql:'',
          },
          paramChoice:{
            allowedNull: 1,
            choiceType: 1,
            optionsSql:'',
          },
          paramOptions:[],
          associatedParamJsonStr:'',
          // scopeType: '',
          folderId: '',
          paramFolderName:'',//文件夹名称
          folderSort:'',//排序号
          parentUuid:'',//父级编号
          pbScope:'',//1、公共、2、个人
        },
        dataRule: {
          'param.paramName': [
            { required: true, message: '参数名称不能为空', trigger: 'blur' }
          ],
          'param.dataType': [
            { required: true, message: '数据类型不能为空', trigger:['blur','change'] }
          ],
          'param.inputType': [
            { required: true, message: '输入方式不能为空', trigger: 'blur' }
          ],
          'param.example': [
            { required: true, message: '示例不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      clone(myObj,newObj){
        if(typeof(myObj) != 'object'||typeof(newObj) != 'object'){
          return myObj;
        }
        if(myObj == null){
          return newObj;
        }
        for(let i in myObj){
          newObj[i] =myObj[i]?JSON.parse(JSON.stringify(myObj[i])):newObj[i];
        }
        console.log(newObj)
        return newObj;
      },
      //关联参数配置保存
      relationFromSave(){
        this.relationParamList.push(this.relationForm);
        this.relationForm={
          associatedParamName:'',//被关联参数名称
          associatedParamId:'',//被关联参数id
          associatedParamCol:'',//被关联参数值
          paramValueType:'',//对应参数值
        };
      },
      // 通过folderId 获取对应的item
      getTreeData(treeData, folderId) {
        const getTreeDataItem = [];
        const traverse = function(treeData, folderId) {
          treeData.map(i => {
            if (i.id == folderId) {
              getTreeDataItem.push(i);
            }
            if (i.children) {
              traverse(i.children, folderId);
            }
          });
        };
        traverse(treeData, folderId);
        return getTreeDataItem;
      },
      // 规则树选中
      menuListTreeCurrentChangeHandle(data, node) {
        this.relationForm.associatedParamId = data.id;
        this.relationForm.associatedParamName = data.name;
        this.treeVisible = false;
      },
      // 规则树设置当前选中节点
      menuListTreeSetCurrentNode() {
        if (this.relationForm.associatedParamId) {
          if (this.$refs.menuListTree) {
            this.$refs.menuListTree.setCurrentKey(this.relationForm.associatedParamId);
          }
          this.relationForm.associatedParamName = this.getTreeData(
            this.relationParamTree,
            this.relationForm.associatedParamId
          )[0].name;
        }
      },
      cleanMsg(){
        this.dataForm={
          id: 0,
          param:{
            paramName:'',
            paramAlias:'',
            dataType:'',
            inputType:'',
            example:'',
            dataLength:'',
            description:'',
            ammParamTypeUuid:'',
            signForSql:'',
          },
          paramChoice:{
            allowedNull: 1,
            choiceType: 1,
            optionsSql:'',
          },
          paramOptions:[],
          associatedParamJsonStr:'',
          // scopeType: '',
          folderId: '',
          paramFolderName:'',//文件夹名称
          folderSort:'',//排序号
          parentUuid:'',//父级编号
          pbScope:'',//1、公共、2、个人
        };
        this.selfActionsList=[{
          names:'',
          value1:'',
        }];
      },
      init (id,type,paramsData) {
        this.relationParamTree=paramsData;
        // this.type=type;
        this.cleanMsg();
        this.visibleType='params';
        this.visible = true;
        this.dataForm.id=id;
        this.dataForm.folderId=id;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        });
      },
      initClass (id,type,formData) {
        this.cleanMsg();
        this.visibleType='class';
        this.visible = true;
        this.dataForm.id=id;
        console.log(formData,433)
        this.dataForm.parentUuid=formData.pid;
        this.dataForm.pbScope=formData.ParamsType;
        this.dataForm.folderId=id;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        });
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // var nameStr=[],valueStr=[];
            // this.selfActionsList.forEach(item=>{
            //   nameStr.push(item.names);
            //   valueStr.push(item.value1);
            // });
            // this.dataForm.paramOptions.optionsNames=nameStr.join("-");
            // this.dataForm.paramOptions.optionsVals=valueStr.join("-");
            if(this.visibleType=='params'){
              this.dataForm.associatedParamJsonStr=JSON.stringify(this.relationParamList);
              this.addParamsClick(this.dataForm,this.type);
            }else{
              this.addParamsClassClick(this.dataForm,this.type);
            }
            this.visible=false;
          }
        })
      }
    },
    watch:{
      'dataForm.param.inputType':{
        handler(newVal, oldVal) {
          if(newVal=='treeinp'){
            this.activeName2='second';
          }else{
            this.activeName2='first';
          }
        },
      },
      paramsDetail: {
        deep: true,
        handler(newVal, oldVal) {
          console.log(newVal,425);
          this.visibleType='params';
          this.dataForm=this.clone(newVal,this.dataForm);
          this.dataForm.paramChoice.choiceType=Number(this.dataForm.paramChoice.choiceType);
          this.visible=true;
        },
      },
      paramsClassDetail: {
        deep: true,
        handler(newVal, oldVal) {
          this.visibleType='class';
          this.dataForm=this.clone(newVal,this.dataForm);
          this.visible=true;
        },
      },
      paramsType: {
        deep: true,
        handler(newVal, oldVal) {
          if(newVal.indexOf("@split@")!=-1){
            this.type=newVal.split("@split@")[0]
          }else{
            this.type=newVal;
          }
        },
      },

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
  .table-list{
    margin-bottom: 10px;
  }
  .item-three{
    width: 30%;
    display: inline-block;
  }
  .relationFormMsg{
    color:red;
  }
</style>
