import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2, ShieldAlert } from 'lucide-react';
import { AdminUser } from '../../types';
import { DEFAULT_SUPER_ADMIN_EMAIL } from '../../lib/firebase';

interface DeleteAdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirmDelete: (email: string) => Promise<void>;
}

export const DeleteAdminUserModal: React.FC<DeleteAdminUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirmDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !user) return null;

  const isPrimary = user.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL;

  const handleDelete = async () => {
    if (isPrimary) return;
    setIsDeleting(true);
    try {
      await onConfirmDelete(user.email);
      onClose();
    } catch (err) {
      console.warn("Delete admin user failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
            {isPrimary ? <ShieldAlert className="w-6 h-6" /> : <Trash2 className="w-6 h-6" />}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isPrimary ? 'Protected Primary Super Admin' : 'Revoke Administrator Access?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {isPrimary ? (
              <span>The root Super Admin account (<strong className="text-slate-900 dark:text-white">{user.email}</strong>) cannot be deleted or revoked. It is required for portal administration.</span>
            ) : (
              <span>Are you sure you want to revoke administrator access for <strong className="text-slate-900 dark:text-white">"{user.name}"</strong> (<span className="font-mono">{user.email}</span>)?</span>
            )}
          </p>
        </div>

        {!isPrimary && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-start space-x-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>This user will immediately lose access to the administrator portal and cannot log in to /admin.</span>
          </div>
        )}

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm cursor-pointer"
          >
            {isPrimary ? 'Close' : 'Cancel'}
          </button>
          {!isPrimary && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-sm flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Revoking...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Revoke Access</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
