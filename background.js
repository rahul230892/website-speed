// Background service worker - minimal setup
chrome.runtime.onInstalled.addListener(() => {
  console.log('Website Speed Monitor installed successfully');
});