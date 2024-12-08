<script setup lang="ts">
import { VTuberData } from './functions/buildVTubers';
import ExternalLink from '@/components/ExternalLink.vue';

const {
  vTuber: v,
  isOpenLinkNewTab,
  isFavoriteVTuberEditMode,
  isFavorite,
} = defineProps<{
  isOpenLinkNewTab: boolean;
  vTuber: VTuberData;
  isFavoriteVTuberEditMode: boolean;
  isFavorite: boolean;
}>();

const emit = defineEmits<{
  (event: 'changeIsFavorite', newIsFavorite: boolean): void;
}>();
const handleClick = () => {
  if (!isFavoriteVTuberEditMode) return;
  emit('changeIsFavorite', !isFavorite);
};

const character_bg_img = (key: string) => `background-image: url('img/${key}.webp');`;
</script>

<template>
  <div class="character-item" :class="[v.class]" @click="handleClick">
    <div :class="['character-circle', ...(isFavorite && isFavoriteVTuberEditMode ? ['favorite'] : [])]">
      <span class="holomem-name">{{ v.name }}</span>
      <span class="holomem-msg">{{ v.msg }}</span>
      <span class="holomem-msg2">{{ v.msg2 }}</span>
      <span class="holomem-msg0">{{ v.msg0 }}</span>
      <span class="holomem-twitter" @click="(e) => e.stopPropagation()">
        <ExternalLink :is-open-link-new-tab="isOpenLinkNewTab" :href="v.twitter"
          ><img src="../../assets/twitter1.webp" width="30px"
        /></ExternalLink>
      </span>
      <span class="holomem-youtube" @click="(e) => e.stopPropagation()">
        <ExternalLink :is-open-link-new-tab="isOpenLinkNewTab" :href="v.youtube"
          ><img src="../../assets/youtube.png" width="30px"
        /></ExternalLink>
      </span>
    </div>
    <div class="character-circle-white"></div>
    <div class="character-out"></div>
    <div class="character-bg" :style="character_bg_img(v.key)"></div>
  </div>
</template>

<style scoped lang="scss">
.holomem-name,
.holomem-msg,
.holomem-msg2,
.holomem-msg0 {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 30px;
  color: #000;
  text-shadow: /* 文字の影 */
    2px 2px 1px #fff,
    -2px 2px 1px #fff,
    2px -2px 1px #fff,
    -2px -2px 1px #fff,
    2px 0px 1px #fff,
    0px 2px 1px #fff,
    -2px 0px 1px #fff,
    0px -2px 1px #fff;
}
.holomem-name {
  bottom: 0;
  font-size: 22px;
  white-space: nowrap;
}
.holomem-msg {
  bottom: -20px;
  font-size: 15px;
}
.holomem-msg2 {
  /* bottom: -40px; */
  top: 0;
  right: -10px;
  font-size: 15px;
  transform: rotateZ(45deg);
}
.holomem-msg0 {
  top: -20px;
  font-size: 18px;
}
.holomem-twitter,
.holomem-youtube {
  position: absolute;
  left: -18px;
}
.holomem-twitter {
  top: 50px;
}
.holomem-youtube {
  top: 90px;
}

/*
.character-item:hover {
    transform:scale(1.5, 1.5);
    z-index: 1000;
}
 */

.character-item {
  margin: 10px 10px 30px 10px;
  position: relative;
  float: left;
}

/*
z-index: 青枠＞白枠＞枠外＞キャラ画像
*/

/* 丸枠(青)+キャラ説明(名前・何期生・デビュー日・リンクアイコン等) */
$circle_w: 180px;
$circle_h: 180px;
$border_size: 9px;
.character-circle {
  position: relative;
  /* background-size: 180px 180px;
    background-color: #fff;
    background-position: center center; */
  width: $circle_w;
  height: $circle_h;
  border-radius: 50%;
  border: $border_size solid rgba(1, 137, 179, 1);
  z-index: 30;
}
.favorite {
  border: $border_size solid rgb(240, 130, 170);
}

/* 丸枠(青)の外側の白枠 */
$border_white_size: 5px;
.character-circle-white {
  position: absolute;
  width: $circle_w;
  height: $circle_h;
  top: 0;
  margin-top: ($border_white_size * -1);
  margin-left: ($border_white_size * -1);
  border-radius: 50%;
  border: ($border_size + $border_white_size) solid rgb(255, 255, 255);
  z-index: 20;
}

/* 枠外 ホロメン画像が枠の外にはみ出てる分を隠す */
$border_out: 30px;
.character-out {
  position: absolute;
  width: $circle_w;
  height: $circle_h;
  top: 0;
  margin-top: ($border_out * -1);
  margin-left: ($border_out * -1);
  border-radius: 50%;
  border: ($border_size + $border_out) solid rgb(194, 238, 255);
  z-index: 10;
}

/* ホロメン画像 */
.character-bg {
  margin: 10px 10px 30px 10px;
  position: absolute;
  top: 0;
  width: $circle_w;
  height: $circle_h;
  background-size: $circle_w $circle_h;
  background-color: #fff;
  background-position: center center;
  animation: myrotate 0.8s;
  animation-iteration-count: infinite;
  z-index: 1;
}

@keyframes myrotate {
  0% {
    transform: rotateZ(0deg);
  }
  12.5% {
    transform: rotateZ(10deg);
  }
  25% {
    transform: rotateZ(20deg);
  }
  37.5% {
    transform: rotateZ(10deg);
  }
  50% {
    transform: rotateZ(0deg);
  }
  62.5% {
    transform: rotateZ(-10deg);
  }
  75% {
    transform: rotateZ(-20deg);
  }
  87.5% {
    transform: rotateZ(-10deg);
  }
}
</style>
