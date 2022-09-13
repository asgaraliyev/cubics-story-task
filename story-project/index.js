const database = {
  users: [
    {
      id: 1,
      username: "asgaraliyev",
      password: "asgaraliyev",
    },
    {
      id: 2,
      username: "ferid",
      password: "ferid",
    },
  ],
  posts: [],
  archive: [],
};
function generateRandomId() {
  return Math.floor(Math.random() * 9999);
}
function showEl(el) {
  el.classList.remove("hidden");
}
function getHumanReadableDate(date) {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  return dateTimeFormat.format(date);
}
function hideEl(el) {
  el.classList.add("hidden");
}
function currentUser() {
  const id = parseInt(localStorage.getItem("user_id"));
  if (!id) return undefined;
  return database.users.find((user) => user.id === id);
}
function renderMyArchive() {
  const postsEl = document.querySelector("#my-arechive");
  postsEl.innerHTML = "";
  const crrUser = currentUser();
  const arr = database.archive.filter((post) => post.userId === crrUser.id);
  if (!arr.length) {
    postsEl.innerHTML = `<h1>No result</h1>`;
    return;
  }
  arr.map((post) => {
    postsEl.innerHTML += createPostHtml(post);
  });
}
function createPostHtml(post) {
  return `
    <li class="flex m-10 column">
    <h3>${post.title}</h3>
    <p><strong>Yaranma tarixi</strong> ${getHumanReadableDate(
      post.createdAt
    )}</p>
    <p><strong>Bitme tarixi</strong>${getHumanReadableDate(post.date)}</p>

  </li>
      `;
}
function renderPosts() {
  const postsEl = document.querySelector("#posts-area");
  postsEl.innerHTML = "";
  const crrUser = currentUser();
  const arr = database.posts;
  if (!arr.length) {
    postsEl.innerHTML = `<h1>No result</h1>`;
    return;
  }
  arr.map((post) => {
    postsEl.innerHTML += createPostHtml(post);
  });
}
function render() {
  hideEl(document.querySelector("#login-btn"));
  hideEl(document.querySelector("#logout-btn"));
  hideEl(document.querySelector("#show-my-archive"));
  hideEl(document.querySelector("#show-add-area"));
  hideEl(document.querySelector("#posts-area"));
  hideEl(document.querySelector("#my-arechive"));
  hideEl(document.querySelector("#login-form"));
  hideEl(document.querySelector("#show-posts-area"));
  hideEl(document.querySelector("#add-form"));
  const crrUser = currentUser();
  if (crrUser) {
    // user login olub onsuzda
    showEl(document.querySelector("#logout-btn"));
    showEl(document.querySelector("#show-add-area"));
    showEl(document.querySelector("#show-my-archive"));
    showEl(document.querySelector("#show-posts-area"));
    renderPosts();
    renderMyArchive();
  } else {
    //user login olmayib
    showEl(document.querySelector("#login-form"));
    showEl(document.querySelector("#login-btn"));
  }
}

document.querySelector("#login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const credentials = {};
  credentials.username = e.target.username.value.trim();
  credentials.password = e.target.password.value.trim();
  const user = database.users.find(
    (user) =>
      user.username === credentials.username &&
      user.password === credentials.password
  );
  if (user?.id) {
    localStorage.setItem("user_id", user.id);
    render();
    showEl(document.querySelector("#posts-area"));
  } else {
    alert("user tapilmadi");
  }
});
function hideMainArea() {
  hideEl(document.querySelector("#login-form"));
  hideEl(document.querySelector("#posts-area"));
  hideEl(document.querySelector("#add-form"));
  hideEl(document.querySelector("#my-arechive"));
}

document.querySelector("#show-add-area").addEventListener("click", function () {
  hideMainArea();
  showEl(document.querySelector("#add-form"));
});
document
  .querySelector("#show-my-archive")
  .addEventListener("click", function () {
    hideMainArea();
    render();
    showEl(document.querySelector("#my-arechive"));
  });
document
  .querySelector("#show-posts-area")
  .addEventListener("click", function () {
    hideMainArea();
    showEl(document.querySelector("#posts-area"));
    renderMyArchive();
  });
document.querySelector("#logout-btn").addEventListener("click", function () {
  if (confirm("Siz eminsiniz")) {
    localStorage.removeItem("user_id");
    render();
  }
});
function addPost(post) {
  post.userId = currentUser().id;
  database.posts.push(post);
  setTimeout(() => {
    database.archive.push(post);
    database.posts = database.posts.filter((p) => p.id !== post.id);
    if(currentUser()){
        render();
        showEl(document.querySelector("#posts-area"));
    }
    console.log("archive atildi");
  }, post.date - post.createdAt);

  
}
document.querySelector("#add-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {
    id: generateRandomId(),
  };
  data.createdAt = new Date();
  data.title = e.target.title.value.trim();
  data.endDate = e.target.endDate.value.trim();
  data.endTime = e.target.endTime.value.trim();
  data.date = new Date(`${data.endDate} ${data.endTime}`);
  let isValid = data.title && data.date;
  if (!isValid) {
    alert("Melumatlar duzgun deyil");
    return;
  }else{
      e.target.reset()
  }

  //   delete data.endDate;
  //   delete data.endTime;
  addPost(data);
  render();
  showEl(document.querySelector("#posts-area"));
});
render();
showEl(document.querySelector("#posts-area"));
