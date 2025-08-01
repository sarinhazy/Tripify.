function adicionarAoGoogleCalendar() {
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const local = document.getElementById('local').value;
    const data = document.getElementById('data').value;
    const inicio = document.getElementById('inicio').value;
    const termino = document.getElementById('termino').value;
  
    if (!data || !inicio || !termino) {
      alert('Preencha a data e horários corretamente.');
      return;
    }
  
    const formatDateTime = (date, time) => {
        const [year, month, day] = date.split('-');
        const [hour, minute] = time.split(':');
        return `${year}-${month}-${day}${hour}:${minute}:00`;
      };
  
    const start = formatDateTime(data, inicio);
    const end = formatDateTime(data, termino);
  
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      titulo
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      descricao
    )}&location=${encodeURIComponent(local)}&sf=true&output=xml`;
  
    window.open(url, '_blank');
  }