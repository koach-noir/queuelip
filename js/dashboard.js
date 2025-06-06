/**
 * Dashboard Window JavaScript
 * ダッシュボードウィンドウ用のロジック（Hide/Showパターン対応）
 */

// Tauri APIの取得（初期化後に設定）
let invoke = null;
let clipboardAPI = null;

// Tauri APIの初期化を待つ
function waitForTauriAPI() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5秒間待機
        
        function checkAPI() {
            if (window.__TAURI__ && window.__TAURI__.tauri && window.__TAURI__.clipboard) {
                invoke = window.__TAURI__.tauri.invoke;
                clipboardAPI = window.__TAURI__.clipboard;
                console.log('Tauri API initialized successfully');
                resolve();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkAPI, 100);
            } else {
                reject(new Error('Tauri API not available after 5 seconds'));
            }
        }
        checkAPI();
    });
}

// DOM要素の取得
let closeButton;
let dashboardContainer;

// グローバル変数
let currentContext = 'default';

// 初期化
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Tauri APIの初期化を待つ
        await waitForTauriAPI();
        
        initializeDashboard();
        setupEventListeners();
        setupContextListener();
        
        // URLパラメータからコンテキストを取得（フォールバック）
        const urlParams = new URLSearchParams(window.location.search);
        const fallbackContext = urlParams.get('context');
        if (fallbackContext) {
            console.log('Loading content from URL parameter:', fallbackContext);
            loadContentByContext(fallbackContext);
        }
        
        console.log('Dashboard window JavaScript initialized');
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        // Tauri APIが使用できない場合のフォールバック
        initializeDashboard();
        setupEventListeners();
    }
});

/**
 * ダッシュボードの初期化
 */
