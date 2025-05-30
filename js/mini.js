/**
 * Mini Window JavaScript
 * miniウィンドウ用のロジック（Hide/Showパターン対応）
 */

// Tauri APIのインポート
const { invoke } = window.__TAURI__.tauri;

// DOM要素の取得
let closeButton;
let miniContainer;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeMiniWindow();
    setupEventListeners();
    console.log('Mini window JavaScript initialized');
});

/**
 * Mini窓の初期化
 */
function initializeMiniWindow() {
    closeButton = document.getElementById('closeButton');
    miniContainer = document.querySelector('.mini-container');
    
    // 初期表示時のアニメーション
    if (miniContainer) {
        miniContainer.style.opacity = '0';
        miniContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            miniContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            miniContainer.style.opacity = '1';
            miniContainer.style.transform = 'scale(1)';
        }, 50);
    }
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    // 閉じるボタンのクリックイベント
    if (closeButton) {
        closeButton.addEventListener('click', handleCloseWindow);
    }
    
    // Escキーでの閉じる機能
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            handleCloseWindow();
        }
    });
    
    // アコーディオンのアニメーション強化
    const accordions = document.querySelectorAll('.mini-accordion');
    accordions.forEach(accordion => {
        accordion.addEventListener('toggle', handleAccordionToggle);
    });
    
    // ウィンドウのフォーカス管理
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
}

/**
 * ウィンドウを閉じる処理
 * 注意: Hide/Showパターンに変更 - close_mini_windowコマンドを呼び出す
 */
async function handleCloseWindow() {
    try {
        console.log('=== JavaScript: Closing mini window (Hide/Show pattern) ===');
        
        // 閉じるアニメーション
        if (miniContainer) {
            miniContainer.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            miniContainer.style.opacity = '0';
            miniContainer.style.transform = 'scale(0.9)';
        }
        
        // 少し待ってからRustコマンドを実行
        setTimeout(async () => {
            try {
                console.log('=== JavaScript: Calling close_mini_window command ===');
                // close_mini_windowコマンドが自動的にminiウィンドウを非表示にしてメインウィンドウを表示
                await invoke('close_mini_window');
                console.log('close_mini_window command completed successfully');
            } catch (error) {
                console.error('Error calling close_mini_window:', error);
                // エラーが発生した場合のフォールバック
                try {
                    await invoke('show_main_window');
                    console.log('Fallback: show_main_window called successfully');
                } catch (fallbackError) {
                    console.error('Fallback failed:', fallbackError);
                }
            }
        }, 200);
        
    } catch (error) {
        console.error('Error in handleCloseWindow:', error);
    }
}

/**
 * アコーディオンの開閉アニメーション
 */
function handleAccordionToggle(event) {
    const accordion = event.target;
    const content = accordion.querySelector('.accordion-content');
    
    if (content) {
        if (accordion.open) {
            // 開く時のアニメーション
            content.style.animation = 'slideDown 0.3s ease-out';
        } else {
            // 閉じる時のアニメーション
            content.style.animation = 'slideUp 0.2s ease-in';
        }
    }
}

/**
 * ウィンドウフォーカス喪失時の処理
 */
function handleWindowBlur() {
    if (miniContainer) {
        miniContainer.style.opacity = '0.8';
    }
}

/**
 * ウィンドウフォーカス時の処理
 */
function handleWindowFocus() {
    if (miniContainer) {
        miniContainer.style.opacity = '1';
    }
}

/**
 * 設定オプションの動的変更（将来の拡張用）
 */
function applyWindowOptions(options = {}) {
    if (!miniContainer) return;
    
    // 透明度モード
    if (options.transparentMode) {
        miniContainer.classList.add('transparent-mode');
    } else {
        miniContainer.classList.remove('transparent-mode');
    }
    
    // 最前面モード  
    if (options.alwaysOnTop) {
        miniContainer.classList.add('always-on-top');
    } else {
        miniContainer.classList.remove('always-on-top');
    }
    
    // 固定サイズモード
    if (options.fixedSize) {
        miniContainer.classList.add('fixed-size');
    } else {
        miniContainer.classList.remove('fixed-size');
    }
}

// スライドアップアニメーションのCSS追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// エクスポート（将来のモジュール化用）
window.miniWindowAPI = {
    close: handleCloseWindow,
    applyOptions: applyWindowOptions
};
