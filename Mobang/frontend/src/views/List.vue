<template>
  <div>
    <div class="bg-primary p-3 text-white text-center h3">방 목록</div>
    <div
      v-if="lists.length"
      class="d-flex flex-wrap justify-content-center p-3"
    >
      <div 
        class="border-top shadow ml-3 mt-3 card-wrapper"
        v-for="list in lists"
        :key="list.id"
        @click="$router.push(`/detail/${list.id}`)"
      >
      <div
      v-if="list.image"
      class="post-image"
      :style="{backgroundImage: `url(${list.image})`}"
      ></div>
      <div class="text-center">{{list.title}}</div>
      <div class="border-top p-3 text-center">{{ list.content }}</div>
      
      </div>
    </div>
  </div>
</template>
<script>
import { postApi } from '../utils/axios';
export default {
  data() {
    return {
      lists:[],
      imageList:[],
    }
  },
  async mounted() {
    console.log(this.$route);
    const {data} = await postApi.getList(this.$route.query.search);
    console.log(data);
    // Promise.all과 for of 차이점: Promise.all 일괄적으로 요청을 보내서 리턴을 받기때문에
    // 순서가 보장되지 않는다.
    // for of 는 순서가 보장된다.
    for (const li of data.room) {
      if(li.Images.length){
        const res = await postApi.getFile(li.Images[0].src);
        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        this.lists.push({...li, image: window.URL.createObjectURL(blob)});
      }
    }
  },
};
</script>

<style>
.post-image{
  width: 400px;
  height: 300px;
  background-size: cover;
}
.card-wrapper:hover{
  opacity: 0.5;
  cursor: pointer;
}
</style>