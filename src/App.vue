<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
        <router-link to="/goods">商品</router-link>
        <router-link to="/ratings">评价</router-link>
        <router-link to="/seller">商家</router-link>
    </div>
    <keep-alive>
    <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import {urlParse} from './common/js/util'
import header from './components/header/Header'
import axios from 'axios'

const ERR_OK = 0

export default {
  name: 'App',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  components: {
    'v-header': header
  },
  created () {
    axios.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.data
      if (response.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, response.data)
      }
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    text-align: center
    border-1px(rgba(7,17,27,.1))
    & > a
      display: block
      flex: 1
      color: rgb(86,94,101)
      font-size：14px
      &.active
        color: rgb(240,20,20)
</style>
