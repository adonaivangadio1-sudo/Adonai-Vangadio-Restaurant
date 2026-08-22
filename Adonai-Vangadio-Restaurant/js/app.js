/* =========================================================
   ADONAI VANGADI RESTAURANT
   APP
========================================================= */

(function () {

    "use strict";


    const header =
        document.getElementById("siteHeader");


    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    function handleHeaderScroll() {

        if (!header) return;

        if (window.scrollY > 15) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        {
            passive: true
        }
    );


    handleHeaderScroll();


    /* =====================================================
       FAVORITES VISUAL STATE
    ===================================================== */

    const favoriteButtons =
        document.querySelectorAll(
            ".favorite-button"
        );


    favoriteButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const active =
                    this.classList.toggle("active");

                this.textContent =
                    active ? "♥" : "♡";

            }
        );

    });


    /* =====================================================
       ORDER COUNT
    ===================================================== */

    const orderCount =
        document.getElementById("orderCount");


    function updateOrderCount() {

        if (!orderCount) return;


        const storedOrder =
            localStorage.getItem(
                "avr-order"
            );


        if (!storedOrder) {

            orderCount.textContent = "0";

            return;

        }


        try {

            const order =
                JSON.parse(storedOrder);


            const total =
                Array.isArray(order)
                    ? order.reduce(
                        (sum, item) =>
                            sum + (
                                Number(item.quantity)
                                || 1
                            ),
                        0
                    )
                    : 0;


            orderCount.textContent =
                String(total);


        } catch {

            orderCount.textContent = "0";

        }

    }


    updateOrderCount();


    /* =====================================================
       STORAGE EVENT
    ===================================================== */

    window.addEventListener(
        "storage",
        updateOrderCount
    );


    /* =====================================================
       MOBILE NAV ACTIVE STATE
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    document
        .querySelectorAll(".bottom-nav-item")
        .forEach(item => {

            const href =
                item.getAttribute("href");


            if (
                href &&
                href.endsWith(currentPage)
            ) {

                document
                    .querySelectorAll(
                        ".bottom-nav-item"
                    )
                    .forEach(
                        nav =>
                            nav.classList.remove(
                                "active"
                            )
                    );


                item.classList.add("active");

            }

        });


})();

/* =========================================================
   AVR — CONTADOR GLOBAL DO PEDIDO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof updateAVROrderCounters ===
            "function"
        ) {

            updateAVROrderCounters();

        }

    }
);


/* =========================================================
   AVR — GALERIA INTELIGENTE
   ADICIONAR NO FINAL DO app.js
========================================================= */

