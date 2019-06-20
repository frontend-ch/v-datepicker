<template>
  <dateComponent v-model=value />
</template>

<script>
import dateComponent from './component/dateComponent'

export default {
  name: 'app',
  components: {
    dateComponent,
  },
  data() {
    return {
      value: '',
    }
  },
  watch: {
    value(nv) {
      console.log(nv)
    },
  },
}
</script>