function initializeDashboard() {
    closeButton = document.getElementById('closeButton');
    dashboardContainer = document.querySelector('.dashboard-container');
    
    // 初期表示時のアニメーション
    if (dashboardContainer) {
        dashboardContainer.style.opacity = '0';
        dashboardContainer.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            dashboardContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            dashboardContainer.style.opacity = '1';
            dashboardContainer.style.transform = 'scale(1)';
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
    const accordions = document.querySelectorAll('.dashboard-accordion');
    accordions.forEach(accordion => {
        accordion.addEventListener('toggle', handleAccordionToggle);
    });
    
    // ウィンドウのフォーカス管理
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
}

/**
 * コンテキストリスナーの設定
 */
function setupContextListener() {
    // Tauriイベントリスナーを設定
    if (window.__TAURI__ && window.__TAURI__.event) {
        window.__TAURI__.event.listen('dashboard-context', (event) => {
            console.log('Context received:', event.payload);
            currentContext = event.payload;
            
            // DOMが準備できるまで少し待つ
            setTimeout(() => {
                loadContentByContext(currentContext);
            }, 100);
        });
        console.log('Context listener setup complete');
    } else {
        console.warn('Tauri event API not available for context listener');
    }
}

/**
 * ウィンドウを閉じる処理
 * 注意: Hide/Showパターンに変更 - close_dashboardコマンドを呼び出す
 */
async function handleCloseWindow() {
    try {
        console.log('=== JavaScript: Closing dashboard window (Hide/Show pattern) ===');
        
        // 閉じるアニメーション
        if (dashboardContainer) {
            dashboardContainer.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            dashboardContainer.style.opacity = '0';
            dashboardContainer.style.transform = 'scale(0.9)';
        }
        
        // 少し待ってからRustコマンドを実行
        setTimeout(async () => {
            try {
                if (!invoke) {
                    console.error('Tauri invoke API not available');
                    return;
                }
                
                console.log('=== JavaScript: Calling close_dashboard command ===');
                // close_dashboardコマンドが自動的にダッシュボードウィンドウを非表示にしてメインウィンドウを表示
                await invoke('close_dashboard');
                console.log('close_dashboard command completed successfully');
            } catch (error) {
                console.error('Error calling close_dashboard:', error);
                // エラーが発生した場合のフォールバック
                try {
                    if (invoke) {
                        await invoke('show_main_window');
                        console.log('Fallback: show_main_window called successfully');
                    }
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
    if (dashboardContainer) {
        dashboardContainer.style.opacity = '0.8';
    }
}

/**
 * ウィンドウフォーカス時の処理
 */
function handleWindowFocus() {
    if (dashboardContainer) {
        dashboardContainer.style.opacity = '1';
    }
}

/**
 * 設定オプションの動的変更（将来の拡張用）
 */
function applyWindowOptions(options = {}) {
    if (!dashboardContainer) return;
    
    // 透明度モード
    if (options.transparentMode) {
        dashboardContainer.classList.add('transparent-mode');
    } else {
        dashboardContainer.classList.remove('transparent-mode');
    }
    
    // 最前面モード  
    if (options.alwaysOnTop) {
        dashboardContainer.classList.add('always-on-top');
    } else {
        dashboardContainer.classList.remove('always-on-top');
    }
    
    // 固定サイズモード
    if (options.fixedSize) {
        dashboardContainer.classList.add('fixed-size');
    } else {
        dashboardContainer.classList.remove('fixed-size');
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
/**
 * コンテキストに応じたコンテンツを読み込む
 */
function loadContentByContext(context) {
    const contentContainer = document.querySelector('.dashboard-content');
    if (!contentContainer) {
        console.warn('Content container not found, retrying in 100ms...');
        setTimeout(() => loadContentByContext(context), 100);
        return;
    }
    
    let content = '';
    
    switch(context) {
        case 'view-a':
            content = generateClipboardMonitorContent();
            contentContainer.innerHTML = content;
            // DOMが更新された後に機能を開始
            setTimeout(() => startClipboardMonitoring(), 50);
            break;
        case 'view-b':
            content = generateClockContent();
            contentContainer.innerHTML = content;
            // DOMが更新された後に機能を開始
            setTimeout(() => startClock(), 50);
            break;
        default:
            content = generateDefaultContent();
            contentContainer.innerHTML = content;
            break;
    }
    
    console.log(`Content loaded for context: ${context}`);
}

/**
 * ビューA用：クリップボード監視コンテンツ
 */
function generateClipboardMonitorContent() {
    return `
        <div class="dashboard-accordion">
            <details open>
                <summary>クリップボード監視</summary>
                <div class="accordion-content">
                    <p>最新のコピー内容:</p>
                    <div id="clipboard-content" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin: 10px 0; font-family: monospace; white-space: pre-wrap; max-height: 150px; overflow-y: auto;">監視中...</div>
                    <button id="refresh-clipboard" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">手動更新</button>
                </div>
            </details>
        </div>
        <div class="dashboard-accordion">
            <details>
                <summary>統計情報</summary>
                <div class="accordion-content">
                    <p>クリップボード使用状況:</p>
                    <ul>
                        <li>監視開始時刻: <span id="monitor-start-time">-</span></li>
                        <li>更新回数: <span id="update-count">0</span></li>
                        <li>最終更新: <span id="last-update">-</span></li>
                    </ul>
                </div>
            </details>
        </div>
    `;
}

/**
 * ビューB用：時計表示コンテンツ
 */
function generateClockContent() {
    return `
        <div class="dashboard-accordion">
            <details open>
                <summary>リアルタイム時計</summary>
                <div class="accordion-content">
                    <div style="text-align: center; margin: 20px 0;">
                        <div id="current-time" style="font-size: 2em; font-weight: bold; color: #3b82f6; font-family: monospace;">--:--:--</div>
                        <div id="current-date" style="font-size: 1.2em; color: #d1d5db; margin-top: 10px;">----/--/--</div>
                    </div>
                </div>
            </details>
        </div>
        <div class="dashboard-accordion">
            <details>
                <summary>時間設定</summary>
                <div class="accordion-content">
                    <p>表示設定:</p>
                    <ul>
                        <li>フォーマット: 24時間表記</li>
                        <li>タイムゾーン: JST (UTC+9)</li>
                        <li>更新間隔: 1秒</li>
                    </ul>
                </div>
            </details>
        </div>
    `;
}

/**
 * デフォルトコンテンツ
 */
function generateDefaultContent() {
    return `
        <div class="dashboard-accordion">
            <details open>
                <summary>ダッシュボード</summary>
                <div class="accordion-content">
                    <p>ビューA または ビューB から開くと、専用コンテンツが表示されます。</p>
                    <ul>
                        <li>ビューA: クリップボード監視機能</li>
                        <li>ビューB: リアルタイム時計表示</li>
                    </ul>
                </div>
            </details>
        </div>
    `;
}

/**
 * クリップボード監視開始
 */
function startClipboardMonitoring() {
    console.log('Starting clipboard monitoring...');
    
    const clipboardContent = document.getElementById('clipboard-content');
    const updateCount = document.getElementById('update-count');
    const lastUpdate = document.getElementById('last-update');
    const monitorStartTime = document.getElementById('monitor-start-time');
    const refreshButton = document.getElementById('refresh-clipboard');
    
    // DOM要素の存在確認
    if (!clipboardContent) {
        console.error('Clipboard content element not found');
        return;
    }
    
    let count = 0;
    
    if (monitorStartTime) {
        monitorStartTime.textContent = new Date().toLocaleTimeString();
    }
    
    // Tauri APIの利用可能性を確認
    if (!clipboardAPI) {
        console.error('Tauri clipboard API not available');
        if (clipboardContent) {
            clipboardContent.textContent = 'Tauri clipboard API が利用できません';
        }
        return;
    }
    
    async function updateClipboard() {
        try {
            // Tauri のクリップボードAPIを使用
            if (clipboardAPI && clipboardAPI.readText) {
                const text = await clipboardAPI.readText();
                if (clipboardContent) {
                    clipboardContent.textContent = text || '(空のクリップボード)';
                }
                count++;
                if (updateCount) updateCount.textContent = count;
                if (lastUpdate) lastUpdate.textContent = new Date().toLocaleTimeString();
                console.log('Clipboard updated successfully');
            } else {
                throw new Error('Tauri clipboard API not available');
            }
        } catch (error) {
            console.error('Clipboard access error:', error);
            if (clipboardContent) {
                clipboardContent.textContent = `クリップボードアクセスエラー: ${error.message}`;
            }
        }
    }
    
    // 初回実行
    updateClipboard();
    
    // 3秒ごとに更新
    const interval = setInterval(updateClipboard, 3000);
    
    // 手動更新ボタン
    if (refreshButton) {
        refreshButton.addEventListener('click', updateClipboard);
    }
    
    // ウィンドウが非表示になったらクリア
    window.addEventListener('beforeunload', () => {
        clearInterval(interval);
    });
}

/**
 * 時計表示開始
 */
function startClock() {
    console.log('Starting clock display...');
    
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    // DOM要素の存在確認
    if (!timeElement || !dateElement) {
        console.error('Clock elements not found:', {
            timeElement: !!timeElement,
            dateElement: !!dateElement
        });
        return;
    }
    
    function updateClock() {
        const now = new Date();
        
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('ja-JP', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                weekday: 'short'
            });
        }
    }
    
    // 初回実行
    updateClock();
    
    // 1秒ごとに更新
    const interval = setInterval(updateClock, 1000);
    
    // ウィンドウが非表示になったらクリア
    window.addEventListener('beforeunload', () => {
        clearInterval(interval);
    });
}

window.dashboardAPI = {
    close: handleCloseWindow,
    applyOptions: applyWindowOptions,
    loadContent: loadContentByContext
};