(function () {

    "use strict";


    function iniciarGaleria() {

        const galleryGrid =
            document.querySelector(".gallery-grid");

        const filterButtons =
            document.querySelectorAll(".gallery-filter");


        if (!galleryGrid || !filterButtons.length) {
            return;
        }


        /* =====================================================
           CAMINHO DAS IMAGENS
        ===================================================== */

        const galleryPath =
            "../assets/images/gallery/";


        /* =====================================================
           BASE DE IMAGENS

           Os nomes correspondem exatamente aos arquivos
           existentes na pasta gallery.
        ===================================================== */

        const imagens = [

            /* ================= PRATOS ================= */

            {
                arquivo: "prato.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-1.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-2.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-3.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-4.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-5.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-6.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-7.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-8.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-9.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-10.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-11.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-12.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-13.png",
                categoria: "pratos"
            },

            {
                arquivo: "prato-14.png",
                categoria: "pratos"
            },


            /* ================= SABORES ================= */

            {
                arquivo: "sabores.png",
                categoria: "sabores"
            },

            {
                arquivo: "sabores-2.png",
                categoria: "sabores"
            },

            {
                arquivo: "sabores-3.png",
                categoria: "sabores"
            },


            /* ================= AMBIENTE ================= */

            {
                arquivo: "ambiente.png",
                categoria: "ambiente"
            },

            {
                arquivo: "ambiente-2.png",
                categoria: "ambiente"
            },


            /* ================= EXPERIÊNCIA ================= */

            {
                arquivo: "experiencia.png",
                categoria: "experiencia"
            },

            {
                arquivo: "experiencia-2.png",
                categoria: "experiencia"
            },


            /* ================= DETALHES ================= */

            {
                arquivo: "detalhes.png",
                categoria: "detalhes"
            },

            {
                arquivo: "detalhes-2.png",
                categoria: "detalhes"
            },

            {
                arquivo: "detalhes-3.png",
                categoria: "detalhes"
            }

        ];


        /* =====================================================
           NOMES DAS CATEGORIAS
        ===================================================== */

        const nomesCategorias = {

            pratos: "Pratos",

            sabores: "Sabores",

            experiencia: "Experiência",

            ambiente: "Ambiente",

            detalhes: "Detalhes"

        };


        /* =====================================================
           CORRIGIR / ORGANIZAR OS BOTÕES
        ===================================================== */

        const nomesBotoes = [

            "Todos",
            "Pratos",
            "Sabores",
            "Experiência",
            "Ambiente",
            "Detalhes"

        ];


        filterButtons.forEach(function (button, index) {

            if (nomesBotoes[index]) {

                button.textContent =
                    nomesBotoes[index];

            }

        });


        /* =====================================================
           DESCOBRIR A CATEGORIA DO BOTÃO
        ===================================================== */

        function obterCategoria(button) {

            const texto =
                button.textContent
                    .trim()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");


            if (texto === "todos") {
                return "todos";
            }

            if (texto === "pratos") {
                return "pratos";
            }

            if (texto === "sabores") {
                return "sabores";
            }

            if (texto === "experiencia") {
                return "experiencia";
            }

            if (texto === "ambiente") {
                return "ambiente";
            }

            if (texto === "detalhes") {
                return "detalhes";
            }

            return "todos";

        }


        /* =====================================================
           CRIAR CARD
        ===================================================== */

        function criarCard(item) {

            const card =
                document.createElement("article");


            card.className =
                "gallery-card";


            card.dataset.category =
                item.categoria;


            const placeholder =
                document.createElement("div");


            placeholder.className =
                "gallery-placeholder";


            const imagem =
                document.createElement("img");


            imagem.src =
                galleryPath + item.arquivo;


            imagem.alt =
                nomesCategorias[item.categoria]
                + " — AVR";


            imagem.loading =
                "lazy";


            imagem.decoding =
                "async";


            const label =
                document.createElement("span");


            label.className =
                "gallery-card-label";


            label.textContent =
                nomesCategorias[item.categoria];


            placeholder.appendChild(imagem);

            placeholder.appendChild(label);

            card.appendChild(placeholder);


            return card;

        }


        /* =====================================================
           MOSTRAR GALERIA
        ===================================================== */

        function mostrarGaleria(categoria) {

            galleryGrid.innerHTML = "";


            const resultados =
                categoria === "todos"

                    ? imagens

                    : imagens.filter(function (item) {

                        return item.categoria === categoria;

                    });


            if (!resultados.length) {

                const vazio =
                    document.createElement("div");

                vazio.className =
                    "gallery-empty";

                vazio.textContent =
                    "Nenhuma imagem disponível.";

                galleryGrid.appendChild(vazio);

                return;
            }


            resultados.forEach(function (item) {

                galleryGrid.appendChild(
                    criarCard(item)
                );

            });


            /* Voltar para o início da faixa
               quando mudar de categoria */

            galleryGrid.scrollTo({

                left: 0,

                behavior: "smooth"

            });

        }


        /* =====================================================
           ESTADO INICIAL
        ===================================================== */

        filterButtons.forEach(function (button) {

            button.classList.remove("active");

        });


        if (filterButtons[0]) {

            filterButtons[0].classList.add("active");

        }


        mostrarGaleria("todos");


        /* =====================================================
           CLIQUE NOS BOTÕES
        ===================================================== */

        filterButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const categoria =
                        obterCategoria(button);


                    mostrarGaleria(
                        categoria
                    );

                }
            );

        });

    }


    /* =========================================================
       INICIALIZAÇÃO
    ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarGaleria
        );

    } else {

        iniciarGaleria();

    }

})();

/* =========================================================
   AVR — GALERIA DA PÁGINA INICIAL
   CARREGAMENTO DAS IMAGENS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const galleryImages = [
        {
            selector: ".gallery-grid .gallery-item:nth-child(1) img",
            src: "experiencia.jpg",
            alt: "Prato do Adonai Vangadio Restaurant"
        },

        {
            selector: ".gallery-grid .gallery-item:nth-child(2) img",
            src: "ambiente.jpg",
            alt: "Ambiente do Adonai Vangadio Restaurant"
        },

        {
            selector: ".gallery-grid .gallery-item:nth-child(3) img",
            src: "sabores.jpg",
            alt: "Sabores do Adonai Vangadio Restaurant"
        },

        {
            selector: ".gallery-grid .gallery-item:nth-child(4) img",
            src: "detales.jpg",
            alt: "Detalhes do Adonai Vangadio Restaurant"
        }
    ];


    galleryImages.forEach(function (imageData) {

        const image = document.querySelector(imageData.selector);

        if (!image) {
            return;
        }

        const imageLoader = new Image();

        imageLoader.onload = function () {

            image.src = imageData.src;
            image.alt = imageData.alt;

            image.classList.add("gallery-image-loaded");

        };

        imageLoader.onerror = function () {

            console.warn(
                "AVR — Não foi possível carregar a imagem:",
                imageData.src
            );

        };

        imageLoader.src = imageData.src;

    });

});

/* =========================================================
   AVR — LOGO DA EXPERIÊNCIA
   Insere o logo automaticamente na secção "A NOSSA ESSÊNCIA"
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const experienceImage =
        document.querySelector(".experience-section .experience-image");

    if (!experienceImage) return;

    /* Evita duplicar o logo */
    if (experienceImage.querySelector(".avr-experience-logo")) return;

    /* Criar imagem */
    const logo = document.createElement("img");

    logo.className = "avr-experience-logo";

    logo.src = "assets/images/logo/logo.png";

    logo.alt = "Adonai Vangadio Restaurant";

    logo.loading = "lazy";

    /* Inserir */
    experienceImage.appendChild(logo);

});
            
