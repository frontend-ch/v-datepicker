<template>
  <div class="vd-container">
    <div class="vd-input-container">
      <i class="icon cal"></i>
      <input type="text" :placeholder=placeholder
         @click="showBox = !showBox"
        :value=selectedDate readonly />
      <i class="icon x vd-btn" v-show=!!selectedDate @click="selectedDate = ''"></i>
    </div>
    <transition name="fade">
      <div class="vd-date-box" v-show=showBox>
        <div class="vd-buttons">
          <div class="vd-left-buttons">
            <span class="vd-btn" @click="changeYear('reduce')">&laquo;</span>
            <span class="vd-btn" @click="changeMonth('reduce')">&lt;</span>
          </div>
          <div class="vd-center-buttons">
            <span>{{year}}</span>年
            <span>{{month + 1}}</span>月
          </div>
          <div class="vd-left-buttons">
            <span class="vd-btn" @click="changeMonth('add')">&gt;</span>
            <span class="vd-btn" @click="changeYear('add')">&raquo;</span>
          </div>
        </div>
        <div class="vd-content">
          <table class="vd-date-table">
            <tr class="week-list">
                <th v-for="item in week">{{item}}</th>
            </tr>
            <tr v-for="(item, index) in displayDays">
              <td v-for="(i, n) in item"
                @click="selectDate(i, index, n)"
                :class="{gray: notThisMonth(i, index, n, displayDays.length),
                          active: i == day && !notThisMonth(i, index, n, displayDays.length)}">{{i}}</td>
            </tr>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { week, monthDays } from './param'
import { generateOrderArr, subArray, fullZero } from './../utils'

export default {
  name: 'dateComponent',
  data() {
    return {
      week,
      monthDays,
      showBox: false,
      now: new Date(),
      year: 0,
      month: 0,
      day: 0,
      selectedDate: '',
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '请选择日期',
    },
    value: {
      type: String,
      default: '',
    },
    spliter: {
      type: String,
      default: '-',
    }
  },
  computed: {
    date() {
      if (this.year == 0 || this.month < 0 || this.day == 0) {
        return ''
      }
      return `${this.year}${this.spliter}${fullZero(Number(this.month) + 1)}${this.spliter}${fullZero(Number(this.day))}`
    },
    displayDays() { // 生成table中显示的日期
      const { countMonthDays, year, month, date } = this
      const selectedDate = new Date(date)
      selectedDate.setDate(1)
      const firstWeekDay = selectedDate.getDay()
      selectedDate.setDate(countMonthDays(year, month))
      const lastWeekDay = selectedDate.getDay()
      let lastMonth, nextMonth, lastMonthYear, nextMonthYear
      if (month <= 0) {
        lastMonthYear = year - 1
        nextMonthYear = year
        lastMonth = 11
        nextMonth = month + 1
      } else if (month >= 11) {
        nextMonthYear = year + 1
        lastMonthYear = year
        nextMonth = 0
        lastMonth = month - 1
      } else {
        lastMonth = month - 1
        nextMonth = month + 1
        lastMonthYear = nextMonthYear = year
      }
      const lastMonthDays = generateOrderArr(
        countMonthDays(lastMonthYear, lastMonth) - firstWeekDay + 1, countMonthDays(lastMonthYear, lastMonth)
      )
      const nextMonthDays = generateOrderArr(1, 6 - lastWeekDay)
      return subArray(lastMonthDays.concat(generateOrderArr(1, countMonthDays(year, month))).concat(nextMonthDays), 7)
    },
  },
  mounted() {
    this.setMountedDate()
  },
  methods: {
    setMountedDate() { // 设置初始值
      if (!this.value) { // 没有传入初始值则设置当前日期
        this.year = this.now.getFullYear()
        this.month = this.now.getMonth()
        this.day = this.now.getDate()
      } else {
        this.year = this.value.split(this.spliter)[0]
        this.month = Number(this.value.split(this.spliter)[1]) - 1
        this.day = this.value.split(this.spliter)[2]
        this.selectedDate = this.date
      }
    },
    isLeapYear (year) { // 判断是否为闰年
        return (year % 100 == 0 ? (year % 400 == 0 ? true : false) : (year % 4 == 0 ? true : false))
    },
    countMonthDays(year, month) { // 计算当年当月的天数
      const { monthDays } = this
      if (this.isLeapYear(year)) {
        monthDays[1] = 29
      } else {
        monthDays[1] = 28
      }
      return monthDays[month]
    },
    changeYear(type) { // 切换年份
      if (type == 'add') {
        if (this.year <= 1970) return
        this.year ++
      }
      if (type == 'reduce') {
        if (this.year >= 2999) return
        this.year --
      }
    },
    changeMonth(type) { // 切换月份
      if (type == 'add') {
        if (this.month >= 11) {
          this.year ++
          this.month = 0
          return
        }
        this.month ++
      }
      if (type == 'reduce') {
        if (this.month <= 0) {
          this.year --
          this.month = 11
          return
        }
        this.month --
      }
    },
    notThisMonth(i, index, n, length) { // 判断所选日期是否在当月
      return index == 0 && i > n + 20 || index == length - 1 && i <= n
    },
    selectDate(i, index, n) { // 选择日期
      this.day = i
      if (this.notThisMonth(i, index, n, this.displayDays.length)) {
        this.changeMonth(i > 20 ? 'reduce' : 'add')
      }
      this.selectedDate = this.date
      this.showBox = false
      this.$emit('input', this.selectedDate)
    },
  },
}
</script>

<style lang="scss" scoped>
  .vd-container {
    position: relative;
    max-width: 300px;
  }
  .vd-input-container {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 10px 5px 25px;
    border: 1px solid #ccc;
    border-radius: 3px;
    input {
      box-sizing: border-box;
      width: 100%;
      outline: none;
      border: none;
      cursor: default;
    }
    .icon.cal {
      position: absolute;
      left: 5px;
      top: 10px;
      background-image: url('./../assets/calender.svg');
    }
    .icon.x {
      position: absolute;
      right: 5px;
      top: 10px;
      background-image: url('../assets/x.svg');
    }
  }
  .vd-date-box {
    width: 100%;
    position: absolute;
    left: 0;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .vd-buttons {
      display: flex;
      justify-content: space-between;
    }
    .vd-content {
      padding: 10px 0;
      .vd-date-table {
        width: 100%;
      }
      td, th {
        font-weight: normal;
        text-align: center;
        padding: 4px;
        border-radius: 50%;
      }
      td {
        cursor: pointer;
      }
      td.gray {
        color: #ddd;
      }
      td.active {
        color: #fff;
        background-color: #1d4370;
      }
    }
  }
</style>
