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
  if(campo.value != "") {
    let cep = campo.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      campo.setCustomValidity("Por favor, preencha um CEP válido.");
    } else {
      campo.setCustomValidity("");
    }
  } else {
    campo.setCustomValidity("O campo de CEP não pode estar vazio.");
  }
}

function verificaCampo(campo) {
  let mensagem = "";
  campo.setCustomValidity("");
  validaTelefone(campo);
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

function verificaCEP(campo) {
  let mensagem = "";
  campo.setCustomValidity("");
  validaCEP(campo);
  mensagem = campo.validationMessage;

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
const todoOsCamposFoms = document.querySelectorAll("[required]")
const camposDoFormulario = document.querySelectorAll(".forms")
const formulario = document.querySelector("[data-formulario]");

camposDoFormulario.forEach((campo) => {
  campo.addEventListener("blur", () => {
    verificaCampo(campo);
    validaBotaoEnviar(todoOsCamposFoms);
  });
  campo.addEventListener("input", () => {
    validaTelefone(campo);
    validaBotaoEnviar(todoOsCamposFoms);
  })
  campo.addEventListener("invalid", evento => {
    evento.preventDefault();
  });
})

const campoCep = document.querySelector("#cep");
campoCep.addEventListener("blur", () => {
  verificaCEP(campoCep);
  validaBotaoEnviar(todoOsCamposFoms);
});
campoCep.addEventListener("input", () => {
  validaCEP(campoCep);
  validaBotaoEnviar(todoOsCamposFoms);
})


formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const dados = Dados(e);
  console.log(dados);
  localStorage.setItem("areaDeCobertura", JSON.stringify(dados));
  alert("Dados Salvos com sucesso!");
});


