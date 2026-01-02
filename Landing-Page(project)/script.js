function entrar() {
    const id = document.getElementById("inputId").value.trim();

    if (!id) {
        alert("Por favor, digite um ID.");
        return;
    }

    localStorage.setItem("currentUserId", id);
    window.location.href = "perfil.html";
}


function gerarAvatarDataURL(nome) {
    const iniciais = nome.trim()
        ? nome.trim().split(" ").map(p => p[0].toUpperCase()).join("").slice(0, 2)
        : "?";

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const cores = [
        "#5A7D9A", "#E07A5F", "#3D405B",
        "#81B29A", "#F2CC8F", "#457B9D",
        "#1D3557", "#E63946", "#6A4C93"
    ];

    const corFundo = cores[Math.floor(Math.random() * cores.length)];

    ctx.fillStyle = corFundo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    const fontSize = Math.floor(canvas.width * 0.45);
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(iniciais, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
}


function iniciarPerfil() {
    const id = localStorage.getItem("currentUserId");
    if (!id) return;

    const nome = localStorage.getItem(id + "_nome");
    const idade = localStorage.getItem(id + "_idade");
    const email = localStorage.getItem(id + "_email");
    const tema = localStorage.getItem(id + "_tema");
    const corFonte = localStorage.getItem(id + "_cor_fonte");
    const foto = localStorage.getItem(id + "_foto");
    const fotoIsUpload = localStorage.getItem(id + "_foto_is_upload");

    if (nome) document.getElementById("nome").value = nome;
    if (idade) document.getElementById("idade").value = idade;
    if (email) document.getElementById("email").value = email;

    if (tema) {
        document.getElementById("tema").value = tema;
        document.body.className = (tema === "dark") ? "dark-theme" : "light-theme";
    }

    if (corFonte) {
        document.getElementById("corFonte").value = corFonte;
        document.getElementById("card").style.color = corFonte;
    }

    const imgEl = document.getElementById("fotoUsuario");

    if (foto) {
        if (foto.startsWith("data:image")) {
            imgEl.src = foto;
        } else {
            imgEl.src = "pictures/" + foto;
        }
    } else {
        const avatar = gerarAvatarDataURL(nome || "");
        imgEl.src = avatar;
        localStorage.setItem(id + "_foto", avatar);
        localStorage.setItem(id + "_foto_is_upload", "0");
    }

    if (foto && !foto.startsWith("data:image")) {
        document.getElementById("foto").value = foto;
    } else {
        document.getElementById("foto").value = "";
    }
}


function cadastrar() {
    const id = localStorage.getItem("currentUserId");
    if (!id) {
        alert("Nenhum usuário logado.");
        return;
    }

    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const email = document.getElementById("email").value;
    const tema = document.getElementById("tema").value;
    const corFonte = document.getElementById("corFonte").value;

    let fotoSalva = localStorage.getItem(id + "_foto");
    if (!fotoSalva) {
        fotoSalva = gerarAvatarDataURL(nome);
        localStorage.setItem(id + "_foto", fotoSalva);
        localStorage.setItem(id + "_foto_is_upload", "0");
    }

    localStorage.setItem(id + "_nome", nome);
    localStorage.setItem(id + "_idade", idade);
    localStorage.setItem(id + "_email", email);
    localStorage.setItem(id + "_tema", tema);
    localStorage.setItem(id + "_cor_fonte", corFonte);

    mudarTema();
    alert("Dados salvos com sucesso!");
}


function mudarTema() {
    const tema = document.getElementById("tema").value;
    const corFonte = document.getElementById("corFonte").value;

    document.body.className = (tema === "dark") ? "dark-theme" : "light-theme";
    document.getElementById("card").style.color = corFonte;
}

function sair() {
    alert("Volte Sempre!");
    localStorage.removeItem("currentUserId");
    window.location.href = "index.html";
}


function selecionarFoto() {
    document.getElementById("inputFileFoto").click();
}

function carregarFoto(event) {
    const arquivo = event.target.files[0];
    const id = localStorage.getItem("currentUserId");
    if (!arquivo || !id) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const dataURL = e.target.result; 
        document.getElementById("fotoUsuario").src = dataURL;
        localStorage.setItem(id + "_foto", dataURL);
        localStorage.setItem(id + "_foto_is_upload", "1");

        
        document.getElementById("foto").value = arquivo.name;
    };

    reader.readAsDataURL(arquivo);
}



document.addEventListener("DOMContentLoaded", () => {
    const nomeInput = document.getElementById("nome");
    if (!nomeInput) return;

    nomeInput.addEventListener("input", () => {
        const nome = nomeInput.value;
        const id = localStorage.getItem("currentUserId");
        if (!id) return;

        const fotoIsUpload = localStorage.getItem(id + "_foto_is_upload");
        if (fotoIsUpload === "1") {
            return;
        }

        
        const avatar = gerarAvatarDataURL(nome);
        document.getElementById("fotoUsuario").src = avatar;
        localStorage.setItem(id + "_foto", avatar);
        localStorage.setItem(id + "_foto_is_upload", "0");
    });
});