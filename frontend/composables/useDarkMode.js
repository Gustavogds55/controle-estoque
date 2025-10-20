export const useDarkMode = () => {
  const darkMode = useState('darkMode', () => false)

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    if (process.client) {
      localStorage.setItem('darkMode', darkMode.value)
    }
  }

  const initDarkMode = () => {
    if (process.client) {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) {
        darkMode.value = saved === 'true'
      }
    }
  }

  return { darkMode, toggleDarkMode, initDarkMode }
}
