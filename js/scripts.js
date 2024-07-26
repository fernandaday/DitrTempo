const limpar = document.querySelector("#limpar")

limpar.addEventListener("click", function () {
  location.reload();
});


const distribuir = document.querySelector("#distribuir")

distribuir.addEventListener("click", function () {
  let tempoDisponivel = document.getElementById("tempo-disponivel").value
  let tempoDisponivelSegundos = tempoDisponivel * 60
  const qtdeParagrafos = document.getElementById("qtde-paragrafos").value
  const introducao = document.getElementById("introducao")
  const conclusao = document.getElementById("conclusao")
  const recapitulacao = document.getElementById("recapitulacao")
  
  if (introducao.checked) {tempoDisponivelSegundos = tempoDisponivelSegundos -90}

  if (conclusao.checked) {tempoDisponivelSegundos = tempoDisponivelSegundos -90}

  if (recapitulacao.selectedIndex === 1) {tempoDisponivelSegundos = tempoDisponivelSegundos -90}
  if (recapitulacao.selectedIndex === 2) {tempoDisponivelSegundos = tempoDisponivelSegundos -180}
  if (recapitulacao.selectedIndex === 3) {tempoDisponivelSegundos = tempoDisponivelSegundos -270}

  tempoDisponivel = Math.trunc(tempoDisponivelSegundos / 60)
  
  let sobraTempoDisponivelSegundos = tempoDisponivelSegundos - (tempoDisponivel * 60)
  
  let horaFimParagrafo = moment(document.getElementById("hora-inicio").value, "HH:mm:ss")

  let tempoMedioMin = Math.trunc(tempoDisponivel / qtdeParagrafos) 
  let tempoMedioSeg = tempoDisponivel - (tempoMedioMin * qtdeParagrafos)

  // Transformando em segundos
  tempoMedioSeg = tempoMedioSeg * 60
  tempoMedioSeg = tempoMedioSeg + sobraTempoDisponivelSegundos
  let tempoSegFinal = tempoMedioSeg
  
  // Dividindo os Segundos nos parágrafos e truncando
  tempoMedioSeg = Math.trunc(tempoMedioSeg / qtdeParagrafos)
  
  // Calculando a sobra dos segundos
  tempoSegFinal = tempoSegFinal - (tempoMedioSeg * qtdeParagrafos)
  
  let paragrafosDistribuidos = document.getElementById("div-paragrafos-distribuidos")
  paragrafosDistribuidos.classList.remove("d-none")

  let clones = document.querySelectorAll('.clonado');
  for (let i = 0; i < clones.length; i++) {
    clones[i].parentNode.removeChild(clones[i]);
  }

  if (introducao.checked) {
    horaFimParagrafo = somaTempoParagrafo(horaFimParagrafo, 1, 30);

    adicionaParagrafo("Intro", 1, 30, horaFimParagrafo, paragrafosDistribuidos);
  }

  for (let i = 1; i < qtdeParagrafos; i++) {
    horaFimParagrafo = somaTempoParagrafo(horaFimParagrafo, tempoMedioMin, tempoMedioSeg);

    adicionaParagrafo(i, tempoMedioMin, tempoMedioSeg, horaFimParagrafo, paragrafosDistribuidos);
  }

  horaFimParagrafo = somaTempoParagrafo(horaFimParagrafo, tempoMedioMin, tempoMedioSeg + tempoSegFinal);

  if ((tempoMedioSeg + tempoSegFinal) === 60) {
    tempoMedioSeg = 0
    tempoSegFinal = 0
    tempoMedioMin = tempoMedioMin + 1
  }

  // Adiciona o último parágrafo com o restante do tempo
  adicionaParagrafo(qtdeParagrafos, tempoMedioMin, tempoMedioSeg + tempoSegFinal, horaFimParagrafo, paragrafosDistribuidos);

  for (let i = 1; i <= recapitulacao.selectedIndex; i++) {
    horaFimParagrafo = somaTempoParagrafo(horaFimParagrafo, 1, 30);

    adicionaParagrafo("R" + i, 1, 30, horaFimParagrafo, paragrafosDistribuidos);
  }

  if (conclusao.checked) {
    horaFimParagrafo = somaTempoParagrafo(horaFimParagrafo, 1, 30);

    adicionaParagrafo("Conclusão", 1, 30, horaFimParagrafo, paragrafosDistribuidos);
  }
})

