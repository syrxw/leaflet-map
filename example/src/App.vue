<template>
  <el-config-provider :locale="zhCn" :button="{ autoInsertSpace: true }">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { computed } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
</script>
