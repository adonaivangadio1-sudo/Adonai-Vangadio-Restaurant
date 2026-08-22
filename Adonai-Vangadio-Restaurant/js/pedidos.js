/* =========================================================
   AVR — PEDIDOS
   pedidos.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const orderItems =
        document.getElementById("orderItems");

    const orderEmpty =
        document.getElementById("orderEmpty");

    const orderItemsCount =
        document.getElementById("orderItemsCount");

    const orderCount =
        document.getElementById("orderCount");

    const orderSubtotal =
        document.getElementById("orderSubtotal");

    const orderService =
        document.getElementById("orderService");

    const orderTotal =
        document.getElementById("orderTotal");

    const deliveryLocation =
        document.getElementById("deliveryLocation");

    const deliveryPriceInfo =
        document.getElementById("deliveryPriceInfo");

    const deliveryLocationLabel =
        document.getElementById("deliveryLocationLabel");

    const deliveryPrice =
        document.getElementById("deliveryPrice");

    const continueOrderButton =
        document.getElementById("continueOrderButton");

    const orderNotes =
        document.getElementById("orderNotes");


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEY = "avr_pedido";


    /* =====================================================
       FORMATAR PREÇO
    ===================================================== */

    function formatPrice(value) {

        return Number(value || 0).toLocaleString(
            "pt-AO"
        ) + " Kz";

    }


    /* =====================================================
       LER PEDIDO
    ===================================================== */

    function getOrder() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) return [];

            const parsed =
                JSON.parse(saved);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "Erro ao ler o pedido:",
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
       CALCULAR SUBTOTAL
    ===================================================== */

    function calculateSubtotal(order) {

        return order.reduce(
            (total, item) => {

                return total +
                    (
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                    );

            },
            0
        );

    }


    /* =====================================================
       TAXA DE ENTREGA
    ===================================================== */

    function getDeliveryFee() {

        if (!deliveryLocation) {
            return 0;
        }

        const option =
            deliveryLocation.options[
                deliveryLocation.selectedIndex
            ];

        if (!option) return 0;

        return Number(
            option.dataset.fee || 0
        );

    }


    /* =====================================================
       ATUALIZAR RESUMO
    ===================================================== */

    function updateSummary(order) {

        const subtotal =
            calculateSubtotal(order);

        const deliveryFee =
            getDeliveryFee();

        const total =
            subtotal + deliveryFee;


        if (orderSubtotal) {

            orderSubtotal.textContent =
                formatPrice(subtotal);

        }


        if (orderService) {

            orderService.textContent =
                formatPrice(deliveryFee);

        }


        if (orderTotal) {

            orderTotal.textContent =
                formatPrice(total);

        }


        /*
         * Informação da entrega
         */

        if (
            deliveryLocation &&
            deliveryLocation.value &&
            deliveryPriceInfo
        ) {

            const option =
                deliveryLocation.options[
                    deliveryLocation.selectedIndex
                ];

            if (deliveryLocationLabel) {

                deliveryLocationLabel.textContent =
                    option.textContent
                        .replace(
                            /—\s*[\d.\s]+Kz/,
                            ""
                        )
                        .trim();

            }

            if (deliveryPrice) {

                deliveryPrice.textContent =
                    formatPrice(deliveryFee);

            }

            deliveryPriceInfo.hidden = false;

        } else if (deliveryPriceInfo) {

            deliveryPriceInfo.hidden = true;

        }


        /*
         * Botão continuar
         *
         * Só permite avançar quando
         * existem itens no pedido.
         */

        if (continueOrderButton) {

            continueOrderButton.disabled =
                order.length === 0;

        }

    }


    /* =====================================================
       RENDERIZAR PEDIDO
    ===================================================== */

    function renderOrder() {

        const order =
            getOrder();


        if (!orderItems) return;


        orderItems.innerHTML = "";


        /*
         * PEDIDO VAZIO
         */

        if (order.length === 0) {

            if (orderEmpty) {

                orderEmpty.hidden = false;

            }

            if (orderItemsCount) {

                orderItemsCount.textContent =
                    "0 itens";

            }

            if (orderCount) {

                orderCount.textContent =
                    "0";

            }

            updateSummary(order);

            return;

        }


        if (orderEmpty) {

            orderEmpty.hidden = true;

        }


        let totalQuantity = 0;


        /*
         * CRIAR ITENS
         */

        order.forEach((item, index) => {

            const quantity =
                Number(item.quantity || 1);

            const price =
                Number(item.price || 0);

            const itemTotal =
                price * quantity;


            totalQuantity += quantity;


            const article =
                document.createElement("article");

            article.className =
                "order-item";


            article.innerHTML = `

                <div class="order-item-image">

                    <img
                        src="${item.image || ""}"
                        alt="${item.name || "Prato"}"
                        loading="lazy"
                    >

                </div>


                <div class="order-item-content">

                    <div class="order-item-info">

                        <span class="order-item-category">
                            ${item.category || "AVR"}
                        </span>

                        <h3>
                            ${item.name || "Prato"}
                        </h3>

                        ${
                            item.description
                                ? `
                                <p>
                                    ${item.description}
                                </p>
                                `
                                : ""
                        }

                    </div>


                    <div class="order-item-bottom">

                        <div class="order-quantity">

                            <button
                                type="button"
                                class="quantity-button"
                                data-action="decrease"
                                data-index="${index}"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-button"
                                data-action="increase"
                                data-index="${index}"
                            >
                                +
                            </button>

                        </div>


                        <strong class="order-item-price">
                            ${formatPrice(itemTotal)}
                        </strong>

                    </div>

                </div>


                <button
                    type="button"
                    class="order-item-remove"
                    data-action="remove"
                    data-index="${index}"
                    aria-label="Remover ${item.name || "item"}"
                >
                    ×
                </button>

            `;


            orderItems.appendChild(article);

        });


        /*
         * CONTADORES
         */

        if (orderItemsCount) {

            orderItemsCount.textContent =
                `${totalQuantity} ${
                    totalQuantity === 1
                        ? "item"
                        : "itens"
                }`;

        }


        if (orderCount) {

            orderCount.textContent =
                totalQuantity;

        }


        updateSummary(order);

    }


    /* =====================================================
       ALTERAR QUANTIDADE / REMOVER
    ===================================================== */

    orderItems?.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) return;


            const action =
                button.dataset.action;

            const index =
                Number(button.dataset.index);


            const order =
                getOrder();

            const item =
                order[index];


            if (!item) return;


            /*
             * AUMENTAR
             */

            if (action === "increase") {

                item.quantity =
                    Number(item.quantity || 1) + 1;

            }


            /*
             * DIMINUIR
             */

            if (action === "decrease") {

                item.quantity =
                    Number(item.quantity || 1) - 1;


                if (item.quantity <= 0) {

                    order.splice(index, 1);

                }

            }


            /*
             * REMOVER
             */

            if (action === "remove") {

                order.splice(index, 1);

            }


            saveOrder(order);

            renderOrder();

        }
    );


    /* =====================================================
       ALTERAÇÃO DA LOCALIZAÇÃO
    ===================================================== */

    deliveryLocation?.addEventListener(
        "change",
        () => {

            const order =
                getOrder();

            updateSummary(order);

        }
    );


    /* =====================================================
       OBSERVAÇÕES
    ===================================================== */

    orderNotes?.addEventListener(
        "input",
        () => {

            localStorage.setItem(
                "avr_pedido_observacoes",
                orderNotes.value
            );

        }
    );


    /*
     * Recuperar observações
     */

    if (orderNotes) {

        orderNotes.value =
            localStorage.getItem(
                "avr_pedido_observacoes"
            ) || "";

    }


    /* =====================================================
       CONTINUAR → FINALIZAR PEDIDO
    ===================================================== */

    continueOrderButton?.addEventListener(
        "click",
        () => {

            const order =
                getOrder();


            /*
             * Segurança
             */

            if (!order.length) {

                return;

            }


            /*
             * Calcular o total atual
             */

            const subtotal =
                calculateSubtotal(order);

            const deliveryFee =
                getDeliveryFee();

            const total =
                subtotal + deliveryFee;


            /* =================================================
               NOVA INTEGRAÇÃO COM FINALIZAR-PEDIDOS.HTML

               Mantemos o pedido original intacto em
               "avr_pedido".

               Aqui criamos apenas o objeto que a página
               finalizar-pedidos.html já espera encontrar:
               "avrCheckout".
            ================================================= */

            const checkoutData = {

                items: order,

                subtotal: subtotal,

                deliveryFee: deliveryFee,

                total: total,

                delivery: {

                    location:
                        deliveryLocation?.value || "",

                    locationName:
                        deliveryLocation?.value
                            ? deliveryLocation.options[
                                deliveryLocation.selectedIndex
                              ].textContent
                                .replace(
                                    /—\s*[\d.\s]+Kz/,
                                    ""
                                )
                                .trim()
                            : ""

                },

                notes:
                    orderNotes?.value.trim() || ""

            };


            /*
             * Guarda os dados para a página
             * finalizar-pedidos.html.
             */

            localStorage.setItem(
                "avrCheckout",
                JSON.stringify(
                    checkoutData
                )
            );


            /*
             * Mantém também o total separado,
             * sem alterar o funcionamento existente.
             */

            localStorage.setItem(
                "avr_finalizacao_total",
                String(total)
            );


            /*
             * Guarda a localização escolhida.
             */

            if (
                deliveryLocation &&
                deliveryLocation.value
            ) {

                const option =
                    deliveryLocation.options[
                        deliveryLocation.selectedIndex
                    ];

                localStorage.setItem(
                    "avr_finalizacao_localizacao",
                    option.textContent.trim()
                );

            }


            /*
             * Observações
             */

            if (orderNotes) {

                localStorage.setItem(
                    "avr_finalizacao_observacoes",
                    orderNotes.value.trim()
                );

            }


            /*
             * IR PARA FINALIZAÇÃO
             *
             * Os dois ficheiros estão na mesma pasta,
             * portanto este caminho está correto.
             */

            window.location.assign(
                "finalizar-pedidos.html"
            );

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    renderOrder();

});