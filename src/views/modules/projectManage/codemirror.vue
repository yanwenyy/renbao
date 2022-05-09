<template>
  <div style="width:100%">
    <sql-edit
      ref="sqlEdits"
      :treeDefaultProps="treeDefaultProps"
      :parmsDefaultProps="parmsDefaultProps"
      :changeTree="changeTree"
      :getLoadTree="getLoadTree"
      :treedata="treeData"
      :paramsData="paramsData"
      :loadTree="loadTree"
      :getwsData="getwsData"
      :resultTableTabs="resultTableTabs"
      :sqlData="sqlData"
      :sqlListTotal="sqlListTotal"
      :sqlListData="sqlListData"
      :formatContent="formatContent"
      :getSqlList="getSqlList"
      :getSqlMsg="getSqlMsg"
      :deleteSql="deleteSql"
      :saveSql="saveSql"
      :useChinese="true"
      :exportSql="exportSql"
      :paramsList="paramsList"
      :paramsSub="paramsSub"
      :from="from"
      :treeTableClick="treeTableClick"
      :addParamsClick="addParamsClick"
      :paramsDetail="paramsDetail"
      :getParamsDetail="getParamsDetail"
      :getLoadTreeParams="getLoadTreeParams"
      :delParams="delParams"
      :addParamsClassClick="addParamsClassClick"
      :getParamsClassDetail="getParamsClassDetail"
      :paramsClassDetail="paramsClassDetail"
      :delParamsClass="delParamsClass"
    ></sql-edit>
  </div>

</template>

