import validator from "validator";

export default class Contato {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    const nomeInput = el.querySelector('input[name="nome"]');
    const emailInput = el.querySelector('input[name="email"]');
    const telefoneInput = el.querySelector('input[name="telefone"]');
    if (!nomeInput.value.length) {
      alert("Nome é um campo obrigatório");
      return;
    }
    if (!telefoneInput.value.length && !emailInput.value.length) {
      alert("Pelo menos um contato deve ser enviado: e-mail ou telefone.");
      return;
    }
    if (!validator.isEmail(emailInput.value)) {
      alert("E-mail inválido");
      return;
    }
    el.submit();
  }
}
