<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="store.commit('shouqiCaidan')"><Fold /></el-icon>
            <ul class="flex-box">
                <li v-for="(item,index) in selectMenu" 
                :key="item.path"
                :class="{'selected': route.path === item.path}"
                class="tab flex-box">
                    <el-icon  size="12">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <router-link class="text flex-box" :to="item.path">{{ item.name }}</router-link>
                    <el-icon class="close" size="12" @click="closeTab(item,index)">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown>
                <div class="el-dropdown-link flex-box">
                    <el-avatar
                         src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bc.png"
                     />
                     <p class="user-name">世界第一大美女</p>     
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                        <el-dropdown-item>Action 3</el-dropdown-item>
                        <el-dropdown-item disabled>Action 4</el-dropdown-item>
                        <el-dropdown-item divided>Action 5</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex'
import { useRoute,useRouter } from 'vue-router';

const store = useStore()
const route = useRoute()
const router = useRouter()
const selectMenu = computed(()=>{
    return store.state.menu.selectMenu
})

//点击关闭头部单独的小导航
const closeTab = (item,index)=>{
    store.commit('closeMenu',item)
    //判断被关闭的标签页是否是当前正在浏览的页面（通过比较路径）
    //如果不是当前页，那么说明只是关闭了别的标签页，不需要跳转页面，所以直接 return。
    if(item.path !== route.path){
        return
    }
    //判断是否关闭最后一项
    const selectMenuData = selectMenu.value
    if(index === selectMenuData.length-1){
        //如果当前只剩一个标签页（关闭后 selectMenuData 就为空了），跳转到 / 根路径
        if(!selectMenuData.length){
            router.push('/')
        }else{
            //否则前进一位
            router.push(selectMenuData[index-1].path)
        }
    }else{
        //如果被关闭的是中间的某一项（不是最后一项），则跳转到它后面的标签页。
        router.push(selectMenuData[index].path)
    }
}
</script>

<style lang="less" scoped>
.flex-box{
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .icon{
            width: 45px;
            height: 100%;
        }
        .icon:hover{
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab{
            padding: 0 10px;
            height: 100%;
            .text{
                margin: 0 5px;
            }
            .close{
                visibility: hidden;
                cursor: pointer;
                color: #000;
            }
            &.selected{
                a{
                    color:#409eff;
                }
                i{
                    color: #409eff;
                }
                background-color: #f5f5f5;
            }
        }
        .tab:hover{
            background-color: #f5f5f5;
            .close{
                visibility: inherit;
            }
        }
    }
    .header-right{
        .user-name{
           margin-left: 10px; 
        }
    }
    a{
        height: 100%;
        color:#333;
        font-size: 15px;
    }
    
}
</style>