
import React, { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

export const WxOverlays: React.FC = () => {
  const [toast, setToast] = useState<{ show: boolean, title: string, icon: string } | null>(null);
  const [modal, setModal] = useState<any | null>(null);

  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      const { title, icon = 'success', duration = 1500 } = e.detail;
      setToast({ show: true, title, icon });
      setTimeout(() => setToast(null), duration);
    };

    const handleModal = (e: CustomEvent) => {
      setModal(e.detail);
    };

    window.addEventListener('wx:showToast', handleToast as EventListener);
    window.addEventListener('wx:showModal', handleModal as EventListener);

    return () => {
      window.removeEventListener('wx:showToast', handleToast as EventListener);
      window.removeEventListener('wx:showModal', handleModal as EventListener);
    };
  }, []);

  if (!toast && !modal) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      {/* Toast */}
      {toast && (
        <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-4 rounded-xl flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200 shadow-2xl min-w-[120px]">
          {toast.icon === 'success' && <Check size={32} />}
          {toast.icon === 'loading' && <Loader2 size={32} className="animate-spin" />}
          {toast.icon === 'error' && <X size={32} />}
          <span className="text-sm font-medium">{toast.title}</span>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 pointer-events-auto flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              {modal.title && <h3 className="font-bold text-lg mb-3 text-gray-900">{modal.title}</h3>}
              <p className="text-gray-500 text-sm leading-relaxed">{modal.content}</p>
            </div>
            <div className="flex border-t border-gray-100 divide-x divide-gray-100">
              {modal.showCancel !== false && (
                <button 
                  onClick={() => {
                    setModal(null);
                    if (modal.success) modal.success({ confirm: false, cancel: true });
                  }}
                  className="flex-1 py-4 text-gray-900 font-bold active:bg-gray-50 text-sm"
                >
                  {modal.cancelText || 'Cancel'}
                </button>
              )}
              <button 
                onClick={() => {
                    setModal(null);
                    if (modal.success) modal.success({ confirm: true, cancel: false });
                }}
                className={`flex-1 py-4 font-bold active:bg-gray-50 text-sm ${modal.showCancel === false ? 'text-green-600' : 'text-[#07c160]'}`}
              >
                {modal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
