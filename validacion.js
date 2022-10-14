function validar(e){
    let nombre, reg, tip, expresion;
    nombre=document.getElementById("name").value;
    expresion=/^[a-zA-ZÀ-ÿ\s]{1,30}$/;

    if(nombre==="" || reg==="" || tip===""){
        alert("Llena todos los campos");
        return false;
    }
    else if(!expresion.test(nombre.value)){
        alert("Nombre no Valido")
        return false;
    }
    else if(!expresion.test(reg)){
        alert("Región no valida");
        return false;
    }
    else if(!expresion.test(tip)){
        alert("Tipo/s no valido");
        return false;
    }
}