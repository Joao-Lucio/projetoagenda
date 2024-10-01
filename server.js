require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./routes");
const path = require("path");
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const helmet = require("helmet");
const csrf = require("csurf");

// Conectando ao MongoDB
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit("pronto"); // Após se conectar ao MongoDB, emitir um evento 'pronto'
    console.log("Conectado à base de dados.");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

const sessionOptions = session({
  secret: "asasnsasoa sdaseassas bsas fwsrfevasaassaisal sass",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash()); // utilizado para mensagens locais
app.use(helmet()); // O Helmet é para segurança da aplicação, portanto, caso você esteja com um sistema ainda em desenvolvimento, usando urls como "127.0.0.1", "localhost", ele configura os cabeçalhos HTTP de forma a proteger a aplicação de algumas vulnerabilidades conhecidas, como clickjacking, cross-site scripting (XSS), cross-site sniffing, entre outras
app.use(express.urlencoded({ extended: true })); // Dizendo para o express tratar o body da requisição como um objeto
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public"))); // Definindo pasta para os arquivos estáticos como imagens, CSS e JavaScript
app.set("views", path.resolve(__dirname, "src", "views")); // Definindo o diretório de visualização
app.set("view engine", "ejs"); // Especificando o EJS como o mecanismo de criação de modelos
app.use(csrf()); // csrf -> utlizado para geração de token para formulario da pagina
// Proprios Middleware
app.use(middlewareGlobal);
app.use(checkCsrfError); // checa se a req possui o token
app.use(csrfMiddleware); // utlizado para gerar o token e adicionar as rotas
app.use(routes); // Usando um módulo personalizado para manipular as rotas da aplicação

// Ligando o servidor ao escutar que o evento 'pronto' foi emitido
app.on("pronto", () => {
  // Inicia o servidor na porta 3000 e registra uma mensagem no console
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
