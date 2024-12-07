<script setup lang="ts">
import { ref, defineModel, onMounted, watch } from 'vue'
import { vTubers as vTubersData } from './constants'
import {
  loadSortTypeConfig,
  TSortType,
  updateSortTypeConfig,
  sortTypes,
  sortTypeTexts,
  loadCompanyConfig,
  TCompany,
  updateCompanyConfig,
  companyTexts,
  companies,
} from './functions/storages'

const { openLinkMode } = defineProps<{
  openLinkMode: '_blank' | '_self'
}>()

const sortType = defineModel<TSortType>('sortType', {
  default: loadSortTypeConfig(),
})

const displayCompanies = defineModel<TCompany[]>('displayCompanies', {
  default: loadCompanyConfig(),
})

type VTuberData = (typeof vTubersData)[number] & {
  msg: string
  msg2: string
  msg0: string
  class: string
}

const vTubers = ref<VTuberData[]>([])

const extraction_date = (s: string) => s.split('-').slice(1).join('/')

const sortGroup = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(
      v.debut.split(' ')[0].split('-')
    ),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: (v.sort / 0.1) % 1 == 0 ? 'cb' : '',
  }))
  newVTubers.sort((a, b) => a.sort - b.sort)
  vTubers.value = newVTubers
}
const sortDebut = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(
      v.debut.split(' ')[0].split('-')
    ),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: '',
  }))
  newVTubers.sort(
    (a, b) => new Date(a.debut).getTime() - new Date(b.debut).getTime()
  )
  vTubers.value = newVTubers
}
const sortDebutDate = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `${s[1]}月${s[2]}日デビュー`)(
      v.debut.split(' ')[0].split('-')
    ),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: '',
  }))
  newVTubers.sort(
    (a, b) =>
      new Date(extraction_date(a.debut)).getTime() -
      new Date(extraction_date(b.debut)).getTime()
  )
  vTubers.value = newVTubers
}
const sortBirthday = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg2: '',
    msg0: v.group,
    class: '',
  }))
  newVTubers.sort(
    (a, b) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime()
  )
  vTubers.value = newVTubers
}
const sortHeight = () => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: `${v.height}cm`,
    msg2: '',
    msg0: v.group,
    class: '',
  }))
  newVTubers.sort((a, b) => a.height - b.height)
  vTubers.value = newVTubers
}

const sortVTubers = (sortType: TSortType) => {
  switch (sortType) {
    case 'group':
      sortGroup()
      break
    case 'debut':
      sortDebut()
      break
    case 'debutDate':
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
  updateSortTypeConfig(newSortType)
})

watch(displayCompanies, (newDisplayCompanies) => {
  updateCompanyConfig(newDisplayCompanies)
})

const character_bg_img = (key: string) =>
  `background-image: url('img/${key}.webp');`
</script>

<template>
  <h2>VTuber一覧</h2>
  <p class="config">
    <template v-for="sortTypeValue in sortTypes" :key="sortTypeValue">
      <label class="">
        <input type="radio" v-model="sortType" :value="sortTypeValue" />
        {{ sortTypeTexts[sortTypeValue] }}
      </label>
    </template>
  </p>
  <p class="config">
    <template v-for="company in companies" :key="company">
      <label>
        <input type="checkbox" v-model="displayCompanies" :value="company" />
        {{ companyTexts[company] }}
      </label>
    </template>
  </p>
  <br />
  <div class="vTubers">
    <template v-for="m in vTubers" :key="m.key">
      <div
        v-if="displayCompanies.includes(m.company)"
        class="character-item"
        :class="[m.class]"
      >
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

<style scoped>
.config {
  display: flex;
  gap: 12px;
}
</style>
