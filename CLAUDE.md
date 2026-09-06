# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code への指示書です。

## プロジェクト概要

ホロライブメンバー + α（個人勢・にじさんじ・ぶいすぽ等）の VTuber リンク集を表示する 1 ページの静的サイト。
丸いアイコンでメンバーを並べ、ソート順・所属フィルタ・「推し」設定をブラウザ側（localStorage）で切り替える。

- リポジトリ: https://github.com/kamiya-kei/hololive-members
- 表示言語・コメント・コミットメッセージはすべて日本語

## コマンド

```bash
yarn dev          # 開発サーバー（server.bat も中身は yarn dev）
yarn build        # vue-tsc で型チェック + vite build
yarn preview      # ビルド結果のプレビュー
yarn lint         # eslint src
yarn lint:fix     # eslint --fix
yarn format       # prettier --check
yarn format:fix   # prettier --write
```

- パッケージマネージャは **yarn 固定**（`npm` は package.json の engines で拒否）。Node は volta で 22.20.0。
- テストは無い。変更後は `yarn build`（型チェック込み）と `yarn lint` で確認する。

## Git の扱い

- **明示的な指示が無い限り `git add` / `git commit` はしない。** 変更は作業ツリーに置いたままにして、コミットするかどうかはユーザーが判断する。「コミットして」と言われたときだけ実行する。
- `git push` や履歴を書き換える操作（reset / rebase / amend など）も同様に、指示があったときだけ行う。
- コミットメッセージは日本語で `feat: 〇〇を追加` / `fix: 〇〇を修正` / `chore: 〇〇` の形式。

## 技術スタック

Vue 3（`<script setup lang="ts">`）/ TypeScript(strict) / Vite 6 / Pinia / SCSS(sass-embedded)。
`@/*` は `src/*` のエイリアス（vite.config.ts と tsconfig.app.json の両方で定義済み）。

## 構成

```
index.html
public/
  favicon.png
  img/<key>.webp        # メンバー画像。ファイル名 = VTuber の key
src/
  main.ts               # createApp + Pinia
  main.scss             # 背景・.whiteBox・.cb などのグローバル
  App.vue               # TopPage を出すだけ
  functions/storages.ts # localStorage の薄いラッパ
  components/
    TopPage/
      TopPage.vue           # 見出し・公式リンク・VTuberList
      VTuberList.vue        # 設定 UI（ソート/所属/推し）と一覧のループ
      VTuberCircle.vue      # 丸アイコン 1 個分。SCSS のレイアウトもここ
      constants.ts          # ★VTuber の全データ（TVtuber[]）
      functions/buildVTubers.ts    # ソート種別ごとの並べ替え + 表示文言の生成
      functions/vTubersConfigs.ts  # ソート種別・所属・推しの定義と localStorage 入出力
    common/ExternalLink/
      ExternalLink.vue      # 新しいタブ設定を反映する <a>
      LinkConfigs.vue       # リンク関連の設定 UI
      functions/externalLinkConfigs.ts
      stores/useIsOpenLinkNewTabConfig.ts  # Pinia（localStorage と同期）
      stores/useIsXSubAccount.ts           # Pinia（保存しない一時状態）
```

`cap/`（作業用スクショ素材）、`tmp/`、`*.bat` は gitignore 済み。README.md は Vite テンプレのままで内容は無い。

## データの持ち方

- 全メンバーは `src/components/TopPage/constants.ts` の `vTubers: TVtuber[]` に直書き。DB や API は無い。
- `TVtuber` はテンプレートリテラル型で URL や日付の形を縛っている（`https://x.com/${string}`、`20YY-MM-DD` 等）。型を緩めずに合わせること。
- 表示用の文言（`msg` / `msg2` / `msg0`）は `buildVTubers.ts` がソート種別ごとに生成する。constants 側には持たせない。
- 設定値は Pinia ではなく、原則 `vTubersConfigs.ts` / `externalLinkConfigs.ts` の `load*Config` / `update*Config` 経由で localStorage に読み書きする。複数コンポーネントで共有が要る場合だけ Pinia store を作る。

## VTuber を追加・編集するとき

1. **元画像を集める**: 公式サイト・公式 X などから、そのキャラクターの公式イラストで**なるべく正面を向いているもの**を探してダウンロードし、作業用の `cap/` ディレクトリに入れる（`cap/` は gitignore 済みでコミットされない）。
2. **画像を加工する**: 元画像を **胸元（乳首あたり）の高さから上**でトリミングし、**縦横 1:1** になるように調整してから `public/img/<key>.webp` に保存する。180px の円に `background-size: 180px 180px` で敷かれるので、正方形かつ顔が中央に来るようにする。
3. **情報を調べる**: 名前・デビュー日・誕生日・身長・所属ユニット/期生・X アカウント・YouTube チャンネル・イラストレーターなどを、**公式 HP と非公式 wiki**から調べて裏を取る。
4. `constants.ts` の配列に、同じ `company` のメンバーの近くへ 1 件追加する。
5. `sort` を決める（下記）。`key` は英小文字とアンダースコアのローマ字で、`public/img/<key>.webp` のファイル名と一致させる。
6. `debuts` は古い順。`illustrator` は分かる場合のみ。`other` は補足（身長の注釈など）。
7. コミットはユーザーの指示があったときだけ行う（→「Git の扱い」）。その場合は `feat: 〇〇を追加` の形式で、画像 + constants.ts の 2 ファイルをまとめる。

### sort の規則

`sort` は表示順であると同時に**行の折り返し**を決める。`buildVTubers.ts` の
`forceClearBoth: (v.sort / 0.1) % 1 == 0` により、**小数第 2 位が 0 の値（x.0 / x.5）が新しい行の先頭**になり、
`x.01`〜`x.0n` がその行に続く（グループ表示のときのみ有効）。

現在の割り当て:

| 範囲 | 内容 |
| --- | --- |
| `100.x` 〜 `108.x` | ホロライブ。整数部が 0 期生〜6 期生・ReGLOSS 等の期別、`102.5x` のように .5 で行を分けている箇所もある |
| `0.x` 〜 `3.x` | 個人勢・他事務所。整数部は「所属」ではなく単なる行のまとまり |

所属（`company`）の選択肢と表示名は `vTubersConfigs.ts` の `companies` / `companyTexts` にある。新しい事務所を足す場合はここにも追加する。

## コーディング規約

- Prettier: printWidth 120 / シングルクォート / セミコロンあり / tabWidth 2 / trailingComma es5。ESLint は vue + typescript-eslint の recommended に prettier 併用、`unused-imports/no-unused-imports` は error。
- コンポーネントは `<script setup lang="ts">`。props は `defineProps<{...}>()` の型引数で、emit は `defineEmits<{ (event: '...', ...): void }>()` で定義する。
- スタイルは `<style scoped>`（SCSS が要るときだけ `lang="scss"`）。共通クラス（`.whiteBox` / `.cb`）は `main.scss`。
- 外部リンクは生の `<a>` ではなく `ExternalLink` を使う（新しいタブ設定と `rel="noopener noreferrer"` が入る）。
- import は同一機能内は相対パス、`src` をまたぐときは `@/` を使う（既存コードの流儀に合わせる）。
- コード内のコメントは日本語。
