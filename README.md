# v-datepicker

> 一个基于VueJS的日期选择器组件

## 引入项目

``` bash
npm install v-datepicker
```

## 在VueJS项目中引用

``` javascript
import datepicker from 'v-datepicker'

// 在Vue实例中家在组建
Vue.component('datepicker', datepicker)

// 在Vue组件中加载组件
components: {
  datepicker,
},
data: {
  return {
    date: null,
  }
}

```

## 使用
``` javascript
<datepicker
  v-model="date"
  value="2019-06-20"
  spliter="-"
  placeholder="请选择日期" />
```
