/* =========================================================
   AVR — ARMAZENAMENTO LOCAL
========================================================= */

const AVR_STORAGE_KEY = "avr_pedido";


function getAVROrder() {

    try {

        const stored =
            localStorage.getItem(
                AVR_STORAGE_KEY
            );

        return stored
            ? JSON.parse(stored)
            : [];

    } catch (error) {

        console.error(
            "Erro ao carregar pedido:",
            error
        );

        return [];

    }

}


function saveAVROrder(order) {

    localStorage.setItem(
        AVR_STORAGE_KEY,
        JSON.stringify(order)
    );

}


function clearAVROrder() {

    localStorage.removeItem(
        AVR_STORAGE_KEY
    );

}


function addAVRItem(item) {

    const order =
        getAVROrder();


    const existing =
        order.find(
            product =>
                product.id === item.id
        );


    if (existing) {

        existing.quantity +=
            item.quantity || 1;

    } else {

        order.push({

            ...item,

            quantity:
                item.quantity || 1

        });

    }


    saveAVROrder(order);


    return order;

}


function updateAVRItemQuantity(
    id,
    quantity
) {

    const order =
        getAVROrder();


    const item =
        order.find(
            product =>
                product.id === id
        );


    if (!item) {
        return order;
    }


    if (quantity <= 0) {

        return removeAVRItem(id);

    }


    item.quantity =
        quantity;


    saveAVROrder(order);


    return order;

}


function removeAVRItem(id) {

    let order =
        getAVROrder();


    order =
        order.filter(
            item =>
                item.id !== id
        );


    saveAVROrder(order);


    return order;

}


function getAVROrderCount() {

    const order =
        getAVROrder();


    return order.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


function getAVROrderSubtotal() {

    const order =
        getAVROrder();


    return order.reduce(
        (total, item) =>
            total +
            (
                Number(item.price) *
                Number(item.quantity)
            ),
        0
    );

}


function formatAVRPrice(value) {

    return new Intl.NumberFormat(
        "pt-AO"
    ).format(value) + " Kz";

}


function updateAVROrderCounters() {

    const count =
        getAVROrderCount();


    document
        .querySelectorAll("#orderCount")
        .forEach(element => {

            element.textContent =
                count;

        });

}