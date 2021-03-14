<template>
  <div class="post-container">
    <PostComponent class="mt-5">
      <div slot="posting">
        <div
        v-if="lists.length"
        class="d-flex flex-wrap justify-content-center p-3"
        >
            <div 
                class="border-top shadow ml-3 mt-3 card-wrapper"
                v-for="list in lists"
                :key="list.src">
                <div
                v-if="list.image"
                class="post-image"
                :style="{backgroundImage: `url(${list.image})`}"
                ></div>
            </div>
            </div>
      </div>
    </PostComponent>
    
    <PostComponent class="mt-5">
      <div slot="posting">
        <div class="text-center border-bottom p-3">위치 정보</div>
        <div class="d-flex" style="height:100px;">
          <div class="h-100 flex-container" style="flex:1">
            주소
          </div>
          <div class="h-100 flex-container border-left" style="flex:10">
            <div class="d-flex w-100 align-items-center justify-content-center">
             {{address}}
            </div>
          </div>
        </div>
      </div>
    </PostComponent>
    <PostComponent class="mt-5">
      <div slot="posting">
        <div class="text-center border-bottom p-3">옵션</div>
        <div class="d-flex p-3">
         <b-button-group size="lg">
            <b-button v-if="option1 === true" variant="primary" style="width:200px">세탁기</b-button>
            <b-button v-if="option2 === true" variant="primary" style="width:200px">냉장고</b-button>
            <b-button v-if="option3 === true" variant="primary" style="width:200px">침대</b-button>
            <b-button v-if="option4 === true" variant="primary" style="width:200px">티비</b-button>
        </b-button-group>
        </div>
      </div>
    </PostComponent>

    <PostComponent class="mt-5">
      <div slot="posting">
        <div class="text-center border-bottom p-3">내용</div>
        <div class="d-flex justify-content-top p-5" style="height:240px;">
          {{content}}
        </div>
      </div>
    </PostComponent>
  </div>
</template>

<script>
import PostComponent from "../components/PostComponent";
import { postApi } from "../utils/axios";
export default {
  components:{
    PostComponent,
  },
  data() {
    return {
      latitude: "",
      longitude: "",
      address: "",
      title: "",
      content: "",
      lists: [],
      option1: false,
      option2: false,
      option3: false,
      option4: false,
    };
  },
  async mounted(){
    // console.log(this.$route.params.id)
    const id = this.$route.params.id;
    const {data} = await postApi.detail(id);
    this.title = data.room.title;
    this.content = data.room.content;
    this.address = data.room.address;
    this.files = data.room.Images;
    
    for (let i = 0; i < data.room.Options.length; i++) {
        if (data.room.Options[i].item === "세탁기") this.option1 = true;
        if (data.room.Options[i].item === "냉장고") this.option2 = true;
        if (data.room.Options[i].item === "침대") this.option3 = true;
        if (data.room.Options[i].item === "티비") this.option4 = true;
    }
    
    if (data.room.Images.length) {
        for (const li of data.room.Images) {
            // console.log(li)
            const res = await postApi.getFile(li.src);
            // console.log(res)
            const blob = new Blob([res.data], {
            type: res.headers["content-type"],
            });
            this.lists.push({...li, image: window.URL.createObjectURL(blob)});
        }
    }
    console.log(this.images)
  },
    
};
</script>

<style>
.post-image{
  width: 300px;
  height: 250px;
  background-size: cover;
}
.card-wrapper:hover{
  opacity: 0.5;
  cursor: pointer;
}

.post-container {
  width: 1180px;
  margin: 40px auto;
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>