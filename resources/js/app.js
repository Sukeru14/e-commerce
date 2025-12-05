;(function () {
  'use strict'

  function createToast(message, timeout = 2500) {
    const toast = document.createElement('div')
    toast.className = 'ecom-toast'
    toast.textContent = message
    Object.assign(toast.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      zIndex: 9999,
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    })
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.style.transition = 'opacity 240ms'
      toast.style.opacity = '0'
      setTimeout(() => toast.remove(), 260)
    }, timeout)
  }

  document.addEventListener('click', async (ev) => {
    const target = ev.target instanceof Element ? ev.target.closest('[data-copy-code]') : null
    if (!target) return
    ev.preventDefault()
    const value =
      target.getAttribute('data-copy-code') || target.dataset.copy || target.textContent || ''
    if (!value) return createToast('Nenhum código encontrado')
    try {
      await navigator.clipboard.writeText(value.trim())
      createToast('Código copiado')
    } catch (err) {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        createToast('Código copiado')
      } catch (e) {
        createToast('Não foi possível copiar')
      }
      textarea.remove()
    }
  })

  document.addEventListener(
    'submit',
    (ev) => {
      const form = ev.target instanceof HTMLFormElement ? ev.target : null
      if (!form) return
      const msg = form.getAttribute('data-confirm') || form.dataset.confirm
      if (msg) {
        const ok = confirm(msg)
        if (!ok) ev.preventDefault()
      }
    },
    true
  )

  document.addEventListener(
    'submit',
    (ev) => {
      const form = ev.target instanceof HTMLFormElement ? ev.target : null
      if (!form) return
      if (form.dataset.disableOnSubmit === 'true') {
        const submits = form.querySelectorAll('button[type="submit"], input[type="submit"]')
        submits.forEach((btn) => (btn.disabled = true))
      }
    },
    true
  )

  document.addEventListener('DOMContentLoaded', () => {
    const q = document.querySelector('input[name="q"]')
    if (q) {
      q.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const f = q.form
          if (f) f.submit()
        }
      })
    }

    const isAdmin = document.body.getAttribute('data-is-admin') === 'true'
    if (isAdmin) {
      document.querySelectorAll('.js-hide-if-admin').forEach((el) => el.remove())
    }
  })

  window.ecom = window.ecom || {}
  window.ecom.toast = createToast
})()
