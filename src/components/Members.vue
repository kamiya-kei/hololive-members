<script setup lang="ts">

import { ref, defineModel, onMounted, watch } from 'vue'
import { companies, vTubers as vTubersData } from './constants'

const { openLinkMode } = defineProps<{
  openLinkMode: "_blank" | "_self"
}>()

const sortType = defineModel('sortType', {
  default: localStorage.getItem('sortType') || 'group',
})

const displayCompanies = defineModel('displayCompanies', {
  default: localStorage.getItem('displayCompanies')?.split(',') || companies,
});

type VTuberData = (typeof vTubersData[number]) & {
  msg: string
  msg2: string
  msg0: string
  class: string
}

const vTubers = ref<VTuberData[]>([])

const extraction_date = (s: string) => s.split('-').slice(1).join('/')

const sortGroup = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) =>({
    ...v,
    msg: ((s) => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(
      v.debut.split(' ')[0].split('-')
    ),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: (v.sort / 0.1) % 1 == 0 ? 'cb' : ''
  }));
  newVTubers.sort((a, b) => a.sort - b.sort);
  vTubers.value = newVTubers;
}
const sortDebut = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) =>({
    ...v,
    msg: ((s) => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(
      v.debut.split(' ')[0].split('-')
    ),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: ''
  }));
  newVTubers.sort((a, b) => new Date(a.debut).getTime() - new Date(b.debut).getTime())
  vTubers.value = newVTubers;

}
const sortDebutDate = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) =>({
    ...v,
    msg: ((s) => `${s[1]}月${s[2]}日デビュー`)(
      v.debut.split(' ')[0].split('-')
    ),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: ''
  }));
  newVTubers.sort(
    (a, b) =>
      new Date(extraction_date(a.debut)).getTime() - new Date(extraction_date(b.debut)).getTime()
  )
  vTubers.value = newVTubers;

}
const sortBirthday = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) =>({
    ...v,
    msg: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg2: '',
    msg0: v.group,
    class: '',
  }));
  newVTubers.sort((a, b) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime())
  vTubers.value = newVTubers;

}
const sortHeight = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) =>({
    ...v,
    msg: `${v.height}cm`,
    msg2: '',
    msg0: v.group,
    class: '',
  }));
  newVTubers.sort((a, b) => a.height - b.height)
  vTubers.value = newVTubers;

}

const sortVTubers = (sortType: string) => {
  switch (sortType) {
    case 'group':
      sortGroup()
      break
    case 'debut':
      sortDebut()
      break
    case 'debut_date':
      sortDebutDate()
      break
    case 'birthday':
      sortBirthday()
      break
    case 'height':
      sortHeight()
      break
    default:
      throw new Error('invalid sortType')
  }
}

onMounted(async () => {
  sortVTubers(sortType.value)
})

watch(sortType, (newSortType) => {
  sortVTubers(newSortType)
  localStorage.setItem('sortType', newSortType)
})

watch(displayCompanies, (newdisplayCompanies) => {
  localStorage.setItem('displayCompanies', newdisplayCompanies.join(','))
})

const character_bg_img = (key: string) =>
  `background-image: url('img/${key}.webp');`
</script>

<template>

  <h2>VTuber一覧</h2>
  <p>
    <label
      ><input type="radio" v-model="sortType" value="group" />グループ</label
    >
    <label
      ><input type="radio" v-model="sortType" value="debut" />デビュー順</label
    >
    <label
      ><input
        type="radio"
        v-model="sortType"
        value="debut_date"
      />デビュー日順</label
    >
    <label
      ><input
        type="radio"
        v-model="sortType"
        value="birthday"
      />誕生日順</label
    >
    <label
      ><input type="radio" v-model="sortType" value="height" />身長順</label
    >
  </p>
  <p>
    <label>
      <input type="checkbox" value="hololive" v-model="displayCompanies" />ホロメン
    </label>
    <label>
      <input type="checkbox" value="individual" v-model="displayCompanies" />個人勢
    </label>
    <label>
      <input type="checkbox" value="noripro" v-model="displayCompanies" />のりプロ
    </label>
  </p>
  <br />
  <div class="vTubers">
    <template v-for="m in vTubers">
      <div v-if="displayCompanies.includes(m.company)" class="character-item" :class="[m.class]">
        <div class="character-circle">
          <span class="holomem-name">{{ m.name }}</span>
          <span class="holomem-msg">{{ m.msg }}</span>
          <span class="holomem-msg2">{{ m.msg2 }}</span>
          <span class="holomem-msg0">{{ m.msg0 }}</span>
          <span class="holomem-twitter">
            <a
              :href="m.twitter"
              :target="openLinkMode"
              rel="noopener noreferrer"
              ><img src="../assets/twitter1.webp" width="30px"
            /></a>
          </span>
          <span class="holomem-youtube">
            <a
              :href="m.youtube"
              :target="openLinkMode"
              rel="noopener noreferrer"
              ><img src="../assets/youtube.png" width="30px"
            /></a>
          </span>
        </div>
        <div class="character-circle-white"></div>
        <div class="character-out"></div>
        <div class="character-bg" :style="character_bg_img(m.key)"></div>
      </div>
    </template>
  </div>
  <br class="cb" />
</template>

<style scoped></style>
