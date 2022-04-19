<template>
  <div>
    <div class="tree">
      <BaseCodeTree :dataSortIds="dataSortIds" :dataSortNames="dataSortNames" :editTags="editTags"></BaseCodeTree>
    </div>
    <div tyle="width:100%">
      <BaseCodeTreeList ref="listData"></BaseCodeTreeList>
    </div>
  </div>
</template>

<script>
import BaseCodeTree from './BaseCodeTree.vue';
import BaseCodeTreeList from './BaseCodeTreeList.vue';

export default {
   props: { 
    dataSortIds: { type: String } ,
    dataSortNames:{type: String},
    editTags:{type: Number}
  },
  components: {
    BaseCodeTree,
    BaseCodeTreeList
  },
  mounted: function() {
    this.$refs.listData.query();
  },
};
</script>


<style scoped>
.tree {
  width: 300px;
  float: left;
  margin-right: 10px;
  height: 95%;
}
.divContent {
  width: 78%;
  float: right;
}
</style>