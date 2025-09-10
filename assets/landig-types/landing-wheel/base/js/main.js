document.addEventListener("DOMContentLoaded", () => {
    const spinBtn = document.getElementById("spinBtn");
    const wheelWrap = document.querySelector(".wheel_wrap");
    const wheelSpinner = document.querySelector(".wheel_spinner");
    const hero = document.querySelector(".hero");
    const header = document.querySelector("header");
    const erasersBlocks = document.querySelectorAll(".erasers__content-block");
    const infoPopup = document.getElementById("infoPopup");
    const amountWinnings = document.getElementById("amountWinnings");

    if (
        spinBtn &&
        wheelWrap &&
        wheelSpinner &&
        hero &&
        header &&
        erasersBlocks.length > 0 &&
        infoPopup &&
        amountWinnings
    ) {
        let erasedCount = 0;
        let totalWin = 0;

        // --- Запуск колеса ---
        spinBtn.addEventListener("click", () => {
            // убираем вращение стрелки
            wheelWrap.classList.remove("arrow-rotation");

            // запускаем вращение колеса
            wheelSpinner.classList.add("wheel_spinner_animated_1");

            // через 4 сек (после анимации вращения) добавляем подсветку
            setTimeout(() => {
                wheelSpinner.classList.add("lighting");
            }, 4000);

            // через 6 сек показываем блок с "стирашками"
            setTimeout(() => {
                hero.classList.add("change");
                header.classList.add("change");
            }, 6000);
        });

        // --- Логика стирашек ---
        erasersBlocks.forEach((block) => {
            block.addEventListener("click", () => {
                if (!block.classList.contains("erased") && erasedCount < 2) {
                    block.classList.add("erased");
                    erasedCount++;

                    // достаем сумму выигрыша из описания
                    const text = block.querySelector(".erasers__content-block__descr p");
                    if (text) {
                        const value = text.textContent.replace(/[^\d]/g, "");
                        totalWin += parseInt(value, 10) || 0;
                    }

                    // после второй стёртой — открываем popup
                    if (erasedCount === 2) {
                        setTimeout(() => {
                            amountWinnings.textContent = `€${totalWin}`;
                            infoPopup.classList.add("active");
                        }, 1000);
                    }
                }
            });
        });
    }
});