# 广告设置指南

本文档说明如何为您的甘特图应用配置广告。

## 📍 广告位置

广告横幅位于 **Task Storage（工作卡片暂存区）下方**，不影响用户操作。

### 特性：
- ✅ 可关闭（用户可选择关闭）
- ✅ 智能显示（关闭后 24 小时内不再显示）
- ✅ 响应式设计
- ✅ 优雅的淡入淡出动画
- ✅ 与界面风格统一

---

## 🎯 推荐的广告平台

### 1. **Google AdSense** ⭐ 最推荐

**优点**：
- 全球最大的广告平台
- 收益稳定，支付可靠
- 自动匹配相关广告
- 支持多种广告格式

**申请条件**：
- 网站需要有原创内容
- 需要一定的流量（建议每天 100+ 访问量）
- 网站需要部署到公开域名
- 符合 Google 政策（无违规内容）

**申请流程**：
1. 访问 [Google AdSense](https://www.google.com/adsense/)
2. 使用 Google 账号登录
3. 填写网站信息和联系方式
4. 将提供的验证代码添加到网站
5. 等待审核（通常 1-2 周）
6. 审核通过后创建广告单元

---

### 2. **百度联盟**（适合中国大陆用户）

**优点**：
- 针对中文用户优化
- 收益较高（针对中国市场）
- 审核相对简单

**申请条件**：
- 网站需要 ICP 备案
- 每天 1000+ 独立访问量
- 网站运营 3 个月以上

**申请地址**：
- [百度联盟](https://union.baidu.com/)

---

### 3. **Carbon Ads**（适合开发者工具）

**优点**：
- 专注于技术类网站
- 广告质量高，不干扰用户
- 适合开发者和设计师受众

**申请条件**：
- 面向技术人员的网站
- 每月 10,000+ 页面浏览量

**申请地址**：
- [Carbon Ads](https://www.carbonads.net/)

---

## 🔧 配置步骤

### 使用 Google AdSense

#### 1. 获取广告代码

登录 AdSense 后台：
1. 进入「广告」→「按广告单元」→「展示广告」
2. 创建新广告单元，选择「横幅广告」
3. 尺寸选择「自适应」或「728 x 90」
4. 获取以下信息：
   - **客户端 ID**（形如：`ca-pub-1234567890123456`）
   - **广告位 ID**（形如：`1234567890`）

#### 2. 配置代码

**步骤 A：启用 AdSense 脚本**

编辑 `index.html`，取消注释并替换客户端 ID：

```html
<!-- 将这行 -->
<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
     crossorigin="anonymous"></script> -->

<!-- 改为（替换 xxxxxxxxxxxxxxxx 为你的实际 ID） -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

**步骤 B：配置广告位**

编辑 `src/components/gantt/StorageArea.tsx`，找到最后的 `<AdBanner />` 并添加参数：

```tsx
{/* 广告横幅 */}
<AdBanner 
  adClient="ca-pub-1234567890123456"  // 替换为你的客户端 ID
  adSlot="1234567890"                 // 替换为你的广告位 ID
/>
```

#### 3. 测试广告

1. 构建项目：`npm run build`
2. 部署到公开域名
3. 等待几分钟让 AdSense 识别
4. 刷新页面查看广告

**注意**：
- 本地开发环境（localhost）广告不会显示
- 需要部署到公开域名才能看到实际广告
- 测试期间可能显示空白广告

---

## 💡 其他广告平台配置

如果使用其他广告平台（如百度联盟），需要：

1. 获取广告代码（通常是一段 HTML）
2. 编辑 `src/components/common/AdBanner.tsx`
3. 在占位内容区域替换为你的广告代码：

```tsx
{adSlot ? (
  // 原有的 Google AdSense 代码
  ...
) : (
  // 替换这里为你的广告代码
  <div dangerouslySetInnerHTML={{ __html: '你的广告HTML代码' }} />
)}
```

---

## 🎨 自定义广告样式

编辑 `src/components/common/AdBanner.tsx` 可以调整：

- **高度**：修改 `minHeight: 90`
- **边距**：修改 `mt: 2, mx: 2, mb: 2`
- **圆角**：修改 `borderRadius: 3`
- **显示时间**：修改 `SHOW_AGAIN_DELAY`（默认 24 小时）

---

## 📊 收益优化建议

1. **内容质量**：保持应用的专业性和实用性
2. **流量增长**：通过 SEO、社交媒体推广增加访问量
3. **用户体验**：不要过度放置广告，保持良好体验
4. **广告位置**：当前位置已经过优化，不建议随意更改
5. **A/B 测试**：尝试不同的广告尺寸和样式

---

## 🔒 隐私政策

使用广告时，建议在网站添加隐私政策页面，说明：
- 使用了广告服务
- 可能使用 Cookie
- 用户数据的收集和使用方式

Google AdSense 要求网站有明确的隐私政策。

---

## ❓ 常见问题

### Q: 为什么本地看不到广告？
A: 广告平台要求网站部署在公开域名，localhost 无法显示广告。

### Q: 广告显示空白怎么办？
A: 
1. 检查客户端 ID 和广告位 ID 是否正确
2. 确认网站已部署到公开域名
3. 等待 10-30 分钟让广告系统识别
4. 检查浏览器控制台是否有错误

### Q: 关闭广告后如何再次显示？
A: 清除浏览器 localStorage 或等待 24 小时后自动重新显示。

### Q: 可以禁用广告吗？
A: 是的，只需在 `StorageArea.tsx` 中删除或注释掉 `<AdBanner />` 即可。

---

## 📧 需要帮助？

如有问题，请参考：
- [Google AdSense 帮助中心](https://support.google.com/adsense/)
- [AdSense 政策中心](https://support.google.com/adsense/answer/48182)

---

**祝你的应用获得良好收益！** 💰

