// ホバー検知機能を設定
export function setupHoverDetection() {
  const mainView = document.getElementById('view-main');
  const hoverStatus = document.getElementById('hover-status');
  
  if (mainView && hoverStatus) {
    mainView.addEventListener('mouseenter', function() {
      hoverStatus.textContent = 'ホバー検知: アクティブ';
      hoverStatus.classList.add('active');
    });
    
    mainView.addEventListener('mouseleave', function() {
      hoverStatus.textContent = 'ホバー検知: 非アクティブ';
      hoverStatus.classList.remove('active');
    });
  }
}