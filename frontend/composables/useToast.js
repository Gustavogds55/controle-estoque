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

  return { toast, showToast }
}
