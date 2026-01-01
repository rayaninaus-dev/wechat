
// Simulation of WeChat Mini Program APIs for Web Environment
export const wx = {
  // --- Data Cache (Storage) ---
  getStorageSync: (key: string) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : '';
    } catch (e) { return ''; }
  },
  
  setStorageSync: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) { console.error('Storage full'); }
  },

  removeStorageSync: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clearStorageSync: () => {
    localStorage.clear();
  },

  // --- Interactive Feedback ---
  showToast: (options: { title: string, icon?: 'success' | 'loading' | 'none' | 'error', duration?: number }) => {
    const event = new CustomEvent('wx:showToast', { detail: options });
    window.dispatchEvent(event);
  },

  showModal: (options: { 
    title?: string, 
    content: string, 
    showCancel?: boolean,
    cancelText?: string,
    confirmText?: string,
    success?: (res: { confirm: boolean, cancel: boolean }) => void 
  }) => {
    const event = new CustomEvent('wx:showModal', { detail: options });
    window.dispatchEvent(event);
  },

  // --- Route / Navigation (Mock) ---
  // https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
  switchTab: (options: { url: string }) => {
    const event = new CustomEvent('wx:route', { 
        detail: { type: 'switchTab', url: options.url } 
    });
    window.dispatchEvent(event);
  },

  // https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
  navigateTo: (options: { url: string }) => {
    const event = new CustomEvent('wx:route', { 
        detail: { type: 'navigateTo', url: options.url } 
    });
    window.dispatchEvent(event);
  },

  navigateBack: (options?: { delta?: number }) => {
    const event = new CustomEvent('wx:route', { 
        detail: { type: 'navigateBack', delta: options?.delta || 1 } 
    });
    window.dispatchEvent(event);
  },

  // --- Network (Mock) ---
  request: async (options: { url: string, method?: string, data?: any, success?: (res: any) => void, fail?: (err: any) => void }) => {
    try {
        const res = await fetch(options.url, {
            method: options.method || 'GET',
            body: JSON.stringify(options.data),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if(options.success) options.success({ data, statusCode: res.status });
    } catch(e) {
        if(options.fail) options.fail(e);
    }
  }
};
