<template>
  <sql-edit
    :treeDefaultProps="treeDefaultProps"
    :changeTree="changeTree"
    :getLoadTree="getLoadTree"
    :treedata="treeData"
    :loadTree="loadTree"
    :getwsData="getwsData"
    :tableData="tableData"
    :sqlData="sqlData"
    :sqlListTotal="sqlListTotal"
    :sqlListData="sqlListData"
    :formatContent="formatContent"
    :getSqlList="getSqlList"
    :deleteSql="deleteSql"
    :saveSql="saveSql"
    :useChinese="true"
  ></sql-edit>
</template>

<script>
  import sqlEdit from '@/components/codemirror/sqlEditor'

  export default {
    components: {
      sqlEdit
    },
    data() {
      return {
        ws:{},
        treeDefaultProps:{
          label:'title'
        },//tree显示数据绑定的参数名字
        sqlListData:[],//sql列表data
        sqlListTotal:0,//sql列表data
        sqlData:'',//sql编译器内容
        tableData: [],
        loadTree: [],//左边树懒加载的数据
        treeData: [],//左边树初始的数据
        useChinese:true,//是否汉字化
      }
    },
    activated(){
      this.getSjbData();
      this.getSqlList();
    },
    beforeDestroy(){
      this.ws.close();
    },
    methods: {
      getDataList(datas){
        console.log(datas)
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
      formatContent(data){
        console.log(data)
        this.sqlData=data;
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
        this.ws=new PxSocket({
          url:this.$http.wsUrl('/webSocket/yancs'),
          data:sql,
          succ:this.getDataList
        });
        var that = this;
        setInterval(function () {
          that.tableData.push({
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          })
        }, 1000)
      },
    }
  }
</script>

<style scoped>

</style>
