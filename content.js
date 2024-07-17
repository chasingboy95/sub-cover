let mask;
let isDragging = false;
let isResizing = false;
let startX, startY, startWidth, startHeight;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggle-mask') {
    if (message.enabled) {
      showMask();
    } else {
      hideMask();
    }
  }
});

function showMask() {
  if (!mask) {
    mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.bottom = '50px'; // 设置距离底部 50px
    mask.style.left = '50%'; // 水平居中
    mask.style.transform = 'translateX(-50%)'; // 水平居中
    mask.style.width = '800px';
    mask.style.height = '50px';
    mask.style.backgroundColor = 'black';
    mask.style.zIndex = '10000';
    mask.style.cursor = 'move';
    mask.style.resize = 'both';
    mask.style.overflow = 'hidden';
    document.body.appendChild(mask);

    mask.addEventListener('mousedown', onMouseDown);
    mask.addEventListener('mouseup', onMouseUp);
    mask.addEventListener('mousemove', onMouseMove);
    mask.addEventListener('click', preventClick);
  }
}

function hideMask() {
  if (mask) {
    document.body.removeChild(mask);
    mask = null;
  }
}

function onMouseDown(event) {
  if (event.target === mask) {
    if (event.offsetX > mask.offsetWidth - 20 && event.offsetY > mask.offsetHeight - 20) {
      isResizing = true;
      startWidth = parseInt(document.defaultView.getComputedStyle(mask).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(mask).height, 10);
      startX = event.clientX;
      startY = event.clientY;
    } else {
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(mask).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(mask).height, 10);
    }
  }
}

function onMouseUp() {
  isDragging = false;
  isResizing = false;
}

function onMouseMove(event) {
  if (isDragging) {
    mask.style.top = `${mask.offsetTop + event.movementY}px`;
    mask.style.left = `${mask.offsetLeft + event.movementX}px`;
  } else if (isResizing) {
    const width = startWidth + (event.clientX - startX);
    const height = startHeight + (event.clientY - startY);
    mask.style.width = `${width}px`;
    mask.style.height = `${height}px`;
  }
}

function preventClick(event) {
  event.stopPropagation();
}