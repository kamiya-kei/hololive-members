<script setup lang="ts">
// @ts-nocheck

import { ref, defineModel, computed, onMounted, watch } from "vue";
import { members as membersData, others as othersData} from './constants'

const sort_type = defineModel('sort_type', {
  default: localStorage.getItem("sort_type") || "group",
});
const is_open_link_new_tab = defineModel('is_open_link_new_tab', {
  default: localStorage.getItem("is_open_link_new_tab") === "1",
});
const open_link_mode = computed(() =>
  is_open_link_new_tab.value ? "_blank" : "_self"
);

type VTuberData = typeof membersData[0] & {
    msg: string;
    msg2: string;
    msg0: string;
    class: string;
}

const members = ref<VTuberData[]>([]);
const others = ref<VTuberData[]>([]);

const extraction_date = (s: string) => s.split('-').slice(1).join('/');

const sortGroup = () => {
    const newMembersData = [...membersData];
    const newOthersData = [...othersData];
    newMembersData.sort((a,b) => a.sort - b.sort);
    [...newOthersData, ...newOthersData].forEach(m => {
        m.msg = (s => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(m.debut.split(' ')[0].split('-'));
        m.msg2 = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
        m.msg0 = m.group;
        m.class = (m.sort/0.1) % 1 == 0 ? 'cb' : '';
    });
    members.value = newMembersData;
    others.value = newOthersData;
}
const sortDebut = () => {
    const newMembersData = [...membersData];
    const newOthersData = [...othersData];
    newMembersData.sort((a,b) => new Date(a.debut) - new Date(b.debut));
    [...newMembersData, ...newOthersData].forEach(m => {
        m.msg = (s => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(m.debut.split(' ')[0].split('-'));
        m.msg2 = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
        m.msg0 = m.group;
        m.class = '';
    });
}
const sortDebutDate = () => {
    const newMembersData = [...membersData];
    const newOthersData = [...othersData];
    newMembersData.sort((a,b) => new Date(extraction_date(a.debut)) - new Date(extraction_date(b.debut)));
    [...newMembersData, ...newOthersData].forEach(m => {
        m.msg = (s => `${s[1]}月${s[2]}日デビュー`)(m.debut.split(' ')[0].split('-'));
        m.msg2 = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
        m.msg0 = m.group;
        m.class = '';
    });
}
const sortBirthday = () => {
    const newMembersData = [...membersData];
    const newOthersData = [...othersData];
    newMembersData.sort((a,b) => new Date(a.birthday) - new Date(b.birthday));
    [...newMembersData, ...newOthersData].forEach(m => {
        m.msg = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
        m.msg2 = '';
        m.msg0 = m.group;
        m.class = '';
    });
}
const sortHeight = () => {
    const newMembersData = [...membersData];
    const newOthersData = [...othersData];
    newMembersData.sort((a,b) => a.height - b.height);
    [...newMembersData, ...newOthersData].forEach(m => {
        m.msg = `${m.height}cm`;
        m.msg2 = '';
        m.msg0 = m.group;
        m.class = '';
    });
}

const sortMembers = (sortType: string) => {
    switch(sortType) {
        case 'group':
            sortGroup();
            break;
        case 'debut':
            sortDebut();
            break;
        case 'debut_date':
            sortDebutDate();
            break;
        case 'birthday':
            sortBirthday();
            break;
        case 'height':
            sortHeight();
            break;
        default:
            throw new Error('invalid sortType');
    }
};

onMounted(async () => {
    sortMembers(sort_type.value);
});

watch(sort_type, (newSortType) => {
    sortMembers(newSortType);
    localStorage.setItem('sort_type', newSortType);
});

watch(is_open_link_new_tab, (newIsOpenLinkNewTab) => {
    localStorage.setItem('is_open_link_new_tab', newIsOpenLinkNewTab ? '1' : '0');
});


const character_bg_img= (key: string) =>  `background-image: url('img/${key}.webp');`;

</script>

<template>
  <h2>Links</h2>
  <p>
    ホロライブ公式
    <a
      href="https://twitter.com/hololivetv"
      :target="open_link_mode"
      rel="noopener noreferrer"
    >
      <img src="../assets/twitter1.webp" width="20px" />
    </a>
    <a
      href="https://www.youtube.com/channel/UCJFZiqLMntJufDCHc6bQixg"
      :target="open_link_mode"
      rel="noopener noreferrer"
    >
      <img src="../assets/youtube.png" width="20px" />
    </a>
    ：
    <a
      href="https://www.hololive.tv/"
      :target="open_link_mode"
      rel="noopener noreferrer"
      >Offical HP</a
    >
    ／
    <a
      href="https://schedule.hololive.tv/lives/hololive"
      :target="open_link_mode"
      rel="noopener noreferrer"
      >配信予定スケジュール</a
    >
    ／
    <a
      href="https://ch.nicovideo.jp/hololive"
      :target="open_link_mode"
      rel="noopener noreferrer"
      >ホロライブ公式ファンクラブ</a
    >
  </p>
  <h2>個人勢・他箱VTuber</h2>
  <div class="members" style="background-color: red">
    <div v-for="m in others" class="character-item" :class="[m.class]">
      <div class="character-circle">
        <span class="holomem-name">{{ m.name }}</span>
        <span class="holomem-msg">{{ m.msg }}</span>
        <span class="holomem-msg2">{{ m.msg2 }}</span>
        <span class="holomem-msg0">{{ m.msg0 }}</span>
        <span class="holomem-twitter">
          <a
            :href="m.twitter"
            :target="open_link_mode"
            rel="noopener noreferrer"
            ><img src="../assets/twitter1.webp" width="30px"
          /></a>
        </span>
        <span class="holomem-youtube">
          <a
            :href="m.youtube"
            :target="open_link_mode"
            rel="noopener noreferrer"
            ><img src="../assets/youtube.png" width="30px"
          /></a>
        </span>
      </div>
      <div class="character-circle-white"></div>
      <div class="character-out"></div>
      <div class="character-bg" :style="character_bg_img(m.key)"></div>
    </div>
  </div>
  <br class="cb" />
  <h2>ホロメン一覧</h2>
  <p>
    <label
      ><input type="radio" v-model="sort_type" value="group" />グループ</label
    >
    <label
      ><input type="radio" v-model="sort_type" value="debut" />デビュー順</label
    >
    <label
      ><input
        type="radio"
        v-model="sort_type"
        value="debut_date"
      />デビュー日順</label
    >
    <label
      ><input
        type="radio"
        v-model="sort_type"
        value="birthday"
      />誕生日順</label
    >
    <label
      ><input type="radio" v-model="sort_type" value="height" />身長順</label
    >
  </p>
  <p>
    <label
      ><input
        type="checkbox"
        v-model="is_open_link_new_tab"
        value="_blank"
      />リンクを新しいタブで開く</label
    >
  </p>
  <br />
  <div class="members">
    <div v-for="m in members" class="character-item" :class="[m.class]">
      <div class="character-circle">
        <span class="holomem-name">{{ m.name }}</span>
        <span class="holomem-msg">{{ m.msg }}</span>
        <span class="holomem-msg2">{{ m.msg2 }}</span>
        <span class="holomem-msg0">{{ m.msg0 }}</span>
        <span class="holomem-twitter">
          <a
            :href="m.twitter"
            :target="open_link_mode"
            rel="noopener noreferrer"
            ><img src="../assets/twitter1.webp" width="30px"
          /></a>
        </span>
        <span class="holomem-youtube">
          <a
            :href="m.youtube"
            :target="open_link_mode"
            rel="noopener noreferrer"
            ><img src="../assets/youtube.png" width="30px"
          /></a>
        </span>
      </div>
      <div class="character-circle-white"></div>
      <div class="character-out"></div>
      <div class="character-bg" :style="character_bg_img(m.key)"></div>
    </div>
  </div>
  <br class="cb" />
</template>

<style scoped></style>
