/* =========================================================
   ADONAI VANGADI RESTAURANT
   PRATOS — SISTEMA INTELIGENTE
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const STORAGE_KEY = "avr_pedido";


    /* =====================================================
       BASE DOS PRATOS
       
       O HTML É ÚNICO.
       O ID DA URL DEFINE QUAL PRATO APARECE.
    ===================================================== */

    const dishes = {

        "cachupa": {

            id: "cachupa",

            name: "Cachupa",

            image: "../assets/images/restaurant/cachupa.png",

            category: "Principal",

            price: 7500,

            description:
                "Uma preparação de inspiração tradicional, feita com uma combinação rica de ingredientes cuidadosamente selecionados. A Cachupa AVR valoriza textura, sabor e uma apresentação acolhedora, trazendo para a mesa uma experiência gastronómica cheia de identidade.",

            ingredients: [
                "Milho",
                "Feijão",
                "Legumes",
                "Carne",
                "Temperos da casa"
            ]

        },


        "churrasco": {

            id: "churrasco",

            name: "Churrasco",

            image: "../assets/images/restaurant/churrasco.png",

            category: "Principal",

            price: 12000,

            badge: "Popular",

            description:
                "Carne cuidadosamente preparada e grelhada para preservar a suculência e realçar o sabor natural. Servida com batata frita e complementos da casa, é uma das escolhas ideais para quem procura uma refeição marcante e generosa.",

            ingredients: [
                "Carne grelhada",
                "Batata frita",
                "Salada",
                "Molho da casa",
                "Temperos especiais"
            ]

        },


        "feijoada": {

            id: "feijoada",

            name: "Feijoada",

            image: "../assets/images/restaurant/feijoada.png",

            category: "Principal",

            price: 10000,

            description:
                "Uma combinação reconfortante de feijão e carnes, acompanhada por arroz, farofa, salada e farinha. Uma preparação completa, pensada para quem procura sabor intenso e uma refeição generosa.",

            ingredients: [
                "Feijão",
                "Carnes selecionadas",
                "Arroz",
                "Farofa",
                "Salada",
                "Farinha"
            ]

        },


        "fumbua": {

            id: "fumbua",

            name: "Fumbua",

            image: "../assets/images/restaurant/fumbua.png",

            category: "Principal",

            price: 9000,

            description:
                "Fumbua preparada com acompanhamento tradicional e temperos especiais da casa. Uma escolha que valoriza sabores marcantes e a riqueza da gastronomia africana.",

            ingredients: [
                "Fumbua",
                "Temperos",
                "Óleo de palma",
                "Alho",
                "Cebola",
                "Acompanhamento da casa"
            ]

        },


        "funge-carne": {

            id: "funge-carne",

            name: "Funge com Carne",

            image: "../assets/images/restaurant/funge-carne.png",

            category: "Principal",

            price: 9500,

            description:
                "Funge acompanhado de carne seca e feijão de olho de palma. Uma combinação de sabores tradicionais preparada com cuidado para proporcionar uma experiência autêntica e reconfortante.",

            ingredients: [
                "Funge",
                "Carne seca",
                "Feijão de olho de palma",
                "Óleo de palma",
                "Cebola",
                "Temperos"
            ]

        },


        "funge-funbua": {

            id: "funge-funbua",

            name: "Funge com Fumbua",

            image: "../assets/images/restaurant/funge-funbua.png",

            category: "Principal",

            price: 9500,

            description:
                "Uma combinação especial de sabores tradicionais, reunindo o funge com fumbua e acompanhamentos cuidadosamente escolhidos para completar a experiência.",

            ingredients: [
                "Funge",
                "Fumbua",
                "Catato",
                "Pincho",
                "Quikuanga",
                "Temperos da casa"
            ]

        },


        "funge-muamba": {

            id: "funge-muamba",

            name: "Funge Muamba",

            image: "../assets/images/restaurant/funge-muamba.png",

            category: "Principal",

            price: 10000,

            description:
                "Funge acompanhado de kizaca e galinha rija preparada num molho de muamba rico e aromático. Um prato de personalidade forte, pensado para os apreciadores da cozinha tradicional.",

            ingredients: [
                "Funge",
                "Galinha rija",
                "Muamba",
                "Kizaca",
                "Óleo de palma",
                "Alho",
                "Cebola"
            ]

        },


        "funge-ovo": {

            id: "funge-ovo",

            name: "Funge com Ovo",

            image: "../assets/images/restaurant/funge-ovo.png",

            category: "Principal",

            price: 7500,

            description:
                "Funge acompanhado de ovo e chouriço preparados num molho de tomate cuidadosamente temperado. Uma opção simples, saborosa e reconfortante.",

            ingredients: [
                "Funge",
                "Ovo",
                "Chouriço",
                "Molho de tomate",
                "Cebola",
                "Temperos"
            ]

        },

        "mufete": {

            id: "mufete",

            name: "Mufete",

            image: "../assets/images/restaurant/mufete.png",

            category: "Principal",

            price: 13000,

            description:
                "Um dos sabores marcantes da gastronomia angolana, preparado com peixe e acompanhamentos tradicionais que valorizam a simplicidade, a riqueza e a identidade da nossa cozinha. No AVR, o Mufete é servido com uma combinação equilibrada de sabores e ingredientes que tornam cada refeição especial.",

            ingredients: [
                "Peixe",
                "Feijão",
                "Óleo de palma",
                "Batata",
                "Mandioca",
                "Banana",
                "Farinha",
                "Salada"
            ]

        },


        "hamburger": {

            id: "hamburger",

            name: "Hambúrguer Adonai",

            image: "../assets/images/restaurant/hamburger.png",

            category: "Principal",

            price: 8000,

            badge: "Popular",

            description:
                "O Hambúrguer Adonai combina carne preparada para garantir sabor e suculência, queijo, vegetais frescos e o molho especial da casa. Uma opção descontraída, mas com a assinatura AVR.",

            ingredients: [
                "Pão",
                "Carne",
                "Queijo",
                "Alface",
                "Tomate",
                "Molho especial"
            ]

        },


        "massa": {

            id: "massa",

            name: "Massa da Casa",

            image: "../assets/images/restaurant/massa.png",

            category: "Massas",

            price: 8000,

            description:
                "Uma massa preparada ao estilo da casa, reunindo ingredientes selecionados e acompanhamentos cuidadosamente equilibrados para criar uma refeição cremosa, aromática e saborosa.",

            ingredients: [
                "Massa",
                "Molho da casa",
                "Legumes",
                "Queijo",
                "Ervas",
                "Temperos"
            ]

        },


        "massa-2": {

            id: "massa-2",

            name: "Massa Yakisoba",

            image: "../assets/images/restaurant/massa-2.png",

            category: "Massas",

            price: 10000,

            badge: "Especial",

            description:
                "A clássica massa Yakisoba preparada com ingredientes selecionados e molho especial. Uma combinação equilibrada entre textura, sabor e aromas intensos.",

            ingredients: [
                "Massa",
                "Legumes",
                "Molho Yakisoba",
                "Carne",
                "Cebola",
                "Cenoura"
            ]

        },


        "bolos": {

            id: "bolos",

            name: "Bolos Variados",

            image: "../assets/images/restaurant/bolos.png",

            category: "Sobremesa",

            price: 3000,

            description:
                "Uma seleção de bolos para terminar a refeição com uma nota doce. Entre as opções encontram-se sabores como chocolate, jinguba e cenoura com chocolate.",

            ingredients: [
                "Farinha",
                "Ovos",
                "Açúcar",
                "Chocolate",
                "Jinguba",
                "Cenoura"
            ]

        },


        "bolo-pudin": {

            id: "bolo-pudin",

            name: "Bolo Pudim",

            image: "../assets/images/restaurant/bolo-pudin.png",

            category: "Sobremesa",

            price: 4000,

            badge: "Especial",

            description:
                "Uma sobremesa que combina a textura do bolo de chocolate com a suavidade do pudim e a cremosidade da mousse.",

            ingredients: [
                "Chocolate",
                "Farinha",
                "Ovos",
                "Pudim",
                "Mousse",
                "Açúcar"
            ]

        },


        "pudim": {

            id: "pudim",

            name: "Pudim",

            image: "../assets/images/restaurant/pudim.png",

            category: "Sobremesa",

            price: 3000,

            description:
                "Pudim cremoso preparado pela nossa cozinha, com textura suave e sabor delicado. Uma sobremesa simples para fechar a experiência AVR.",

            ingredients: [
                "Leite",
                "Ovos",
                "Açúcar",
                "Caramelo"
            ]

        },


        "cerveja": {

            id: "cerveja",

            name: "Cerveja",

            image: "../assets/images/restaurant/cerveja.png",

            category: "Bebida",

            price: 1000,

            description:
                "Cerveja servida bem fresca, ideal para acompanhar uma refeição ou simplesmente aproveitar um momento descontraído.",

            ingredients: [
                "Cerveja"
            ]

        },


        "whisky": {

            id: "whisky",

            name: "Whisky",

            image: "../assets/images/restaurant/whisky.png",

            category: "Bebida",

            price: 3500,

            description:
                "Uma dose de whisky selecionado para acompanhar momentos especiais e proporcionar uma experiência de sabor marcante.",

            ingredients: [
                "Whisky",
                "Gelo opcional"
            ]

        },


        "cocktail": {

            id: "cocktail",

            name: "Cocktails",

            image: "../assets/images/restaurant/coktel.png",

            category: "Bebida",

            price: 3000,

            badge: "Especial",

            description:
                "Cocktails preparados especialmente para diferentes gostos, combinando apresentação, frescura e sabores equilibrados.",

            ingredients: [
                "Frutas",
                "Sumos",
                "Gelo",
                "Mistura da casa"
            ]

        },


        "pizza-metade": {

            id: "pizza-metade",

            name: "Pizza Metade",

            image: "../assets/images/restaurant/pizza-metade.png",

            category: "Pizza",

            price: 1500,

            description:
                "Pizza preparada com ingredientes selecionados e o sabor da casa, ideal para quem procura uma opção prática e saborosa.",

            ingredients: [
                "Massa",
                "Molho de tomate",
                "Queijo",
                "Ingredientes selecionados"
            ]

        },


        "pizza-inteira": {

            id: "pizza-inteira",

            name: "Pizza Inteira",

            image: "../assets/images/restaurant/pizza-inteira.png",

            category: "Pizza",

            price: 9000,

            badge: "Popular",

            description:
                "Pizza inteira preparada com massa cuidadosamente trabalhada, molho especial e ingredientes selecionados para uma experiência completa à mesa.",

            ingredients: [
                "Massa",
                "Molho especial",
                "Queijo",
                "Tomate",
                "Ingredientes selecionados"
            ]

        },


        "arroz": {

            id: "arroz",

            name: "Arroz",

            image: "../assets/images/restaurant/arroz.png",

            category: "Principal",

            price: 3000,

            description:
                "Arroz preparado na cozinha AVR como acompanhamento versátil para diferentes pratos da casa.",

            ingredients: [
                "Arroz",
                "Água",
                "Sal",
                "Temperos"
            ]

        }

    };


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const image =
        document.getElementById("dishImage");

    const name =
        document.getElementById("dishName");

    const category =
        document.getElementById("dishCategory");

    const description =
        document.getElementById("dishDescription");

    const price =
        document.getElementById("dishPrice");

    const ingredients =
        document.getElementById("dishIngredients");

    const badge =
        document.getElementById("dishBadge");

    const quantityElement =
        document.getElementById("dishQuantity");

    const decreaseButton =
        document.getElementById("decreaseQuantity");

    const increaseButton =
        document.getElementById("increaseQuantity");

    const addButton =
        document.getElementById("addToOrderButton");

    const addButtonPrice =
        document.getElementById("addButtonPrice");

    const feedback =
        document.getElementById("dishFeedback");

    const detail =
        document.getElementById("dishDetail");

    const notFound =
        document.getElementById("dishNotFound");

    const orderCount =
        document.getElementById("orderCount");


    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function formatPrice(value) {

        return new Intl.NumberFormat(
            "pt-AO"
        ).format(value) + " Kz";

    }


    function getQuantity() {

        return Number(
            quantityElement?.textContent || 1
        );

    }


    function setQuantity(value) {

        const safeValue =
            Math.max(
                1,
                Math.min(99, value)
            );

        if (quantityElement) {

            quantityElement.textContent =
                safeValue;

        }

        updatePurchasePrice();

    }


    /* =====================================================
       URL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    /*
     * Aceita:
     *
     * pratos.html?prato=churrasco
     *
     * e também:
     *
     * pratos.html?id=churrasco
     *
     */

    const dishId =
        params.get("prato") ||
        params.get("id");


    const dish =
        dishId
            ? dishes[dishId]
            : null;


    /* =====================================================
       MOSTRAR PRATO
    ===================================================== */

    function renderDish() {

        if (!dish) {

            if (detail) {
                detail.hidden = true;
            }

            if (notFound) {
                notFound.hidden = false;
            }

            return;

        }


        document.title =
            `${dish.name} — AVR`;


        image.src =
            dish.image;

        image.alt =
            dish.name;


        name.textContent =
            dish.name;


        category.textContent =
            dish.category;


        description.textContent =
            dish.description;


        price.textContent =
            formatPrice(dish.price);


        /*
         * Badge
         */

        if (dish.badge) {

            badge.textContent =
                dish.badge;

            badge.hidden = false;

        } else {

            badge.hidden = true;

        }


        /*
         * Ingredientes
         */

        ingredients.innerHTML = "";


        dish.ingredients.forEach(
            ingredient => {

                const tag =
                    document.createElement("span");

                tag.className =
                    "ingredient-tag";

                tag.textContent =
                    ingredient;

                ingredients.appendChild(tag);

            }
        );


        /*
         * Quantidade inicial
         */

        setQuantity(1);


        /*
         * Página visível
         */

        detail.hidden = false;

        if (notFound) {
            notFound.hidden = true;
        }

    }


    /* =====================================================
       PREÇO DA QUANTIDADE
    ===================================================== */

    function updatePurchasePrice() {

        if (!dish || !addButtonPrice) {
            return;
        }


        const quantity =
            getQuantity();


        const total =
            dish.price * quantity;


        addButtonPrice.textContent =
            formatPrice(total);

    }


    /* =====================================================
       CONTADOR DO PEDIDO
    ===================================================== */

    function readOrder() {

        try {

            const data =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (!data) {
                return [];
            }

            const parsed =
                JSON.parse(data);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "AVR: erro ao ler pedido.",
                error
            );

            return [];

        }

    }


    function saveOrder(order) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(order)
        );

        /*
         * Avisa outras partes do sistema
         */

        window.dispatchEvent(
            new CustomEvent(
                "avr:order-updated",
                {
                    detail: {
                        order
                    }
                }
            )
        );

        /*
         * Evento storage
         * para outras abas.
         */

        window.dispatchEvent(
            new Event("storage")
        );

    }


    function updateOrderCount() {

        if (!orderCount) {
            return;
        }


        const order =
            readOrder();


        const totalQuantity =
            order.reduce(
                (total, item) => {

                    return total +
                        Number(
                            item.quantity ||
                            item.quantidade ||
                            0
                        );

                },
                0
            );


        orderCount.textContent =
            totalQuantity;

    }


    /* =====================================================
       ADICIONAR AO PEDIDO
    ===================================================== */

    function addToOrder() {

        if (!dish) {
            return;
        }


        const quantity =
            getQuantity();


        const order =
            readOrder();


        const existingIndex =
            order.findIndex(
                item =>
                    String(
                        item.id
                    ) === String(
                        dish.id
                    )
            );


        /*
         * Estrutura oficial compartilhada
         * com pedidos.html
         */

        const newItem = {

            id: dish.id,

            name: dish.name,

            image: dish.image,

            description:
                dish.description,

            category:
                dish.category,

            price:
                dish.price,

            quantity:
                quantity,

            ingredients:
                dish.ingredients

        };


        if (existingIndex !== -1) {

            /*
             * Se já existe no pedido,
             * soma a nova quantidade.
             */

            const current =
                Number(
                    order[
                        existingIndex
                    ].quantity || 0
                );


            order[
                existingIndex
            ] = {

                ...order[
                    existingIndex
                ],

                ...newItem,

                quantity:
                    current + quantity

            };

        } else {

            order.push(
                newItem
            );

        }


        saveOrder(order);

        updateOrderCount();


        /*
         * Feedback visual
         */

        if (feedback) {

            feedback.textContent =
                quantity === 1
                    ? `${dish.name} foi adicionado ao seu pedido.`
                    : `${quantity} unidades de ${dish.name} foram adicionadas ao seu pedido.`;

            feedback.classList.add(
                "show"
            );

        }


        /*
         * Animação do botão
         */

        addButton?.classList.add(
            "added"
        );


        setTimeout(() => {

            addButton?.classList.remove(
                "added"
            );

        }, 250);


        /*
         * Atualiza botão
         */

        if (addButton) {

            const original =
                addButton.querySelector(
                    "span"
                );

            if (original) {

                original.textContent =
                    "Adicionado ao pedido ✓";

            }


            setTimeout(() => {

                if (original) {

                    original.textContent =
                        "Adicionar ao pedido";

                }

            }, 1600);

        }

    }


    /* =====================================================
       QUANTIDADE
    ===================================================== */

    decreaseButton?.addEventListener(
        "click",
        () => {

            setQuantity(
                getQuantity() - 1
            );

        }
    );


    increaseButton?.addEventListener(
        "click",
        () => {

            setQuantity(
                getQuantity() + 1
            );

        }
    );


    /* =====================================================
       ADICIONAR
    ===================================================== */

    addButton?.addEventListener(
        "click",
        addToOrder
    );


    /* =====================================================
       ESCUTA ATUALIZAÇÃO DO PEDIDO
    ===================================================== */

    window.addEventListener(
        "avr:order-updated",
        updateOrderCount
    );


    window.addEventListener(
        "storage",
        updateOrderCount
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    renderDish();

    updatePurchasePrice();

    updateOrderCount();


})();