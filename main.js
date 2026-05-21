let todosLosPosts = [];
let usuarios = [];
let postActual = null;

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("usernameInput");

const navUsername = document.getElementById("navUsername");
const navAvatar = document.getElementById("navAvatar");

const logoutBtn = document.getElementById("logoutBtn");

const postsGrid = document.getElementById("postsGrid");

const publishBtn = document.getElementById("publishBtn");

const newTitle = document.getElementById("newTitle");
const newBody = document.getElementById("newBody");

const searchInput = document.getElementById("searchInput");

const counter = document.getElementById("counter");

const loader = document.getElementById("loader");

const themeBtn = document.getElementById("themeBtn");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");

const modalTitle = document.getElementById("modalTitle");
const modalUser = document.getElementById("modalUser");
const modalBody = document.getElementById("modalBody");

const modalAvatar = document.getElementById("modalAvatar");
const modalImage = document.getElementById("modalImage");

const commentsContainer = document.getElementById("commentsContainer");

const commentInput = document.getElementById("commentInput");

const commentBtn = document.getElementById("commentBtn");

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar(){

  cargarTema();

  verificarLogin();

  loginBtn.addEventListener("click", login);

  logoutBtn.addEventListener("click", logout);

  publishBtn.addEventListener("click", crearPost);

  searchInput.addEventListener("input", buscarPosts);

  themeBtn.addEventListener("click", cambiarTema);

  modalClose.addEventListener("click", cerrarModal);

  commentBtn.addEventListener("click", agregarComentario);

  window.addEventListener("click", (e) => {

    if(e.target === modal){

      cerrarModal();

    }

  });

  document.addEventListener("keydown", (e) => {

    if(e.key === "Escape"){

      cerrarModal();

    }

  });

}

function verificarLogin(){

  const usuario =
  localStorage.getItem("usuario");

  if(usuario){

    mostrarApp(usuario);

  }

}

function login(){

  const usuario =
  usernameInput.value.trim();

  if(!usuario) return;

  localStorage.setItem(
    "usuario",
    usuario
  );

  mostrarApp(usuario);

}

function mostrarApp(usuario){

  loginScreen.classList.add("hidden");

  app.classList.remove("hidden");

  navUsername.textContent = usuario;

  navAvatar.src =
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${usuario}`;

  cargarDatos();

}

function logout(){

  localStorage.removeItem("usuario");

  location.reload();

}

async function cargarDatos(){

  try{

    const usersResponse =
    await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    usuarios =
    await usersResponse.json();

    const postsResponse =
    await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );

    const posts =
    await postsResponse.json();

    const guardados =
    JSON.parse(
      localStorage.getItem("misPosts")
    ) || [];

    todosLosPosts =
    [...guardados, ...posts];

    loader.classList.add("hidden");

    mostrarPosts(todosLosPosts);

  }catch(error){

    loader.innerHTML =
    "Error cargando datos";

  }

}

function mostrarPosts(posts){

  postsGrid.innerHTML = "";

  counter.textContent =
  `${posts.length} publicaciones`;

  posts.forEach(post => {

    const usuario =
    usuarios.find(
      u => u.id === post.userId
    );

    const nombre =
    usuario?.name || post.author || "Usuario";

    const username =
    usuario?.username || nombre;

    const avatar =
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const imagen =
    `https://picsum.photos/500/300?random=${post.id}`;

    const card =
    document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <img
        src="${imagen}"
        class="card-image"
      >

      <div class="card-content">

        <div class="card-user">

          <img src="${avatar}">

          <div>
            <h4>${nombre}</h4>
            <span>@${username}</span>
          </div>

        </div>

        <h2>${post.title}</h2>

        <p>${post.body}</p>

        <div class="card-buttons">

          <button class="like-btn">
            ❤️ ${post.likes || 0}
          </button>

          <button class="open-btn">
            Ver
          </button>

          <button class="delete-btn">
            Eliminar
          </button>

        </div>

      </div>
    `;

    const likeBtn =
    card.querySelector(".like-btn");

    likeBtn.addEventListener("click", () => {

      post.likes =
      (post.likes || 0) + 1;

      guardarLocal();

      mostrarPosts(todosLosPosts);

    });

    const openBtn =
    card.querySelector(".open-btn");

    openBtn.addEventListener("click", () => {

      abrirModal(
        post,
        avatar,
        imagen,
        nombre
      );

    });

    const deleteBtn =
    card.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {

      eliminarPost(post.id);

    });

    postsGrid.appendChild(card);

  });

}

function crearPost(){

  const titulo =
  newTitle.value.trim();

  const contenido =
  newBody.value.trim();

  if(!titulo || !contenido) return;

  const usuario =
  localStorage.getItem("usuario");

  const nuevoPost = {

    id: Date.now(),

    userId: 999,

    author: usuario,

    title: titulo,

    body: contenido,

    likes: 0,

    comments: []

  };

  todosLosPosts.unshift(nuevoPost);

  guardarLocal();

  mostrarPosts(todosLosPosts);

  newTitle.value = "";

  newBody.value = "";

}

function eliminarPost(id){

  todosLosPosts =
  todosLosPosts.filter(
    post => post.id !== id
  );

  guardarLocal();

  mostrarPosts(todosLosPosts);

}

function buscarPosts(){

  const texto =
  searchInput.value.toLowerCase();

  const filtrados =
  todosLosPosts.filter(post => {

    return (
      post.title.toLowerCase().includes(texto)
      ||
      post.body.toLowerCase().includes(texto)
    );

  });

  mostrarPosts(filtrados);

}

function abrirModal(
  post,
  avatar,
  imagen,
  nombre
){

  postActual = post;

  modal.classList.remove("hidden");

  modalTitle.textContent =
  post.title;

  modalBody.textContent =
  post.body;

  modalUser.textContent =
  nombre;

  modalAvatar.src =
  avatar;

  modalImage.src =
  imagen;

  renderComentarios();

}

function cerrarModal(){

  modal.classList.add("hidden");

}

function agregarComentario(){

  const texto =
  commentInput.value.trim();

  if(!texto) return;

  if(!postActual.comments){

    postActual.comments = [];

  }

  postActual.comments.push(texto);

  guardarLocal();

  renderComentarios();

  commentInput.value = "";

}

function renderComentarios(){

  commentsContainer.innerHTML = "";

  const comentarios =
  postActual.comments || [];

  comentarios.forEach(comment => {

    const div =
    document.createElement("div");

    div.className = "comment";

    div.textContent = comment;

    commentsContainer.appendChild(div);

  });

}

function cambiarTema(){

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "temaOscuro",
    document.body.classList.contains("dark")
  );

}

function cargarTema(){

  const oscuro =
  localStorage.getItem("temaOscuro");

  if(oscuro === "true"){

    document.body.classList.add("dark");

  }

}

function guardarLocal(){

  const personalizados =
  todosLosPosts.filter(
    post => post.userId === 999
  );

  localStorage.setItem(
    "misPosts",
    JSON.stringify(personalizados)
  );

}