function ehNumeroMaiorZero(num) {
  if (num>0) { 
    return true
  }
  return false
}

function somaTempoParagrafo(horaInicial, minutos, segundos) {
  horaInicial = horaInicial.add(minutos, "minutes");
  horaInicial = horaInicial.add(segundos, "seconds");

  return horaInicial
}

function adicionaParagrafo(nuParagrafo, tempoMedioMin, tempoMedioSeg, horaFinalParagrafo, nodePai){
  let novoParagrafo = document.querySelector("#paragrafo .template").cloneNode(true)
  novoParagrafo.classList.remove("d-none")
  novoParagrafo.classList.remove("template")
  novoParagrafo.classList.add("clonado")
  novoParagrafo.classList.add("paragrafo" + nuParagrafo)
  nodePai.appendChild(novoParagrafo)

  let inputNumeroParagrafo = document.querySelector(".paragrafo" + nuParagrafo + " .numero-paragrafo")
  inputNumeroParagrafo.value = nuParagrafo

  let inputTempoParagrafoMin = document.querySelector(".paragrafo" + nuParagrafo + " .tempo-paragrafo-minutos")
  inputTempoParagrafoMin.value = tempoMedioMin

  let inputTempoParagrafoSeg = document.querySelector(".paragrafo" + nuParagrafo + " .tempo-paragrafo-segundos")
  inputTempoParagrafoSeg.value = tempoMedioSeg

  let paragrafoHoraFinalParagrafo = document.querySelector(".paragrafo" + nuParagrafo + " .hora-final-paragrafo")
  paragrafoHoraFinalParagrafo.value = horaFinalParagrafo.format("HH:mm:ss")
}

const atualizar = document.querySelector("#atualizar")

atualizar.addEventListener("click", function () {
  let horaAdicionar = moment(document.getElementById("hora-inicio").value, "HH:mm:ss")
  let horaFinalParagrafo = document.querySelectorAll(".hora-final-paragrafo")
  
  const horaInicio = moment(document.getElementById("hora-inicio").value, "HH:mm:ss")
  const minutos = document.querySelectorAll(".tempo-paragrafo-minutos")
  const segundos = document.querySelectorAll(".tempo-paragrafo-segundos")

  for (let i = 0; i < minutos.length; i++) {
    horaAdicionar = somaTempoParagrafo(horaAdicionar, minutos[i].value, segundos[i].value)
    horaFinalParagrafo[i].value = horaAdicionar.format("HH:mm:ss")
    horaFinalParagrafo[i].innerHTML = horaAdicionar.format("HH:mm:ss")
  }

  // const tempoParte = moment(horaAdicionar, "HH:mm:ss")
  const tempoParte = duracao(horaInicio.format("HH:mm:ss"), horaAdicionar.format("HH:mm:ss"));
  
  let tempoDistribuido = document.getElementById("total-tempo-distribuido")
  tempoDistribuido.textContent =
    "Início: " + horaInicio.format("HH:mm:ss") + 
    " Término: " + horaAdicionar.format("HH:mm:ss")  + 
    " Tempo: " + tempoParte + " minutos"
})

const copiar = document.querySelector("#copiar")

copiar.addEventListener("click", function () {
  const paragrafo = document.querySelectorAll(".numero-paragrafo")
  const horaFinalParagrafo = document.querySelectorAll(".hora-final-paragrafo")
  
  let copiaTempos = ""
  
  for (let i = 0; i < paragrafo.length; i++) {

    if ((paragrafo[i].value != undefined) & (paragrafo[i].value != "")) {
      console.log(paragrafo[i].value)
      copiaTempos = copiaTempos + 
        paragrafo[i].value + " " + horaFinalParagrafo[i].value + "\n"
    }
  }

  navigator.clipboard.writeText(copiaTempos);

  alert("Copiado para área de transferência");
})

function parse(horario) {
  let [hora, minuto] = horario.split(':').map(v => parseInt(v));
  if (!minuto) { // para o caso de não ter os minutos
      minuto = 0;
  }
  return minuto + (hora * 60);
}

function duracao(inicio, fim) {
  return (parse(fim) - parse(inicio));
}