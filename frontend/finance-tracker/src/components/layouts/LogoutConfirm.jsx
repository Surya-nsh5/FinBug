import React from 'react'

const LogoutConfirm = ({ onCancel, onLogout }) => {
  return (
    <div className="space-y-4">
      <p className="text-[var(--color-text)] text-sm">
        Are you sure you want to logout? You will need to sign in again to access your account.
      </p>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default LogoutConfirm
