<template>
    <div>
      这是商品列表页面
      <span>{{$route.params.goodsId}}</span><br/>
      <span>{{$route.params.hash}}</span>
      <router-link to="/goods/title">显示商品标题</router-link>
      <router-link to="/goods/img">显示商品图片</router-link>
      <div>
        <router-view></router-view>
      </div>
      <!--<router-link to="/cart">跳转到购物车页面</router-link>-->
      <router-link :to="{path:'cart',params:{goodsId:123}}">跳转到购物车页面1</router-link>
      <button @click="jump">button-跳转到购物车页面</button>
    </div>
</template>
<script type="text/ecmascript-6">
    export default{
        data() {
            return {}
        },
      methods:{
            jump() {
                this.$router.push({path:'/cart',query:{goodsId:123}})
//              this.$router.go(-2);
            }
      }
    }
</script>
<style>

</style>
