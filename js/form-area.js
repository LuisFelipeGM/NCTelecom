const tiposDeErro = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "tooShort",
  "customError"
];

const mensagens = {
  nome: {
    valueMissing: "O campo de nome não pode estar vazio.",
    patternMismatch: "Por favor, preencha um nome válido.",
    tooShort: "Por favor, preencha um nome válido."
  },
  email: {
    valueMissing: "O campo de e-mail não pode estar vazio.",
    typeMismatch: "Por favor, preencha um email válido.",
    tooShort: "Por favor, preencha um e-mail válido."
  },
  telefone: {
    valueMissing: "O campo de telefone não pode estar vazio.",
    customError: 'Por favor, preencha um telefone válido.'
  },
  cep: {
    valueMissing: "O campo de CEP não pode estar vazio.",
    customError: 'Por favor, preencha um CEP válido.'
  }
}

function maskTelefone(value) {
  return VMasker.toPattern(value, '(99) 9999-9999');
}

function maskCelular(value) {
  return VMasker.toPattern(value, '(99) 99999-9999');
}

function maskCep(value) {
  return VMasker.toPattern(value, '99999-999')
}

function Dados(e) {
  return {
    nome: e.target.elements['nome'].value,
    email:  e.target.elements['email'].value,
    telefone:  e.target.elements['telefone'].value,
    cep:  e.target.elements['cep'].value,
    endereco:  e.target.elements['endereco'].value,
    numero:  e.target.elements['numero'].value
  };
}

// MASCARAS
const telefoneInput = document.getElementById('telefone');
const cepInput = document.getElementById('cep');


document.addEventListener('DOMContentLoaded', function () {

  validaBotaoEnviar(camposDoFormulario);

  telefoneInput.addEventListener('input', function (event) {
    let currentValue = telefoneInput.value.replace(/\D/g, '');

    if (currentValue.length <= 10) {
      telefoneInput.value = maskTelefone(currentValue);
    } else {
      telefoneInput.value = maskCelular(currentValue);
    }

  });

  cepInput.addEventListener('input', function (event) {
    let currentValue = cepInput.value.replace(/\D/g, '');
    cepInput.value = maskCep(currentValue);
  });
});

// VALIDACAO

function validaTelefone(campo) {
  if(campo.id === "telefone" && campo.value != "") {
    let telefone = campo.value.replace(/\D/g, '');
    if (telefone.length <= 10) {
      isValid = telefone.length === 10;
    } else {
      isValid = telefone.length === 11;
    }

    if (!isValid) {
      campo.setCustomValidity("Número de telefone ou celular inválido.");
    } else {
      campo.setCustomValidity("");
    }

  }
}

function validaCEP(campo) {
  if(campo.id === "cep" && campo.value != "") {
    let cep = campo.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      campo.setCustomValidity("CEP inválido.");
    } else {
      campo.setCustomValidity("");
    }
  }
}

function verificaCampo(campo) {
  let mensagem = "";
  campo.setCustomValidity("");
  validaTelefone(campo);
  validaCEP(campo);
  tiposDeErro.forEach(erro => {
    if (campo.validity[erro]) {
      mensagem = mensagens[campo.id][erro];
    }
  });
  const mensagemErro = campo.parentNode.querySelector(".mensagem-erro");
  const validadorDeInput = campo.checkValidity();

  if (!validadorDeInput) {
    mensagemErro.textContent = mensagem;
  } else {
    mensagemErro.textContent = "";
  }
}

function validaBotaoEnviar(camposDoFormulario) {
 const campos = Array.from(camposDoFormulario);
 const botaoEnviar = document.querySelector(".botao-enviar");
 const formularioValido = campos.every(campo => campo.checkValidity());
 botaoEnviar.disabled = !formularioValido;
}

const camposDoFormulario = document.querySelectorAll("[required]");
const formulario = document.querySelector("[data-formulario]");

camposDoFormulario.forEach((campo) => {
  campo.addEventListener("blur", () => {
    verificaCampo(campo);
    validaBotaoEnviar(camposDoFormulario);
  });
  campo.addEventListener("input", () => {
    validaCEP(campo);
    validaBotaoEnviar(camposDoFormulario);
  })
  campo.addEventListener("invalid", evento => {
    evento.preventDefault();
  });
})

formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const dados = Dados(e);
  console.log(dados);
  localStorage.setItem("areaDeCobertura", JSON.stringify(dados));
  alert("Dados Salvos com sucesso!");
});


