import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: true,

      initTheme: () => {
        const { isDark } = get()
        if (isDark) {
          document.documentElement.classList.add('light')
        } else {
          document.documentElement.classList.remove('light')
        }
      },

      toggleTheme: () => {
        const { isDark } = get()
        const newIsDark = !isDark
        if (newIsDark) {
          document.documentElement.classList.add('light')
        } else {
          document.documentElement.classList.remove('light')
        }
        set({ isDark: newIsDark })
      },
    }),
    { name: 'booker-theme' }
  )
)

export default useThemeStore