/* Set the width of the side navigation to 250px */
var isOpen = false;

function openNavAction() {
    if ((window.innerWidth / window.innerHeight) < 1) {
        document.getElementById("mySidenav").style.width = "100%";
    } else if ((window.innerWidth / window.innerHeight) < 1.2) {
        document.getElementById("mySidenav").style.width = "50%";
    } else if ((window.innerWidth / window.innerHeight) < 1.7) {
        document.getElementById("mySidenav").style.width = "35%";
    } else {
        document.getElementById("mySidenav").style.width = "25%";
    }
}

function openNav() {
    openNavAction();
    isOpen = true;
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    isOpen = false;
}

window.addEventListener('resize', function(event) {
    if (isOpen == true) {
        openNavAction();
    }

});