/* =========================================================
   AVR — POPULARES
   populares.js

   Sistema inteligente dos botões "+"
   da seção "Mais populares".

   NÃO ALTERA:
   - pedidos.js
   - pratos.js
   - armazenamento.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEY = "avr_pedido";


    /* =====================================================
       LER PEDIDO
    ===================================================== */

    function getOrder() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return [];
            }

            const order =
                JSON.parse(saved);

            return Array.isArray(order)
                ? order
                : [];

        } catch (error) {

            console.error(
                "AVR — Erro ao ler pedido:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       GUARDAR PEDIDO
    ===================================================== */

    function saveOrder(order) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(order)
        );

    }


    /* =====================================================
       ATUALIZAR CONTADOR DO PEDIDO
    ===================================================== */

    function updateOrderCount(order) {

        const orderCount =
            document.getElementById("orderCount");

        if (!orderCount) {
            return;
        }

        const totalQuantity =
            order.reduce(
                (total, item) => {

                    return total +
                        Number(item.quantity || 1);

                },
                0
            );

        orderCount.textContent =
            totalQuantity;

    }


    /* =====================================================
       FEEDBACK VISUAL
    ===================================================== */

    function buttonFeedback(button) {

        const originalText =
            button.textContent;

        button.textContent = "✓";

        button.classList.add(
            "added"
        );

        setTimeout(() => {

            button.textContent =
                originalText;

            button.classList.remove(
                "added"
            );

        }, 700);

    }


    /* =====================================================
       ADICIONAR POPULAR AO PEDIDO
    ===================================================== */

    function addPopularToOrder(button) {

        const card =
            button.closest(
                ".popular-card"
            );

        if (!card) {
            return;
        }


        /* =================================================
           DADOS DO PRODUTO
        ================================================= */

        const id =
            button.dataset.id;

        const name =
            button.dataset.product;

        const price =
            Number(
                button.dataset.price || 0
            );


        if (!id || !name || !price) {

            console.error(
                "AVR — Dados incompletos do prato popular.",
                {
                    id,
                    name,
                    price
                }
            );

            return;

        }


        /* =================================================
           IMAGEM
           
           PRIMEIRO usa o data-image do botão.
           
           Exemplo:
           data-image="../assets/images/restaurant/arroz.png"
           
           Se não existir, tenta encontrar a imagem
           dentro do card como alternativa.
        ================================================= */

        const imageFromButton =
            button.dataset.image || "";


        const imageElement =
            card.querySelector(
                ".popular-image img"
            );


        const imageFromCard =
            imageElement?.getAttribute(
                "src"
            ) || "";


        const image =
            imageFromButton ||
            imageFromCard ||
            "";


        /* =================================================
           CATEGORIA
        ================================================= */

        const categoryElement =
            card.querySelector(
                ".dish-category"
            );

        const category =
            categoryElement?.textContent
                .trim() || "AVR";


        /* =================================================
           DESCRIÇÃO
           
           Caso futuramente exista uma descrição
           dentro do card, ela será aproveitada.
        ================================================= */

        const descriptionElement =
            card.querySelector(
                ".popular-description"
            );

        const description =
            descriptionElement?.textContent
                .trim() || "";


        /* =================================================
           PEDIDO ATUAL
        ================================================= */

        const order =
            getOrder();


        /* =================================================
           PROCURAR SE JÁ EXISTE
           
           O ID é o identificador principal.
        ================================================= */

        const existingItem =
            order.find(
                item => item.id === id
            );


        /* =================================================
           JÁ EXISTE
           
           Apenas aumenta a quantidade.
        ================================================= */

        if (existingItem) {

            existingItem.quantity =
                Number(
                    existingItem.quantity || 1
                ) + 1;


            /* =================================================
               MELHORIA:
               Se o produto antigo não tinha imagem,
               agora adicionamos a imagem do botão.
            ================================================= */

            if (!existingItem.image && image) {

                existingItem.image =
                    image;

            }

        }


        /* =================================================
           NÃO EXISTE
           
           Criamos um novo item.
        ================================================= */

        else {

            order.push({

                id: id,

                name: name,

                price: price,

                image: image,

                category: category,

                description: description,

                quantity: 1

            });

        }


        /* =================================================
           GUARDAR
        ================================================= */

        saveOrder(order);


        /* =================================================
           ATUALIZAR CONTADOR
        ================================================= */

        updateOrderCount(order);


        /* =================================================
           FEEDBACK
        ================================================= */

        buttonFeedback(button);


        console.log(
            "AVR — Produto adicionado:",
            order
        );

    }


    /* =====================================================
       EVENTO DOS BOTÕES "+"
    ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".popular-card .add-order-btn"
                );

            if (!button) {
                return;
            }

            event.preventDefault();

            addPopularToOrder(
                button
            );

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
       
       Se já houver produtos no pedido,
       mostra a quantidade correta.
    ===================================================== */

    updateOrderCount(
        getOrder()
    );

});