<template>
  <div class="main">
  <keep-alive :include="includedComponents">
    <router-view v-if="keepAlive" />
  </keep-alive>
  <router-view v-if="!keepAlive" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import { CACHE_INCLUDED_ROUTES } from "@/store/mutation-types"

  export default {
    name: "RouteView",
    computed: {

      includedComponents() {
        const includedRouters = Vue.ls.get(CACHE_INCLUDED_ROUTES)
        console.log("includedRouters：" + includedRouters)

        //If the route is a cache route, the route is added to cache_included_routes
        if (this.$route.meta.keepAlive && this.$route.meta.componentName) {
          let cacheRouterArray = Vue.ls.get(CACHE_INCLUDED_ROUTES) || []
          if(!cacheRouterArray.includes(this.$route.meta.componentName)){
            cacheRouterArray.push(this.$route.meta.componentName)
            // cacheRouterArray.push("OnlCgformHeadList")
            console.log("Vue ls set componentName ：" + this.$route.meta.componentName)
            Vue.ls.set(CACHE_INCLUDED_ROUTES, cacheRouterArray)
            console.log("Vue ls includedRouterArrays ：" + Vue.ls.get(CACHE_INCLUDED_ROUTES))
            return cacheRouterArray;
          }
        }
        return includedRouters;
      },

      keepAlive () {
        return this.$route.meta.keepAlive
      }
    },
  }
</script>