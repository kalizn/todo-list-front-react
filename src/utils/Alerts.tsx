import Swal from 'sweetalert2'

export class Alerts {
  async errorAlert(content: string) {
    return Swal.fire({
      title: 'Error',
      text: content,
      icon: 'error',
      confirmButtonText: 'OK!',
      timer: 3500,
      timerProgressBar: true
    })
  }

  async errorInputsFields() {
    return Swal.fire({
      title: 'Error',
      text: 'Existem campos obrigatórios que precisam ser preenchidos!',
      icon: 'error',
      confirmButtonText: 'OK!',
      timer: 3500,
      timerProgressBar: true
    })
  }

  async successAlert(content: string) {
    return Swal.fire({
      title: 'Sucesso',
      text: content,
      icon: 'success',
      confirmButtonText: 'OK!',
      timer: 3500,
      timerProgressBar: true
    })
  }

  async warningAlert(content: string) {
    return Swal.fire({
      title: 'Atenção',
      text: content,
      icon: 'warning',
      confirmButtonText: 'OK!',
      timer: 3500,
      timerProgressBar: true
    })
  }

  async moveAlert(title?: string) {
    return Swal.fire({
      title: 'Redirecionamento',
      text: `Você será redirecionado para a página ${title}`,
      confirmButtonText: 'OK!',
      timer: 5000,
      timerProgressBar: true
    })
  }
}
