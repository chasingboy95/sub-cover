document.addEventListener('DOMContentLoaded', function () {
  const toggleMaskCheckbox = document.getElementById('toggle-mask');

  // Load the current state from storage
  chrome.storage.sync.get(['maskEnabled'], function (result) {
    toggleMaskCheckbox.checked = result.maskEnabled;
  });

  // Listen for toggle changes
  toggleMaskCheckbox.addEventListener('change', function () {
    chrome.storage.sync.set({ maskEnabled: toggleMaskCheckbox.checked }, function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-mask', enabled: toggleMaskCheckbox.checked });
      });
    });
  });
});