export const useToast = () => {
  const toast = useState('toast', () => ({
    show: false,
    message: '',
    type: 'success'
  }))

  const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  const getToastClasses = (type) => {
    const classes = {
      success: 'bg-green-400 text-white',
      error: 'bg-red-400 text-white',
      warning: 'bg-yellow-400 text-gray-800',
      info: 'bg-blue-400 text-white'
    }
    return classes[type] || classes.success
  }

  const getToastIcon = (type) => {
    const icons = {
      success: 'M5 13l4 4L19 7',
      error: 'M6 18L18 6M6 6l12 12',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
    return icons[type] || icons.success
  }

  return { toast, showToast, getToastClasses, getToastIcon }
}
