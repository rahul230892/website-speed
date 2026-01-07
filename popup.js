function analyzePerformance() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) {
      showError('No active tab found');
      return;
    }

    const tab = tabs[0];
    
    // Check if it's a valid URL
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || 
        tab.url.startsWith('about:') || tab.url.startsWith('chrome-extension://')) {
      showError('Cannot analyze browser internal pages');
      return;
    }
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getPerformanceData
    }).then((results) => {
      if (results && results[0] && results[0].result) {
        displayMetrics(results[0].result);
      } else {
        showError('No performance data available. Try refreshing the page first.');
      }
    }).catch((error) => {
      console.error('Script execution error:', error);
      showError('Please refresh the page and try again.');
    });
  });
}

function getPerformanceData() {
  try {
    const perf = performance.getEntriesByType('navigation')[0];
    
    if (!perf) {
      // Fallback to performance.timing for older browsers
      const timing = performance.timing;
      if (!timing || timing.loadEventEnd === 0) {
        return null;
      }

      return {
        dnsTime: Math.round(timing.domainLookupEnd - timing.domainLookupStart),
        tcpTime: Math.round(timing.connectEnd - timing.connectStart),
        ttfb: Math.round(timing.responseStart - timing.requestStart),
        downloadTime: Math.round(timing.responseEnd - timing.responseStart),
        domComplete: Math.round(timing.domComplete - timing.domLoading),
        loadComplete: Math.round(timing.loadEventEnd - timing.fetchStart),
        transferSize: 0,
        url: window.location.hostname
      };
    }

    // Check if page has loaded
    if (perf.loadEventEnd === 0) {
      return null;
    }

    return {
      dnsTime: Math.round(perf.domainLookupEnd - perf.domainLookupStart),
      tcpTime: Math.round(perf.connectEnd - perf.connectStart),
      ttfb: Math.round(perf.responseStart - perf.requestStart),
      downloadTime: Math.round(perf.responseEnd - perf.responseStart),
      domComplete: Math.round(perf.domComplete - perf.domLoading),
      loadComplete: Math.round(perf.loadEventEnd - perf.fetchStart),
      transferSize: perf.transferSize || 0,
      url: window.location.hostname
    };
  } catch (error) {
    console.error('Error getting performance data:', error);
    return null;
  }
}

function displayMetrics(data) {
  if (!data) {
    showError('No performance data available. Try refreshing the page first.');
    return;
  }

  document.getElementById('loading').style.display = 'none';
  document.getElementById('metrics').style.display = 'block';

  // DNS Time
  document.getElementById('dnsTime').textContent = data.dnsTime;
  if (data.dnsTime < 50) {
    document.getElementById('dnsSubtext').innerHTML = '<span class="status-badge status-good">Excellent</span>';
  } else if (data.dnsTime < 150) {
    document.getElementById('dnsSubtext').innerHTML = '<span class="status-badge status-warning">Fair</span>';
  } else {
    document.getElementById('dnsSubtext').innerHTML = '<span class="status-badge status-bad">Slow DNS</span>';
  }

  // TTFB (Server Response)
  document.getElementById('ttfbTime').textContent = data.ttfb;
  if (data.ttfb < 200) {
    document.getElementById('ttfbStatus').innerHTML = '<span class="status-badge status-good">Fast Server</span>';
  } else if (data.ttfb < 600) {
    document.getElementById('ttfbStatus').innerHTML = '<span class="status-badge status-warning">Moderate</span>';
  } else {
    document.getElementById('ttfbStatus').innerHTML = '<span class="status-badge status-bad">Slow Server</span>';
  }

  // Download Time
  document.getElementById('downloadTime').textContent = data.downloadTime;
  const sizeMB = (data.transferSize / 1024 / 1024).toFixed(2);
  if (data.downloadTime < 100) {
    document.getElementById('downloadSubtext').innerHTML = `<span class="status-badge status-good">Fast${data.transferSize > 0 ? ` (${sizeMB} MB)` : ''}</span>`;
  } else if (data.downloadTime < 500) {
    document.getElementById('downloadSubtext').innerHTML = `<span class="status-badge status-warning">Moderate${data.transferSize > 0 ? ` (${sizeMB} MB)` : ''}</span>`;
  } else {
    document.getElementById('downloadSubtext').innerHTML = `<span class="status-badge status-bad">Slow${data.transferSize > 0 ? ` (${sizeMB} MB)` : ''}</span>`;
  }

  // Total Load Time
  document.getElementById('loadTime').textContent = data.loadComplete;
  if (data.loadComplete < 1000) {
    document.getElementById('loadStatus').innerHTML = '<span class="status-badge status-good">Very Fast</span>';
  } else if (data.loadComplete < 3000) {
    document.getElementById('loadStatus').innerHTML = '<span class="status-badge status-warning">Acceptable</span>';
  } else {
    document.getElementById('loadStatus').innerHTML = '<span class="status-badge status-bad">Slow</span>';
  }

  // Diagnosis
  const diagnosis = generateDiagnosis(data);
  document.getElementById('diagnosisText').textContent = diagnosis;

  // Timestamp
  const now = new Date();
  document.getElementById('timestamp').textContent = `Updated: ${now.toLocaleTimeString()}`;
}