<script>
  import sqlEdit from '@/components/codemirror/sqlEditor'
  import {PxSocket,randomString} from '@/utils'
  import SelfLoading from '@/utils/selfLoading'
  export default {
    components: {
      sqlEdit
    },
    props:{

      //当前页面自己的属性,sql编辑传回来的数据
      sqlEditMsg: {
        type: String,
        default: null,
      },
      //当前页面自己的属性,用来区分websocket连接
      modelName: {
        type: String,
        default: null,
      },
      //当前页面自己的属性,sql执行的列表数据
      slqTabelEdt: {
        type: Array,
        default: null,
      },
    },
    data() {
      return {
        loading:false,
        from:'',
        paramsSqlMsg:'',//当前页面自己的属性 参数点确定之后返回的转义的sql
        paramsList:[],//后台返回的参数列表
        ws:{},//websoket对象
        treeDefaultProps:{
          label:'title',
        },//左侧数据表tree显示数据绑定的名字
        parmsDefaultProps:{
          label:'name',
          isLeaf: 'isLeaf'
        },//左侧参数tree显示数据绑定的名字
        sqlListData:[],//sql列表data
        sqlListTotal:0,//sql列表data
        sqlData:'',//sql编译器内容
        sqlMsg:'',//sql编译器吐给外层的内容
        resultTableTabs: [],//sql执行返回的动态tab
        loadTree: [],//左边树懒加载的数据
        treeData: [],//左边树数据表初始的数据
        paramsData: [
          {
            name:'参数',
            type:'funFolder',//图标类型 文件夹:funFolder
            children:[],
          }
        ],//左边树参数初始的数据
        useChinese:true,//是否汉字化
        userId:sessionStorage.getItem("userId")+"-"+(this.modelName!=null&&this.modelName!=''?this.modelName:'sqlEditor'),
        paramsDetail:{},//参数详情
        paramsClassDetail:{},//分类详情
      }
    },
    watch: {
      sqlEditMsg: {
        // 实时监控数据变化
        immediate: true,
        deep: true,
        handler(val) {
          this.from='edit'
          this.sqlData=val;
          // if(val!=''){
          //   this.sqlData=val;
          //
          // }
        }
      },
      slqTabelEdt(val) {
        if(val){
         this.resultTableTabs=val;
        }
      }
    },
    activated(){
      if(this.$refs.sqlEdits){
        this.$refs.sqlEdits.dragControllerDiv()
      }
      this.sqlListData=[];
      this.sqlListTotal=0;
      this.sqlData='';
      this.resultTableTabs=[];
      this.loadTree=[];
      this.treeData=[];
      this.resultTableTabs=[];
      this.getSjbData();
      this.getSqlList();
      this.getParmasData();
    },
    computed:{
      projectId: {
        get () { return this.$store.state.common.projectId}
      },
    },
    mounted(){

      if(this.treeData==[]||this.treeData.length==0){
        this.$refs.sqlEdits.dragControllerDiv()
        this.sqlListData=[];
        this.sqlListTotal=0;
        this.sqlData='';
        this.resultTableTabs=[];
        this.loadTree=[];
        this.treeData=[];

        this.getSjbData();
        this.getSqlList();
        this.getParmasData();
      }
      this.resultTableTabs=[];
      this.ws=new PxSocket({
        url:this.$http.wsUrl('websocket?'+this.userId),
        succ:this.getDataList
      });
      this.ws.connect();
    },
    destroyed(){
      this.ws.close();
    },
    methods: {
      //删除参数点击
      delParams(data){
        console.log(data);
        this.$http({
          url: this.$http.adornUrl(`/ammParam/delete/${data.id}`),
          method: "post",
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getParmasData();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      //删除分类点击
      delParamsClass(data){
        console.log(data);
        this.$http({
          url: this.$http.adornUrl(`/aaParamFolder/delete/${data.id}`),
          method: "post",
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getParmasData();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      //获取参数详情
      getParamsDetail(data){
        //data 点击的参数节点
        this.$http({
          url: this.$http.adornUrl(`/ammParam/selectByUuid/${data.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            //paramsDetail 需要跟新增或修改传过来的数据格式保持一致
            this.paramsDetail=data.result;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //获取分类详情
      getParamsClassDetail(data){
        //data 点击的参数节点
        this.$http({
          url: this.$http.adornUrl(`/aaParamFolder/selectByUuid/${data.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            //paramsClassDetail 需要跟新增或修改传过来的数据格式保持一致
            this.paramsClassDetail=data.result;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      //添加参数确定按钮点击
      addParamsClick(datas,type){
        //data from表单的内容,type:(add/新增,edit/修改)
        // var params = new FormData();
        // for(let i in data){
        //   if(i=='param'||i=='paramChoice'||i=='paramOptions'){
        //     for(let j in data[i]){
        //       params.append(i+"."+j,data[i][j]);
        //     }
        //   }else{
        //     params.append(i,data[i]);
        //   }
        // };
        console.log(datas)
        this.$http({
          url: this.$http.adornUrl(`/ammParam/${type=='add' ? 'add' : 'updateByUuId'}`),
          method: 'post',
          // data: params,
          data: datas,
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message.success(data.message);
            //局部刷新参数树 this.$refs.sqlEdits.refreshNodeBy(当前操作的id)
            this.$refs.sqlEdits.refreshNodeBy(datas.folderId)
          } else {
            this.$message.error(data.message)
          }
        })
      },
      //添加分类确定按钮点击
      addParamsClassClick(datas,type){
        var params={
          folderSort:datas.folderSort,
          paramFolderName:datas.paramFolderName,
          parentUuid:datas.parentUuid,
          paramFolderUuid:datas.paramFolderUuid,
          pbScope:datas.pbScope=='publicParam'?'1':'2',
        }
        this.$http({
          url: this.$http.adornUrl(`/aaParamFolder/${type=='add' ? 'add' : 'updateByUuId'}`),
          method: 'post',
          data: params,
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message.success(data.message);
            // this.getParmasData();
            //局部刷新参数树
            // this.$refs.sqlEdits.refreshTreeParams(datas.parentUuid);
            this.$refs.sqlEdits.refreshNodeBy(datas.parentUuid)
          } else {
            this.$message.error(data.message)
          }
        })
      },
      //右侧数据树表右击事件 data传过来的node节点
      treeTableClick(data){
        var params={
          projectId:this.projectId,
          tableName:data.data.name,
        };
        this.$http({
          url: this.$http.adornUrl('/sqlScript/buildSelectSql'),
          method: 'get',
          params: this.$http.adornParams(params)
        }).then(({data}) => {
          if(data.code==200){
            this.sqlData=data.result.sql;
          }else{
            this.$message.error(data.message);
          }
        })
      },
      //获取参数树数据
      getParmasData(){
        this.$http({
          url: this.$http.adornUrl('/ammParam/selectAll'),
          method: 'get',
          isLoading:false,
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.result;
          if(datas){
            datas.ParamsType=JSON.parse(JSON.stringify(datas.type));
            datas.type='funFolder'
            datas.children.forEach(item=>{
              item.ParamsType=JSON.parse(JSON.stringify(item.type));//参数的类型 必须的publicParam:公共参数 personalParam:个人参数
              // item.id=item.paramId;//参数树需要的id
              // item.name=item.paramName;//参数树需要的name
              // item.sql=item.paramSql;//参数树需要的sql
              item.type='funFolder';//参数树需要的type 图标类型 参数:params
            });
            // this.paramsData[0].children=datas;
            this.paramsData=[datas];
            this.$set(this.paramsData,this.paramsData)
          }
        })
      },
      //参数设置确定事件点击
      paramsSub(sql,paramsList){//sql传过来的替换过的sql
        console.log(paramsList);
        if(sql!=''){
          this.paramsSqlMsg=sql;
          this.resultTableTabs=[];
          var params={
            sqlScript:sql,
            loadOnce:false,
            dataSize:"500",
            webSocketId:this.userId,
          };
          this.$http({
            url: this.$http.adornUrl('/sqlScript/executeSQL_SqlEditor'),
            method: 'post',
            data: this.$http.adornData(params)
          }).then(({data}) => {
            if(data.code==200){

            }else{
              this.$message.error(data.message);
            }
          })
        }else{
          this.$message.error("sql语句不能为空")
        }
      },
      //导出按钮点击
      exportSql(data){
        if(data){
          // let url = this.$http.adornUrl('/sqlScript/exportExcel?token=') + this.$cookie.get("token")
          // window.open(url)
          this.$http({
            url: this.$http.adornUrl('/sqlScript/setSession'),
            method: 'post',
            data: this.$http.adornData({
              sqlScript:data,
              dataSize:50000,
              exportSize:50000,
            }),
          }).then(({data}) => {
            if(data.code==200){
              let url = this.$http.adornUrl('/sqlScript/exportExcel?token=') + this.$cookie.get("token")
              window.location.href = url;
            }else{
              this.$message.error(data.message);
            }
          })
        }else{
          this.$message.error("sql语句不能为空")
        }
      },
      //获取sql运行websocket返回的数据
      getDataList(datas){
        this.key+=1;
        if(datas&&datas!='ping'){
          datas=JSON.parse(datas);
          console.log(datas);
          var v={};
          if(datas.data&&datas.data.result){
            v={
              list:datas.data.result||[],
              columnList:datas.data.columnList,
              msg:datas.message,
              codeName:datas.codeName,
              isLast:datas.data.isLast
            };
          }else{
            v={
              list:[],
              columnList:datas.data.columnList,
              msg:datas.message,
              codeName:datas.codeName,
              isLast:datas.data.isLast
            };
          }
          this.resultTableTabs.push(v);
          console.log(this.resultTableTabs)
        }
      },
      //实时获取sql内容
      getSqlMsg(data){
        // console.log(data)
        this.sqlMsg=data;
      },
      //删除sql data传过来的主键id
      deleteSql(data){
        this.$http({
          url: this.$http.adornUrl('/draft/draftDelete/'+data),
          method: 'post',
        }).then(({data}) => {
          if(data.code==200){
            this.$message.success("删除成功");
            this.getSqlList();
          }else{
            this.$message.error(data.message);
          }
        })
      },
      //获取sql列表 options查询参数
      getSqlList(options){
        this.$http({
          url: this.$http.adornUrl('/draft/selectDraftPage'),
          method: 'get',
          params: this.$http.adornParams({
            draftName:options?options.draftName:'',
            pageNo:options?options.pageNo:1,
            pageSize:options?options.pageSize:10,
          })
        }).then(({data}) => {
          //注意:
          // 草稿名称默认字段是:draftName,
          // 草稿SQL默认字段是:draftSql,
          // 主键id默认字段是:draftId,
          this.sqlListData=data.result.records;
          this.sqlListTotal=data.result.total;
        })
      },
      //获取数据表数据
      getSjbData(){
        this.$http({
          url: this.$http.adornUrl('/sqlScript/listDBPTree'),
          method: 'get',
          isLoading:false,
          params: this.$http.adornParams()
        }).then(({data}) => {
          // 注意层级 dataType是必须要的,1:一级,2:表,3:列
          var datas=data.result;
          this.treeData=datas?[datas]:[];
        })
      },
      //保存sql数据
      saveSql(data){
        //data里内容
        //draftName:草稿名称
        //draftSql:草稿
        //type:保存类型 save是保存 saveAs是另存为
        var params={
          draftName:data.draftName,
          draftSql:data.draftSql,
          draftId:data.draftId &&data.type=='save'?data.draftId:'',
        };
        this.$http({
          url: this.$http.adornUrl(`/draft/${!data.draftId ||data.type=='saveAs'? 'draftAdd' : 'draftUpdateByUuId'}`),
          method: 'post',
          data: this.$http.adornData(params)
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getSqlList();
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //格式化sql点击,data 编译器内容
      formatContent(datas){
        // /sqlScript/formatSql
        var _reg=new RegExp('{#\\w+\#}','g');
        // if(datas.indexOf("{#")!=-1&&datas.indexOf("#}")!=-1){
        if(_reg.test(datas)){
          datas=datas.replace(/{#/g,"'{#").replace(/#}/g,"#}'");
        }
        this.$http({
          url: this.$http.adornUrl('/sqlScript/formatSql'),
          method: 'post',
          data: this.$http.adornData({sqlScript:datas})
        }).then(({data}) => {
          if(data.code==200){
            var _data=data.result;
            var _regs=new RegExp("'{#\\w+\#}'",'g');
            // if(_data.indexOf("'{#")!=-1&&_data.indexOf("#}'")!=-1){
            if(_regs.test(_data)){
              _data=_data.replace(/'{#/g,"{#").replace(/#}'/g,"#}");
            }
            this.sqlData=_data;
          }else{
            this.$message.error(data.message);
          }
        })
      },
      //左侧树切换类型函数
      changeTree(type){
        console.log(type)
      },
      //展开数据表树形结构进行懒加载的方法 data该节点所对应的对象、obj节点对应的 Node、node节点组件本身
      getLoadTree(datas, obj, node) {
        // console.log(datas,obj,node,222);
        if(datas.children.length==0){
          this.$http({
            url: this.$http.adornUrl('/sqlScript/getColumnList'),
            method: 'get',
            params: this.$http.adornParams({
              id:datas.id,
              tableName:datas.title,
            })
          }).then(({data}) => {
            var _data=data.result;
            this.loadTree =_data||[];
          })
        }


      },
      //展开参数树形结构进行懒加载的方法 data该节点所对应的对象、obj节点对应的 Node、node节点组件本身
      getLoadTreeParams(datas, obj, node) {
        // console.log(datas,obj,node,222);
        if(datas.children.length==0){
          this.$http({
            url: this.$http.adornUrl('/ammParam/getFolderAndParams'),
            method: 'get',
            params: this.$http.adornParams({
              id:datas.id,
              isPersonalParam:datas.ParamsType=='personalParam'?true:false,
              level:datas.level,
              type:datas.ParamsType,
            })
          }).then(({data}) => {
            var _data=data.result;
            _data.forEach(item=>{
              item.ParamsType=JSON.parse(JSON.stringify(item.type));//参数的类型 必须的publicParam:公共参数 personalParam:个人参数
              // item.id=item.paramId;//参数树需要的id
              // item.name=item.paramName;//参数树需要的name
              // item.sql=item.paramSql;//参数树需要的sql
              item.type=item.isParent?'funFolder':'params';//参数树需要的type 图标类型 参数:params
              item.isLeaf=item.isParent? false:true;//参数树需要的type 图标类型 参数:params
              item.children=item.children||[];
            });
            this.loadTree =_data||[];
          })
        }


      },
      //点击运行获取websoket数据
      getwsData(sql,marks,nodeList) {
        this.paramsList=[];

        console.log(sql,marks,nodeList);
        if(sql!=''){
          if(marks.length>0){
            //传给组件内的参数列表格式
            // var _List=[ {
            //   label:'参数111', //label 显示的label名字 必须
            //   list:[
            //     {
            //       name:'医院1',//name是必须的
            //       id:'1111',//id是必须的
            //     }
            //   ],//参数下拉列表
            // }];

            var _dataList=[];
            nodeList.forEach(item=>{
              var v={
                sqlScript:item.sql,
                paramName:item.name,
                id:item.id,
                webSocketId:this.userId,
              }
              _dataList.push(v)
            });

            this.$http({
              url: this.$http.adornUrl('/sqlScript/executeParamsSQL'),
              method: 'post',
              data: _dataList
            }).then(({data}) => {
              if(data.code==200){

                var datas=data.result;
                datas.forEach(item=>{
                  item.label=item.paramName;
                  item.list=item.jsonObject.data;
                });
                this.paramsList=datas;
              }else{
                this.$message.error(data.message);
              }
            });
          }else{
            this.resultTableTabs=[];
            var params={
              sqlScript:sql,
              loadOnce:false,
              dataSize:"500",
              webSocketId:this.userId,
            };
            SelfLoading.show({
              buttonClass:'el-button el-button--primary',
              buttonText:'取消执行',
              buttonFun:function(){SelfLoading.hide()}
            });
            this.$http({
              url: this.$http.adornUrl('/sqlScript/executeSQL_SqlEditor'),
              method: 'post',
              data: this.$http.adornData(params),
              isLoading:false
            }).then(({data}) => {
              SelfLoading.hide();
              if(data.code==200){

              }else{
                // this.$message.error(data.message);
                this.$alert(data.message, '注意', {
                  cancelButtonText: '关闭',
                  showConfirmButton: false,
                  showCancelButton: true,
                  type: 'error',
                });
              }
            })
          }
        }else{
          this.$message.error("sql语句不能为空")
        }
      },
    }
  }
</script>

<style scoped>
  >>>.selfCustom .el-loading-text{
      cursor: pointer;
  }
</style>
