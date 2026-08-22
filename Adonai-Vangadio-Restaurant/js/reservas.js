/* =========================================================
   AVR — SISTEMA DE RESERVAS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const dateInput =
            document.getElementById(
                "reservationDate"
            );


        const timeInput =
            document.getElementById(
                "reservationTime"
            );


        const nameInput =
            document.getElementById(
                "guestName"
            );


        const phoneInput =
            document.getElementById(
                "guestPhone"
            );


        const notesInput =
            document.getElementById(
                "reservationNotes"
            );


        const submitButton =
            document.getElementById(
                "reservationSubmit"
            );


        const message =
            document.getElementById(
                "reservationMessage"
            );


        const guestButtons =
            document.querySelectorAll(
                ".guest-option"
            );


        if (!submitButton) {
            return;
        }


        let selectedGuests = 2;


        /* =================================================
           DATA MÍNIMA
        ================================================= */

        if (dateInput) {

            const today =
                new Date();


            const year =
                today.getFullYear();


            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");


            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");


            dateInput.min =
                `${year}-${month}-${day}`;

        }


        /* =================================================
           NÚMERO DE PESSOAS
        ================================================= */

        guestButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {


                    guestButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedGuests =
                        Number(
                            button.dataset.guests
                        );

                }
            );

        });


        /* =================================================
           CONFIRMAR
        ================================================= */

        submitButton.addEventListener(
            "click",
            () => {


                if (
                    !dateInput.value ||
                    !timeInput.value ||
                    !nameInput.value.trim() ||
                    !phoneInput.value.trim()
                ) {

                    showReservationMessage(
                        "Preencha todos os campos obrigatórios.",
                        true
                    );

                    return;

                }


                const reservation = {

                    id:
                        "AVR-" +
                        Date.now(),

                    date:
                        dateInput.value,

                    time:
                        timeInput.value,

                    guests:
                        selectedGuests,

                    name:
                        nameInput.value.trim(),

                    phone:
                        phoneInput.value.trim(),

                    notes:
                        notesInput.value.trim(),

                    createdAt:
                        new Date().toISOString()

                };


                localStorage.setItem(
                    "avr_reserva",
                    JSON.stringify(
                        reservation
                    )
                );


                showReservationMessage(
                    "Reserva registada com sucesso. Esperamos por você no AVR.",
                    false
                );


                submitButton.textContent =
                    "Reserva confirmada ✓";


                submitButton.disabled =
                    true;

            }
        );


        function showReservationMessage(
            text,
            error
        ) {

            message.textContent =
                text;


            message.style.color =
                error
                    ? "#a71930"
                    : "#25834a";

        }

    }
);