// HTML要素を動的に読み込むためのユーティリティ関数

// 指定されたURLからHTMLを読み込み、指定された要素内にコンテンツを挿入する
export async function loadHTML(url, targetElementId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = html;
    } else {
      console.error(`Target element with ID "${targetElementId}" not found.`);
    }
    return true;
  } catch (error) {
    console.error('Error loading HTML:', error);
    return false;
  }
}