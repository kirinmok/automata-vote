# 大業實驗中學 Automata 作品票選展

七年級下學期 STEAM 課程作品展示與票選網頁。

## 快速上架步驟

### 第一次設定（只做一次）

**Step 1：建立 GitHub repository**
1. 登入 [github.com](https://github.com)
2. 右上角 `+` → `New repository`
3. Repository name 填：`automata-vote`
4. 選 `Public`
5. 點 `Create repository`

**Step 2：上傳這個資料夾**
```bash
# 在這個資料夾裡開終端機，執行以下指令：
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/你的帳號/automata-vote.git
git push -u origin main
```

**Step 3：開啟 GitHub Pages**
1. 進入 repository → `Settings`
2. 左側選單找 `Pages`
3. `Source` 選 `GitHub Actions`
4. 儲存

**Step 4：等待部署**
- 回到 repository 首頁，點 `Actions` 標籤
- 看到綠色勾勾代表部署成功
- 網址會是：`https://你的帳號.github.io/automata-vote/`

---

### 之後更新內容

直接推送就會自動重新部署：
```bash
git add .
git commit -m "更新說明"
git push
```

---

## 注意事項

- 作品資料存在**瀏覽器 localStorage**，換裝置會不見
- 正式展示活動建議使用同一台電腦
- 如果需要跨裝置共享資料，請另行串接 Google 試算表

## 本機開發

```bash
npm install
npm run dev
```
