# 🚀 Website Speed Monitor - Chrome Extension

A powerful Chrome extension that helps you diagnose whether slow website loading is caused by your internet connection or the website's server in real-time.



## 📸 Screenshots

![alt text](<Screenshot 2026-01-07 at 3.41.17 PM.png>)

## ✨ Features

- **🎯 Real-Time Performance Monitoring** - Instant analysis of website loading speed
- **🔍 Smart Diagnostics** - Automatically identifies if the issue is your connection or the server
- **📊 Detailed Metrics** - Shows DNS lookup, server response time (TTFB), download time, and total load time
- **🎨 Beautiful UI** - Modern glassmorphic design with color-coded status indicators
- **⚡ Quick Refresh** - Refresh button on top and bottom for easy re-analysis
- **💡 Clear Explanations** - Tells you exactly what's causing the slowdown

## 🎯 What Problem Does It Solve?

Ever encountered a website that keeps loading forever? You check your internet speed - it's perfect. But the site still won't load. Is it you or them?

**This extension answers that question instantly!**

### Key Metrics Explained:

| Metric | What It Means | Problem Indicator |
|--------|---------------|-------------------|
| **DNS Lookup** | Time to resolve domain name | >150ms = Connection issue |
| **Server Response (TTFB)** | Time for server to respond | >600ms = Server problem |
| **Content Download** | Time to download page content | >500ms = Bandwidth issue |
| **Total Load Time** | Complete page load time | >3000ms = Overall slowness |

## 🚀 Installation

### Method 1: Install from Chrome Web Store
*Extension will be published to Chrome Web Store soon*

### Method 2: Install Manually (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/website-speed-monitor.git
   cd website-speed-monitor
   ```

2. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `website-speed` folder
   - The extension icon should appear in your toolbar!

## 📖 How to Use

1. **Navigate to any website** you want to analyze
2. **Wait for the page to fully load** (important!)
3. **Click the extension icon** in your Chrome toolbar
4. **View the real-time metrics** and diagnosis
5. **Click the refresh icon** (🔄) to re-analyze anytime
6. **Keyboard Shortcut**: Consider assigning a custom keyboard shortcut via `chrome://extensions/shortcuts` for faster access.

### Understanding the Results

#### 🟢 Green Status - Everything is Good
- Fast loading times
- No bottlenecks detected

#### 🟡 Yellow Status - Moderate Issues
- Some delays present
- Acceptable performance

#### 🔴 Red Status - Problem Detected
The extension will tell you if it's:
- **Server Problem**: High TTFB (>600ms) = Server is slow or overloaded
- **Connection Problem**: High DNS + Download time = Your internet connection
- **Bandwidth Issue**: Slow download with large content = Connection speed limiting

## 🛠️ Technical Details

### Files Structure
```
website-speed-monitor/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Main logic and performance analysis
├── background.js         # Background service worker
├── icons/icon16.png      # 16x16 icon
├── icons/icon48.png      # 48x48 icon
├── icons/icon128.png     # 128x128 icon
├── icon-generator.html  # Tool to generate icons
└── README.md            # This file
```

### Technologies Used
- **Manifest V3** - Latest Chrome extension standard
- **Performance API** - Browser's native performance monitoring
- **HTML5 Canvas** - For icon generation
- **Vanilla JavaScript** - No dependencies required

### Permissions Required
- `activeTab` - To analyze the current tab's performance
- `scripting` - To inject performance analysis script
- `<all_urls>` - To work on any website

## 🔧 Customization

You can modify the performance thresholds in `popup.js`:

```javascript
// DNS Thresholds
if (data.dnsTime < 50) {
  // Excellent
} else if (data.dnsTime < 150) {
  // Fair
} else {
  // Slow
}

// TTFB Thresholds
if (data.ttfb < 200) {
  // Fast Server
} else if (data.ttfb < 600) {
  // Moderate
} else {
  // Slow Server
}
```

Adjust these values based on your needs!

## ⚠️ Troubleshooting

### "Unable to analyze this page" Error
- **Solution**: Refresh the page first, then click the extension icon
- The page must be fully loaded at least once for performance data to exist

### No Data Showing / Stuck on Loading
- **Solution**: Make sure the page has completely loaded
- Click the "Try Again" button or refresh icon
- Some pages (chrome://, edge://, extension pages) cannot be analyzed

### Extension Not Working on Certain Sites
- Browser internal pages (chrome://, about:) are restricted
- Some sites with strict CSP policies may limit analysis

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contribution
- [ ] Add historical performance tracking
- [ ] Export performance reports
- [ ] Compare multiple websites
- [ ] Add notifications for slow sites
- [ ] Support for Firefox/Edge
- [ ] Dark/Light theme toggle

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need to quickly diagnose website loading issues
- Built with Chrome's powerful Performance API
- Icon design inspired by modern speedometer dashboards

## 📧 Contact

Project Link: https://github.com/rahul230892/website-speed

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you diagnose slow websites!

## 📊 Stats

https://github.com/rahul230892/website-speed
---

**Made with ❤️ for developers who hate slow websites**