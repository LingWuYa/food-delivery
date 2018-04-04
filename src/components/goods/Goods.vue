<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" class="menu-item" :class = "{'current':currentIndex===index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class = "food-item border-1px" @click = "selectFood(food, $event)">
              <div class="icon">
                <img :src="food.icon" alt="" width="57px" height="57px">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontroll-wrapper">
                  <cartcontroll @add="addFood" :food="food"></cartcontroll>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></shopcart>
    <food :food="selectedFood" ref="food" @add="addFood"></food>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import shopcart from '../shopcart/Shopcart'
import cartcontroll from '../cartcontroll/CartControll'
import food from '../food/Food'

import axios from 'axios'
const ERR_OK = 0

export default {
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    axios.get('/api/goods').then((response) => {
      response = response.data
      if (response.errno === ERR_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true})
      // better-scroll 默认会阻止浏览器的原生 click 事件
      // 当click设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {probeType: 3, click: true})
      // probeType: 3 表示让插件时时监测滚动的位置并回传
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      // 获取food-wrapper部分每个类别区块内容的高度
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu (index, event) {
      if (!event._constructed) {
        return
        // 插件会阻止点击默认事件，取消后pc端点击会触发两次事件，将非插件派发的return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
      // 插件提供的接口方法，第一个参数目标元素，第二个参数是时间
    },
    addFood (target) {
      this._drop(target)
    },
    _drop (target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  components: {
    shopcart,
    cartcontroll,
    food
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        font-size: 0
        padding: 0 12px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #fff
          .text
            border-none()
            font-weight: 700
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          font-size: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          font-size: 12px
          width: 56px
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display: flex
        padding: 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
        .icon
          flex: 0 0 57px
          width: 57px
          margin-right: 10px
        .content
          flex: 1
          position: relative
          .name
            font-size: 14px
            line-height: 14px
            margin: 2px 0 8px 0
            color: rgb(7,17,27)
          .desc, .extra
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
              line-height: 10px
          .price
            font-weight: 700
            line-height:24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240,20,20)
            .old
              font-size: 10px
              color: rgb(147,153,159)
              text-decoration: line-through
          .cartcontroll-wrapper
            position: absolute
            right: 0
            bottom: -6px
</style>
