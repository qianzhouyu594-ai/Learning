<template>
  <el-menu
    :style="{width:!isCollapse? '230px' : '64px'}"
    active-text-color="#ffd04b"
    background-color="#545c64"

    class="aside-container" 
    
    default-active="2"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
  >
    <p class="logo-lg">{{ isCollapse? '陪诊':  '美女陪诊'}}</p>
    <TreeMenu :index="1" :menuData="menuData"></TreeMenu>
  </el-menu>
</template>


<script setup>
import TreeMenu from './treeMenu.vue'
import { useRouter } from 'vue-router'
import { ref, reactive,computed } from 'vue'
import {useStore} from 'vuex'

const router = useRouter()
//创建响应式数据
let menuData = reactive(router.options.routes[0].children)
const store = useStore()
//计算属性
const isCollapse= computed(()=>{
  return store.state.menu.isShouqi
})

//方法
const handleOpen = ()=>{

}

const handleClose = ()=>{
}
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-lg{
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>