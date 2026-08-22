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
        ================================================= */

        const imageElement =
            card.querySelector(
                ".popular-image img"
            );

        const image =
            imageElement?.getAttribute(
                "src"
            ) || "";


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