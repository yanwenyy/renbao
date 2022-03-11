<template>
  <sql-edit
    ref="sqlEdits"
    :treeDefaultProps="treeDefaultProps"
    :changeTree="changeTree"
    :getLoadTree="getLoadTree"
    :treedata="treeData"
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
  ></sql-edit>
</template>

<script>
  import sqlEdit from '@/components/codemirror/sqlEditor'
  import {PxSocket,randomString} from '@/utils'
  export default {
    components: {
      sqlEdit
    },
    data() {
      return {
        ws:{},//websoket对象
        treeDefaultProps:{
          label:'title'
        },//tree显示数据绑定的参数名字
        sqlListData:[],//sql列表data
        sqlListTotal:0,//sql列表data
        sqlData:'',//sql编译器内容
        sqlMsg:'',//sql编译器吐给外层的内容
        resultTableTabs: [],//sql执行返回的动态tab
        loadTree: [],//左边树懒加载的数据
        treeData: [],//左边树初始的数据
        useChinese:true,//是否汉字化
        userId:sessionStorage.getItem("userId"),
      }
    },
    mounted(){
      this.sqlListData=[];
      this.sqlListTotal=0;
      this.sqlData='';
      this.resultTableTabs=[];
      this.loadTree=[];
      this.treeData=[];
      this.getSjbData();
      this.getSqlList();
      this.ws=new PxSocket({
        url:this.$http.wsUrl('websocket?'+this.userId),
        succ:this.getDataList
      });
      this.ws.connect();
    },
    beforedestroy(){
      this.ws.close();
    },
    methods: {
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
              msg:datas.message
            };
          }else{
            v={
              list:[],
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
          // console.log(data);
          var datas=data.result;
          // datas=treeDataTranslate(datas, 'id','parentId');
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
      getwsData(sql) {
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
      },
    }
  }
</script>

<style scoped>

</style>
