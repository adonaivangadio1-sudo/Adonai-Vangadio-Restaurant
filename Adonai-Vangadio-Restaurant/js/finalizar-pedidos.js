/* =========================================================
   AVR — FINALIZAR PEDIDOS
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CHAVES
    ===================================================== */

    const CHECKOUT_KEY =
        "avrCheckout";

    const ORDER_KEY =
        "avrPedido";


    /* =====================================================
       DADOS
    ===================================================== */

    const EXPRESS_NUMBER =
        "939663373";

    const IBAN =
        "005100007585142910136";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutDelivery =
        document.getElementById("checkoutDelivery");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const checkoutLocation =
        document.getElementById("checkoutLocation");

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone");

    const customerAddress =
        document.getElementById("customerAddress");

    const paymentReference =
        document.getElementById("paymentReference");

    const expressDetails =
        document.getElementById("expressDetails");

    const ibanDetails =
        document.getElementById("ibanDetails");

    const paymentReferenceField =
        document.getElementById(
            "paymentReferenceField"
        );

    const confirmPaymentButton =
        document.getElementById(
            "confirmPaymentButton"
        );

    const paymentReceipt =
        document.getElementById(
            "paymentReceipt"
        );


    /* =====================================================
       CARREGAR CHECKOUT
    ===================================================== */

    let checkout = null;


    try {

        checkout =
            JSON.parse(
                localStorage.getItem(
                    CHECKOUT_KEY
                )
            );

    } catch (error) {

        checkout = null;

    }


    /* =====================================================
       FORMATAR KZ
    ===================================================== */

    function formatarKz(valor) {

        return (
            Number(valor) || 0
        ).toLocaleString("pt-AO") + " Kz";

    }


    /* =====================================================
       ESCAPAR HTML
    ===================================================== */

    function escapeHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       GERAR NÚMERO DO PEDIDO
    ===================================================== */

    function gerarNumeroPedido() {

        const agora =
            Date.now()
                .toString()
                .slice(-6);


        return `AVR-${agora}`;

    }


    /* =====================================================
       RENDERIZAR RESUMO
    ===================================================== */

    function renderizarCheckout() {

        if (!checkout) {

            window.location.href =
                "pedidos.html";

            return;

        }


        const items =
            Array.isArray(
                checkout.items
            )
                ? checkout.items
                : [];


        if (checkoutItems) {

            checkoutItems.innerHTML = "";


            items.forEach(
                function (item) {

                    const div =
                        document.createElement(
                            "div"
                        );

                    div.className =
                        "checkout-item";


                    const quantidade =
                        Number(
                            item.quantity
                        ) || 1;


                    const preco =
                        Number(
                            item.price
                        ) || 0;


                    div.innerHTML = `

                        <div>

                            <strong>
                                ${escapeHTML(
                                    item.name
                                )}
                            </strong>

                            <span>
                                ${quantidade} ×
                                ${formatarKz(preco)}
                            </span>

                        </div>

                        <b>
                            ${formatarKz(
                                preco *
                                quantidade
                            )}
                        </b>

                    `;


                    checkoutItems.appendChild(
                        div
                    );

                }
            );

        }


        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                formatarKz(
                    checkout.subtotal
                );

        }


        if (checkoutDelivery) {

            checkoutDelivery.textContent =
                formatarKz(
                    checkout.deliveryFee
                );

        }


        if (checkoutTotal) {

            checkoutTotal.textContent =
                formatarKz(
                    checkout.total
                );

        }


        if (checkoutLocation) {

            checkoutLocation.textContent =
                checkout.delivery?.locationName ||
                "Localização não definida";

        }

    }


    /* =====================================================
       SELEÇÃO DE PAGAMENTO
    ===================================================== */

    function obterMetodoPagamento() {

        const selecionado =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        return selecionado
            ? selecionado.value
            : null;

    }


    function atualizarPagamento() {

        const metodo =
            obterMetodoPagamento();


        if (expressDetails) {
            expressDetails.hidden =
                metodo !== "express";
        }


        if (ibanDetails) {
            ibanDetails.hidden =
                metodo !== "iban";
        }


        if (paymentReferenceField) {

            paymentReferenceField.hidden =
                !metodo;

        }


        if (
            metodo === "express" &&
            paymentReference
        ) {

            paymentReference.placeholder =
                "Ex.: referência do Multicaixa Express";

        }


        if (
            metodo === "iban" &&
            paymentReference
        ) {

            paymentReference.placeholder =
                "Ex.: referência da transferência";

        }

    }


    document
        .querySelectorAll(
            'input[name="paymentMethod"]'
        )
        .forEach(
            function (radio) {

                radio.addEventListener(
                    "change",
                    atualizarPagamento
                );

            }
        );


    /* =====================================================
       VALIDAR FORMULÁRIO
    ===================================================== */

    function validarFormulario() {

        if (!checkout) {

            alert(
                "Não foi possível encontrar o pedido."
            );

            return false;

        }


        if (
            !customerName.value.trim()
        ) {

            alert(
                "Digite o seu nome."
            );

            customerName.focus();

            return false;

        }


        if (
            !customerPhone.value.trim()
        ) {

            alert(
                "Digite o seu número de telefone."
            );

            customerPhone.focus();

            return false;

        }


        if (
            !customerAddress.value.trim()
        ) {

            alert(
                "Digite o endereço ou ponto de entrega."
            );

            customerAddress.focus();

            return false;

        }


        const metodo =
            obterMetodoPagamento();


        if (!metodo) {

            alert(
                "Escolha um método de pagamento."
            );

            return false;

        }


        if (
            !paymentReference.value.trim()
        ) {

            alert(
                "Introduza a referência ou comprovativo do pagamento."
            );

            paymentReference.focus();

            return false;

        }


        return true;

    }


    /* =====================================================
       CONFIRMAR PAGAMENTO
    ===================================================== */

    if (confirmPaymentButton) {

        confirmPaymentButton.addEventListener(
            "click",
            function () {

                if (
                    !validarFormulario()
                ) {

                    return;

                }


                const metodo =
                    obterMetodoPagamento();


                let nomeMetodo =
                    "Pagamento";


                if (
                    metodo === "express"
                ) {

                    nomeMetodo =
                        "Multicaixa Express";

                }


                if (
                    metodo === "iban"
                ) {

                    nomeMetodo =
                        "Transferência por IBAN";

                }


                const numeroPedido =
                    gerarNumeroPedido();


                const pedidoFinal = {

                    orderNumber:
                        numeroPedido,

                    customer: {

                        name:
                            customerName
                                .value
                                .trim(),

                        phone:
                            customerPhone
                                .value
                                .trim(),

                        address:
                            customerAddress
                                .value
                                .trim()

                    },

                    items:
                        checkout.items,

                    delivery:
                        checkout.delivery,

                    notes:
                        checkout.notes || "",

                    subtotal:
                        Number(
                            checkout.subtotal
                        ) || 0,

                    deliveryFee:
                        Number(
                            checkout.deliveryFee
                        ) || 0,

                    total:
                        Number(
                            checkout.total
                        ) || 0,

                    payment: {

                        method:
                            metodo,

                        methodName:
                            nomeMetodo,

                        reference:
                            paymentReference
                                .value
                                .trim(),

                        account:
                            metodo === "express"
                                ? EXPRESS_NUMBER
                                : IBAN,

                        status:
                            "informado"

                    },

                    createdAt:
                        new Date()
                            .toISOString()

                };


                /*
                 * Guardamos o pedido final
                 * para futura integração
                 * com backend/base de dados.
                 */

                localStorage.setItem(
                    "avrUltimoPedido",
                    JSON.stringify(
                        pedidoFinal
                    )
                );


                /*
                 * Limpa o carrinho.
                 */

                localStorage.removeItem(
                    ORDER_KEY
                );


                /*
                 * Mostra recibo.
                 */

                mostrarRecibo(
                    pedidoFinal
                );

            }
        );

    }


    /* =====================================================
       MOSTRAR RECIBO
    ===================================================== */

    function mostrarRecibo(
        pedidoFinal
    ) {

        const receiptOrderNumber =
            document.getElementById(
                "receiptOrderNumber"
            );

        const receiptCustomer =
            document.getElementById(
                "receiptCustomer"
            );

        const receiptPayment =
            document.getElementById(
                "receiptPayment"
            );

        const receiptLocation =
            document.getElementById(
                "receiptLocation"
            );

        const receiptTotal =
            document.getElementById(
                "receiptTotal"
            );


        if (receiptOrderNumber) {

            receiptOrderNumber.textContent =
                pedidoFinal.orderNumber;

        }


        if (receiptCustomer) {

            receiptCustomer.textContent =
                pedidoFinal.customer.name;

        }


        if (receiptPayment) {

            receiptPayment.textContent =
                pedidoFinal.payment.methodName;

        }


        if (receiptLocation) {

            receiptLocation.textContent =
                pedidoFinal.delivery
                    ?.locationName ||
                "—";

        }


        if (receiptTotal) {

            receiptTotal.textContent =
                formatarKz(
                    pedidoFinal.total
                );

        }


        if (paymentReceipt) {

            paymentReceipt.hidden =
                false;

        }


        if (confirmPaymentButton) {

            confirmPaymentButton.hidden =
                true;

        }


        document
            .querySelector(
                ".checkout-layout"
            )
            ?.setAttribute(
                "hidden",
                ""
            );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* =====================================================
       NOVO PEDIDO
    ===================================================== */

    const newOrderButton =
        document.getElementById(
            "newOrderButton"
        );


    if (newOrderButton) {

        newOrderButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    CHECKOUT_KEY
                );

                window.location.href =
                    "menu.html";

            }
        );

    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    renderizarCheckout();

    atualizarPagamento();


})();

/* =========================================================
   AVR — SINCRONIZAÇÃO FINAL DO PEDIDO
   Limpa o pedido somente depois da confirmação
========================================================= */

document
    .getElementById("confirmPaymentButton")
    ?.addEventListener(
        "click",
        function () {

            /*
             * O pedidos.js utiliza esta chave:
             * "avr_pedido"
             *
             * Depois da confirmação do pagamento,
             * removemos exatamente essa chave.
             */

            localStorage.removeItem(
                "avr_pedido"
            );


            /*
             * Remove também os dados temporários
             * utilizados durante a finalização.
             *
             * O pedido final continua guardado em
             * "avrUltimoPedido".
             */

            localStorage.removeItem(
                "avrCheckout"
            );

            localStorage.removeItem(
                "avr_finalizacao_total"
            );

            localStorage.removeItem(
                "avr_finalizacao_localizacao"
            );

            localStorage.removeItem(
                "avr_finalizacao_observacoes"
            );

        }
    );