function generateDiagnosis(data) {
  const issues = [];
  
  // Check DNS
  if (data.dnsTime > 150) {
    issues.push('DNS lookup is slow - possibly a connection issue');
  }
  
  // Check TTFB (most important for server issues)
  if (data.ttfb > 600) {
    issues.push('Server response time is very slow - the website server is struggling');
  } else if (data.ttfb > 300) {
    issues.push('Server response is moderately slow - could be server load or distance');
  }
  
  // Check download
  if (data.downloadTime > 500 && data.transferSize > 1024 * 1024) {
    issues.push('Large content download taking time - could be your connection speed');
  }

  // Generate diagnosis
  if (issues.length === 0) {
    return '✅ Everything looks good! The website is loading normally.';
  }

  // Determine primary issue
  if (data.ttfb > 600) {
    return `🔴 PRIMARY ISSUE: Server Problem. The server is taking ${data.ttfb}ms to respond, which is very slow. This is NOT your internet connection - the website server is overloaded or having issues.`;
  } else if (data.dnsTime > 150 && data.downloadTime > 500) {
    return `🔴 PRIMARY ISSUE: Connection Problem. Both DNS lookup (${data.dnsTime}ms) and download (${data.downloadTime}ms) are slow, indicating your internet connection may be the bottleneck.`;
  } else if (data.downloadTime > 500) {
    const sizeInfo = data.transferSize > 0 ? ` (${(data.transferSize / 1024 / 1024).toFixed(2)}MB)` : '';
    return `⚠️ Your connection might be limiting download speed (${data.downloadTime}ms${sizeInfo}). Server response is acceptable.`;
  } else if (data.ttfb > 300) {
    return `⚠️ The server is responding slowly (${data.ttfb}ms). This is a server-side delay, not your connection.`;
  }
  
  return issues.join('. ') + '.';
}

function showError(message) {
  document.getElementById('loading').innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <div style="font-size: 40px; margin-bottom: 10px;">⚠️</div>
      <div style="font-size: 13px; line-height: 1.6;">${message}</div>
      <button id="retryBtn" style="margin-top: 15px; padding: 8px 16px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; color: #fff; cursor: pointer; font-size: 12px;">
        Try Again
      </button>
    </div>
  `;
  
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      location.reload();
    });
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  // Add a small delay to ensure popup is fully loaded
  setTimeout(() => {
    analyzePerformance();
  }, 100);
  
  // Handle both refresh buttons
  const refreshBtn = document.getElementById('refreshBtn');
  const refreshIconTop = document.getElementById('refreshIconTop');
  
  const handleRefresh = () => {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading').innerHTML = '<div class="spinner"></div>Analyzing current page...';
    document.getElementById('metrics').style.display = 'none';
    setTimeout(analyzePerformance, 500);
  };
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', handleRefresh);
  }
  
  if (refreshIconTop) {
    refreshIconTop.addEventListener('click', handleRefresh);
  }
});