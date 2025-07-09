export function toggleMenu() {
    const nav = document.getElementById("myTopnav");
    const barsIcon = document.getElementById("menuIconBars");
    const timesIcon = document.getElementById("menuIconTimes");

    if (nav) {
        const isResponsive = nav.className.includes("responsive");
        nav.className = isResponsive ? "navbar" : "navbar responsive";

        if (barsIcon && timesIcon) {
            if (isResponsive) {
                // Volver a barra
                barsIcon.classList.add("active");
                timesIcon.classList.remove("active");
            } else {
                // Mostrar X
                barsIcon.classList.remove("active");
                timesIcon.classList.add("active");
            }
        }
    }
}
