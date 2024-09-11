
const cargarJuego = (nombreUsuario, tema) => {
    if(nombreUsuario==""){
        alert("Tienes que completar tu nombre de usuario para poder jugar!");
    }else{
        window.open("game.html");
    }
}