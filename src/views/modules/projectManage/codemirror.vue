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
    ></sql-edit>
  </div>

</template>

<script>
  import sqlEdit from '@/components/codemirror/sqlEditor'
  import {PxSocket,randomString} from '@/utils'
  export default {
    components: {
      sqlEdit
    },
    props:{
      sqlEditMsg: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        paramsList:[],//后台返回的参数列表
        ws:{},//websoket对象
        treeDefaultProps:{
          label:'title',
        },//tree显示数据绑定的名字
        parmsDefaultProps:{
          label:'name',
        },//tree显示数据绑定的名字
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
            type:'funFolder',//图标类型 文件夹
            children:[
              {
                id: "yljgbm",
                name: "医疗机构编码",
                sql: "select 医疗机构编码 id from 医院基本信息",
                type:'params',//图标类型 参数
              },
              {
                id: "yljgmc",
                name: "医疗机构名称",
                sql: "select 医疗机构名称 id from 医院基本信息",
                type:'params',//图标类型 参数
              },
            ],
          }
        ],//左边树参数初始的数据
        useChinese:true,//是否汉字化
        userId:sessionStorage.getItem("userId"),
      }
    },
    watch: {
      sqlEditMsg(val) {
        console.log(val,6666)
        if(val!=''){
          if(val!=''){
            this.sqlData=val;
          }
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
      this.getSjbData();
      this.getSqlList();
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
      }
      this.ws=new PxSocket({
        url:this.$http.wsUrl('websocket?'+this.userId),
        succ:this.getDataList
      });
      this.ws.connect();
    },
    beforeDestory(){
      this.ws.close();
    },
    methods: {
      //参数设置确定事件点击
      paramsSub(sql){//sql传过来的替换过的sql

        console.log("设置参数了"+sql)
        if(sql!=''){
          this.resultTableTabs=[];
          var params={
            sqlScript:sql,
            loadOnce:false,
            dataSize:"500"
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
          //let url = this.$http.adornUrl('/sqlScript/exportExcel?token=') + this.$cookie.get("token")
          //window.open(url)
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
              msg:datas.message
            };
          }else{
            v={
              list:[],
              columnList:datas.data.columnList,
              msg:datas.message
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
        console.log(datas)
        this.$http({
          url: this.$http.adornUrl('/sqlScript/formatSql'),
          method: 'post',
          data: this.$http.adornData({sqlScript:datas})
        }).then(({data}) => {
          if(data.code==200){
            this.sqlData=data.result;
          }else{
            this.$message.error(data.message);
          }
        })
      },
      //左侧树切换类型函数
      changeTree(type){
        console.log(type)
      },
      //展开树形结构进行懒加载的方法 data该节点所对应的对象、obj节点对应的 Node、node节点组件本身
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
      //点击运行获取websoket数据
      getwsData(sql,marks,nodeList) {
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
            this.paramsList=[];
            var _dataList=[];
            nodeList.forEach(item=>{
              var v={
                sqlScript:item.sql,
                paramName:item.name,
                id:item.id,
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
              dataSize:"500"
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
          }
        }else{
          this.$message.error("sql语句不能为空")
        }
      },
    }
  }
</script>

<style scoped>

</style>
