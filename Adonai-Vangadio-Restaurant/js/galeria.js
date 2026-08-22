Olha, o código que você tem que melhorar é esse. Todas as seções estão a abrir, menos a do... a do... a do todos. A do todos não. A do todos não. Não pegou essa nova arquitetura, esse novo design dos outros. Então o que você tem que fazer? Tens que melhorar esse a ponto de quando eu apertar também no todos, ou seja, logo que eu entrar no galeria, no todos está a abrir, mas quando eu aperto no prato, vai no prato. volto para galeria, o galeria já não funciona. fica sempre no prato. Então resolva isso. Não mexa nas outras que já esto a funcionar.

/* =========================================================
   AVR — GALERIA UNIFICADA
   INDEX + PÁGINA GALERIA
   COLAR NO FINAL DO app.js

   - Index: galeria horizontal
   - Galeria: filtros + categorias horizontais
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DETECTAR PÁGINA
    ===================================================== */

    const isGalleryPage =
        document.querySelector(".gallery-page");

    const isHomeGallery =
        !isGalleryPage &&
        document.querySelector(
            'main .gallery-section .gallery-grid'
        );


    /* =====================================================
       =====================================================
       1. GALERIA DA PÁGINA INICIAL — INDEX
       =====================================================
       ===================================================== */

    if (isHomeGallery) {

        const homeGallery =
            document.querySelector(
                'main .gallery-section .gallery-grid'
            );


        if (homeGallery) {

            /*
             * IMPORTANTE:
             * Não substituímos as imagens.
             * O HTML do index já possui os caminhos corretos.
             * Apenas transformamos a galeria em uma faixa
             * horizontal com scroll.
             */

            const homeStyle =
                document.createElement("style");

            homeStyle.id =
                "avr-home-gallery-horizontal";


            homeStyle.textContent = `

                /* =========================================
                   AVR MOMENTS — GALERIA DO INDEX
                ========================================= */

                main .gallery-section .gallery-grid {

                    display: flex !important;

                    flex-wrap: nowrap !important;

                    gap: 16px;

                    width: 100%;

                    overflow-x: auto !important;

                    overflow-y: hidden;

                    padding:
                        4px 2px 16px;

                    scroll-snap-type:
                        x proximity;

                    scrollbar-width: thin;

                    -webkit-overflow-scrolling:
                        touch;

                    overscroll-behavior-x:
                        contain;

                }


                /* =========================================
                   CADA FOTO
                ========================================= */

                main .gallery-section
                .gallery-grid
                .gallery-item {

                    flex:
                        0 0 280px !important;

                    width: 280px !important;

                    height: 350px;

                    min-width: 280px;

                    scroll-snap-align:
                        start;

                    overflow: hidden;

                    border-radius: 18px;

                    display: block;

                }


                /* =========================================
                   IMAGENS
                ========================================= */

                main .gallery-section
                .gallery-grid
                .gallery-item img {

                    width: 100%;

                    height: 100%;

                    object-fit: cover;

                    display: block;

                    transition:
                        transform .45s ease;

                }


                main .gallery-section
                .gallery-grid
                .gallery-item:hover img {

                    transform:
                        scale(1.04);

                }


                /* =========================================
                   TELEMÓVEL
                ========================================= */

                @media (max-width: 600px) {

                    main .gallery-section
                    .gallery-grid {

                        gap: 12px;

                        padding-right:
                            20px;

                    }


                    main .gallery-section
                    .gallery-grid
                    .gallery-item {

                        flex:
                            0 0 78vw !important;

                        width:
                            78vw !important;

                        min-width:
                            78vw;

                        height:
                            58vw;

                        min-height:
                            230px;

                        max-height:
                            340px;

                        border-radius:
                            16px;

                    }

                }

            `;


            document.head.appendChild(
                homeStyle
            );


            /* =========================================
               ARRASTAR COM O MOUSE NO COMPUTADOR
            ========================================= */

            let isDown = false;
            let startX = 0;
            let scrollStart = 0;


            homeGallery.addEventListener(
                "mousedown",
                function (event) {

                    isDown = true;

                    startX =
                        event.pageX -
                        homeGallery.offsetLeft;

                    scrollStart =
                        homeGallery.scrollLeft;

                    homeGallery.style.cursor =
                        "grabbing";

                }
            );


            homeGallery.addEventListener(
                "mouseleave",
                function () {

                    isDown = false;

                    homeGallery.style.cursor =
                        "";

                }
            );


            homeGallery.addEventListener(
                "mouseup",
                function () {

                    isDown = false;

                    homeGallery.style.cursor =
                        "";

                }
            );


            homeGallery.addEventListener(
                "mousemove",
                function (event) {

                    if (!isDown) {
                        return;
                    }


                    event.preventDefault();


                    const currentX =
                        event.pageX -
                        homeGallery.offsetLeft;


                    const distance =
                        (currentX - startX) * 1.15;


                    homeGallery.scrollLeft =
                        scrollStart - distance;

                }
            );

        }

    }


    /* =====================================================
       =====================================================
       2. PÁGINA GALERIA
       =====================================================
       ===================================================== */

    if (!isGalleryPage) {
        return;
    }


    const galleryPage =
        isGalleryPage;


    const filterContainer =
        galleryPage.querySelector(
            ".gallery-filters"
        );


    const galleryGrid =
        galleryPage.querySelector(
            ".gallery-grid"
        );


    if (!filterContainer || !galleryGrid) {
        return;
    }


    /* =====================================================
       CAMINHO DAS FOTOGRAFIAS
    ===================================================== */

    const IMAGE_PATH =
        "../assets/images/gallery/";


    /* =====================================================
       FOTOGRAFIAS
    ===================================================== */

    const galleryData = {

        pratos: {

            label: "Pratos",

            images: [

                "prato.png",
                "prato-1.png",
                "prato-2.png",
                "prato-3.png",
                "prato-4.png",
                "prato-5.png",
                "prato-6.png",
                "prato-7.png",
                "prato-8.png",
                "prato-9.png",
                "prato-10.png",
                "prato-11.png",
                "prato-12.png",
                "prato-13.png",
                "prato-14.png"

            ]

        },


        sabores: {

            label: "Sabores",

            images: [

                "saborea.png",
                "sabores-2.png",
                "sabores-3.png"

            ]

        },


        experiencia: {

            label: "Experiência",

            images: [

                "experiencia.png",
                "experiencia-2.png"

            ]

        },


        ambiente: {

            label: "Ambiente",

            images: [

                "ambiente.png",
                "ambiente-2.png"

            ]

        },


        detalhes: {

            label: "Detalhes",

            images: [

                "detalhes.png",
                "detalhes-2.png",
                "detalhes-3.png"

            ]

        }

    };


    /* =====================================================
       BOTÕES
    ===================================================== */

    filterContainer.innerHTML = "";


    const filters = [

        {
            key: "todos",
            label: "Todos"
        },

        {
            key: "pratos",
            label: "Pratos"
        },

        {
            key: "sabores",
            label: "Sabores"
        },

        {
            key: "experiencia",
            label: "Experiência"
        },

        {
            key: "ambiente",
            label: "Ambiente"
        },

        {
            key: "detalhes",
            label: "Detalhes"
        }

    ];


    filters.forEach(
        function (item, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "gallery-filter";


            button.dataset.galleryFilter =
                item.key;


            button.textContent =
                item.label;


            if (index === 0) {

                button.classList.add(
                    "active"
                );

            }


            filterContainer.appendChild(
                button
            );

        }
    );


    /* =====================================================
       CSS DA GALERIA
    ===================================================== */

    const galleryStyle =
        document.createElement("style");


    galleryStyle.id =
        "avr-gallery-unified-style";


    galleryStyle.textContent = `

        /* ================================================
           FILTROS
        ================================================ */

        .gallery-page .gallery-filters {

            display: flex;

            flex-wrap: nowrap;

            gap: 10px;

            overflow-x: auto;

            overflow-y: hidden;

            scrollbar-width: none;

            -webkit-overflow-scrolling:
                touch;

            padding-bottom: 8px;

        }


        .gallery-page
        .gallery-filters::-webkit-scrollbar {

            display: none;

        }


        .gallery-page
        .gallery-filter {

            flex:
                0 0 auto;

            white-space:
                nowrap;

            cursor:
                pointer;

        }


        /* ================================================
           CADA CATEGORIA
        ================================================ */

        .avr-gallery-category {

            width: 100%;

            margin-bottom: 42px;

        }


        .avr-gallery-category-header {

            display: flex;

            align-items: center;

            justify-content:
                space-between;

            gap: 15px;

            margin-bottom:
                15px;

        }


        .avr-gallery-category-title {

            margin: 0;

            font-size:
                1.15rem;

            font-weight:
                600;

        }


        .avr-gallery-category-count {

            font-size:
                .78rem;

            opacity:
                .55;

            white-space:
                nowrap;

        }


        /* ================================================
           FAIXA HORIZONTAL
        ================================================ */

        .avr-gallery-track {

            display: flex;

            flex-wrap: nowrap;

            gap: 16px;

            width: 100%;

            overflow-x: auto;

            overflow-y: hidden;

            padding:
                4px 2px 14px;

            scroll-snap-type:
                x proximity;

            scrollbar-width:
                thin;

            -webkit-overflow-scrolling:
                touch;

            overscroll-behavior-x:
                contain;

        }


        /* ================================================
           CARTÕES
        ================================================ */

        .avr-gallery-card {

            position:
                relative;

            flex:
                0 0 280px;

            width:
                280px;

            height:
                350px;

            overflow:
                hidden;

            border-radius:
                18px;

            background:
                #111;

            scroll-snap-align:
                start;

        }


        .avr-gallery-card img {

            display:
                block;

            width:
                100%;

            height:
                100%;

            object-fit:
                cover;

            transition:
                transform .45s ease;

        }


        .avr-gallery-card:hover img {

            transform:
                scale(1.045);

        }


        .avr-gallery-card::after {

            content: "";

            position:
                absolute;

            inset:
                0;

            pointer-events:
                none;

            background:
                linear-gradient(
                    to top,
                    rgba(0,0,0,.58),
                    transparent 50%
                );

        }


        .avr-gallery-number {

            position:
                absolute;

            z-index:
                2;

            left:
                14px;

            bottom:
                12px;

            color:
                #fff;

            font-size:
                .75rem;

            font-weight:
                600;

        }


        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 600px) {

            .avr-gallery-track {

                gap:
                    12px;

                padding-right:
                    20px;

            }


            .avr-gallery-card {

                flex:
                    0 0 76vw;

                width:
                    76vw;

                height:
                    58vw;

                min-height:
                    230px;

                max-height:
                    340px;

                border-radius:
                    16px;

            }

        }

    `;


    document.head.appendChild(
        galleryStyle
    );


    /* =====================================================
       CRIAR FOTO
    ===================================================== */

    function createCard(
        imageName,
        categoryName,
        index
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "avr-gallery-card";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            IMAGE_PATH +
            imageName;


        image.alt =
            categoryName +
            " AVR — fotografia " +
            (index + 1);


        image.loading =
            "lazy";


        image.addEventListener(
            "error",
            function () {

                card.remove();

            }
        );


        const number =
            document.createElement(
                "span"
            );


        number.className =
            "avr-gallery-number";


        number.textContent =
            String(index + 1)
                .padStart(2, "0");


        card.appendChild(
            image
        );


        card.appendChild(
            number
        );


        return card;

    }


    /* =====================================================
       CRIAR CATEGORIA
    ===================================================== */

    function createCategory(
        key,
        data
    ) {

        const section =
            document.createElement(
                "section"
            );


        section.className =
            "avr-gallery-category";


        section.dataset.category =
            key;


        const header =
            document.createElement(
                "div"
            );


        header.className =
            "avr-gallery-category-header";


        const title =
            document.createElement(
                "h3"
            );


        title.className =
            "avr-gallery-category-title";


        title.textContent =
            data.label;


        const count =
            document.createElement(
                "span"
            );


        count.className =
            "avr-gallery-category-count";


        count.textContent =
            data.images.length +
            (
                data.images.length === 1
                    ? " fotografia"
                    : " fotografias"
            );


        header.appendChild(
            title
        );


        header.appendChild(
            count
        );


        const track =
            document.createElement(
                "div"
            );


        track.className =
            "avr-gallery-track";


        data.images.forEach(
            function (imageName, index) {

                track.appendChild(
                    createCard(
                        imageName,
                        data.label,
                        index
                    )
                );

            }
        );


        section.appendChild(
            header
        );


        section.appendChild(
            track
        );


        return section;

    }


    /* =====================================================
       TODOS
       
       MOSTRA TODAS AS CATEGORIAS
    ===================================================== */

    function showAll() {

        galleryGrid.innerHTML = "";


        Object.entries(
            galleryData
        ).forEach(
            function ([key, data]) {

                galleryGrid.appendChild(
                    createCategory(
                        key,
                        data
                    )
                );

            }
        );


        enableDragging();

    }


    /* =====================================================
       UMA CATEGORIA
    ===================================================== */

    function showCategory(
        key
    ) {

        galleryGrid.innerHTML = "";


        const data =
            galleryData[key];


        if (!data) {

            showAll();

            return;

        }


        galleryGrid.appendChild(
            createCategory(
                key,
                data
            )
        );


        enableDragging();

    }


    /* =====================================================
       FUNCIONAMENTO DOS BOTÕES
    ===================================================== */

    filterContainer.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".gallery-filter"
                );


            if (!button) {
                return;
            }


            filterContainer
                .querySelectorAll(
                    ".gallery-filter"
                )
                .forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


            button.classList.add(
                "active"
            );


            const key =
                button.dataset.galleryFilter;


            if (key === "todos") {

                showAll();

            } else {

                showCategory(
                    key
                );

            }

        }
    );


    /* =====================================================
       ARRASTAR COM MOUSE
    ===================================================== */

    function enableDragging() {

        const tracks =
            galleryGrid.querySelectorAll(
                ".avr-gallery-track"
            );


        tracks.forEach(
            function (track) {

                let pressed =
                    false;

                let startX =
                    0;

                let initialScroll =
                    0;


                track.addEventListener(
                    "mousedown",
                    function (event) {

                        pressed =
                            true;

                        startX =
                            event.pageX -
                            track.offsetLeft;

                        initialScroll =
                            track.scrollLeft;

                        track.style.cursor =
                            "grabbing";

                    }
                );


                track.addEventListener(
                    "mouseup",
                    function () {

                        pressed =
                            false;

                        track.style.cursor =
                            "";

                    }
                );


                track.addEventListener(
                    "mouseleave",
                    function () {

                        pressed =
                            false;

                        track.style.cursor =
                            "";

                    }
                );


                track.addEventListener(
                    "mousemove",
                    function (event) {

                        if (!pressed) {
                            return;
                        }


                        event.preventDefault();


                        const currentX =
                            event.pageX -
                            track.offsetLeft;


                        const distance =
                            (currentX - startX) *
                            1.15;


                        track.scrollLeft =
                            initialScroll -
                            distance;

                    }
                );

            }
        );

    }


    /* =====================================================
       INICIAR GALERIA
    ===================================================== */

    showAll();


    console.log(
        "AVR — Galeria unificada carregada."
    );


})();