import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: true,

      initTheme: () => {
        const { isDark } = get()
        if (isDark) {
          document.documentElement.classList.remove('light')
        } else {
          document.documentElement.classList.add('light')
        }
      },

      toggleTheme: () => {
        const { isDark } = get()
        const newIsDark = !isDark
        if (newIsDark) {
          document.documentElement.classList.remove('light')
        } else {
          document.documentElement.classList.add('light')
        }
        set({ isDark: newIsDark })
      },
    }),
    { name: 'bookease-theme' }
  )
)

export default useThemeStore