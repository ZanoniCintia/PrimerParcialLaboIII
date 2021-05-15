

const peticionHTTP = new XMLHttpRequest();
window.addEventListener('load', function(){
    ejecutarGet();
    var botonAlta = ById("btnGuardar");
    botonAlta.addEventListener('click',Alta);
    let btnEliminar = ById("btnEliminar");
    btnEliminar.addEventListener('click',Eliminar);
    btnModificar.addEventListener('click',Modificar);
});

 

function ejecutarGet(){
        
    peticionHTTP.onreadystatechange= function(){
        if(peticionHTTP.readyState== 4 && peticionHTTP.status== 200){
            let arrayJson = JSON.parse(peticionHTTP.responseText);
            CrearTabla(arrayJson);
           
         }
     }
     peticionHTTP.open("GET","http://localhost:3000/materias",true);
     peticionHTTP.send();
  
    }

    function CrearTabla(array){
        
        let tabla = document.createElement("table");
        tabla.id = "tablaPersona";
        let div = document.getElementById("divTabla");
        div.appendChild(tabla);
        CrearThead(array);
        CrearTbody(array);
        tabla.setAttribute("border","1");
        tabla.className = "tabla";

        
    }

    function CrearTbody(array){
        let tbody = document.createElement("tbody");
        tbody.id = "tbodyPersona";
        array.forEach(objeto => {
            let tr= document.createElement("tr");
            var keys = Object.keys(objeto);
            tr.id = "tr" + objeto.id;
            tr.addEventListener('click',TraerDatos);
            keys.forEach(element => {
                let td= document.createElement("td");
                td.innerHTML = objeto[element];
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
        let tabla = document.getElementById("tablaPersona");
        tabla.appendChild(tbody);
    }

    function CrearThead(array){

        let thead = document.createElement("thead");
        thead.id="theadPersona";
        var keys = Object.keys(array[0]);
        keys.forEach(element => {
            let th = document.createElement("th");
            th.id="thPersona"
            th.innerHTML = element;
            thead.appendChild(th);
            
        });
        let tabla = document.getElementById("tablaPersona");
        tabla.appendChild(thead);

    }


function Alta(){
  
    let id= Obtenerid();
    let nombre = ById("txtNombre").value;
    let cuatrimestre = ById("txtCuatri").value;
    let fecha = ById("txtFecha").value;
    
    let turno= ById("rdoMan");
    
   
    let tr = Create("tr");
    tr.id = "tr" + id;
    let tdNombre = Create("td");
    let tdCuatri = Create("td");
    let tdFecha = Create("td");
    let tdTurno= Create("td");
    let tdId= Create("td");
    let tbody = ById("tbodyPersona");
    tdNombre.innerHTML = nombre;
    tdCuatri.innerHTML = cuatrimestre;
    tdFecha.innerHTML = fecha;
    
    if(turno.checked){
        
        tdTurno.innerHTML = "Mañana";
    }else{
        tdTurno.innerHTML = "Noche"; 
    }
    tdId.innerHTML = id;
    tr.addEventListener('click',TraerDatos);
    tr.appendChild(tdId);
    tr.appendChild(tdNombre);
    tr.appendChild(tdCuatri);
    tr.appendChild(tdFecha);
    tr.appendChild(tdTurno);
    
    
   
    tbody.appendChild(tr);
    let persona = {"nombre":nombre,"apellido":cuatrimestre,"fecha":fecha,"sexo":tdTurno.innerHTML};
    PostNuevaPersona(persona);
    ActualizarTabla();
    
}

function PostNuevaPersona(persona){
    ById("spinner").hidden=false;
    peticionHTTP.onreadystatechange= function(){
        
        if(peticionHTTP.readyState== 4 && peticionHTTP.status== 200){
            console.log(JSON.parse(peticionHTTP.responseText));
            ById("spinner").hidden=true;    
         }
     }
     
     peticionHTTP.open("POST","http://localhost:3000/nueva",true);
     peticionHTTP.setRequestHeader("content-type", "application/json");
     peticionHTTP.send(JSON.stringify(persona));
     
}

function TraerDatos(ev){

   ById("divForm").hidden=false;
    let tr = ev.target.parentNode;
    let txtNombre= ById("txtNombre");
    let txtCuatri= ById("txtCuatri");
    let txtFecha= ById("txtFecha");
    let txtTurnoM= ById("rdoMan");
    let txtTurnoT= ById("rdoNoche");
    if(txtTurnoM == true){
        txtTurnoM.value = tr.childNodes[4].innerHTML;
    }else{
        txtTurnoT.value = tr.childNodes[4].innerHTML;
    }
    txtNombre.value = tr.childNodes[1].innerHTML;
    txtCuatri.value = tr.childNodes[2].innerHTML;
    let fecha = tr.childNodes[3].innerHTML;
    let array = fecha.split("/");
    txtFecha.value = array[2]+"-"+array[1]+"-"+array[0];
    
    
    let btnEliminar = ById("btnEliminar");
    let btnModificar = ById("btnModificar");
    btnEliminar.setAttribute("i",tr.id);
    btnModificar.setAttribute("i",tr.id);
    btnEliminar.hidden=false;
    btnModificar.hidden=false;


}


function ActualizarTabla(){
    ById("txtNombre").value="";
        ById("txtCuatri").value="";
        ById("txtFecha").value="";
}

function Eliminar(){
    
    if(confirm("Eliminar?") == true){
        let btnDelete = ById("btnEliminar");
        let id = btnDelete.attributes.i.value;
        let tr = ById(id);
        let tbody = tr.parentNode;
        tbody.removeChild(tr);
        ById("txtNombre").value="";
        ById("txtCuatri").value="";
        ById("txtFecha").value="";
        
       
    }

}

function PostEliminarPersona(persona){
    peticionHTTP.onreadystatechange= function(){
        if(peticionHTTP.readyState== 4 && peticionHTTP.status== 200){
            console.log(JSON.parse(peticionHTTP.responseText));
                
         }
     }
     peticionHTTP.open("POST","http://localhost:3000/eliminar",true);
     peticionHTTP.setRequestHeader("content-type", "application/json");
     peticionHTTP.send(JSON.stringify(persona));
     ActualizarTabla();
}

function Modificar(){
    if(confirm("Modificar?") == true){
        
        var fecha = ById("txtFecha").value;
        var array = fecha.split("-");
        let fechaFinal = array[2] + "/" + array[1] + "/" + array[0];
        let btnModificar = ById("btnModificar");
        let id = btnModificar.attributes.i.value;
        let tr = ById(id);
        let newId = tr.childNodes[0].innerHTML;
        tr.childNodes[1].innerHTML = ById("txtNombre").value;
        tr.childNodes[2].innerHTML = ById("txtCuatri").value;
        tr.childNodes[3].innerHTML = ById("txtFecha").value;
        if(ById("rdoMan").checked){
            tr.childNodes[4].innerHTML = "Mañana"
        }else{
            tr.childNodes[4].innerHTML = "Noche"
        }
        
        let persona = {"id":newId,"nombre":ById("txtNombre").value,"cuatrimestre":ById("txtCuatri").value,"fechaFinal":fechaFinal,"turno":tr.childNodes[4].innerHTML};
        PostModificarPersona(persona);
    }
    ActualizarTabla();
}

function PostModificarPersona(persona){
    peticionHTTP.onreadystatechange= function(){
        if(peticionHTTP.readyState== 4 && peticionHTTP.status== 200){
            console.log(JSON.parse(peticionHTTP.responseText));
                
         }
     }
     peticionHTTP.open("POST","http://localhost:3000/editar",true);
     peticionHTTP.setRequestHeader("content-type", "application/json");
     peticionHTTP.send(JSON.stringify(persona));

}





function ById(obj){
    return document.getElementById(obj);
}

function Create(obj){
    return document.createElement(obj);
}

function Obtenerid(){
    let tbody = document.getElementById("tbodyPersona");
    let len = tbody.childNodes.length;
    if(len > 0)
    {
        let tr = tbody.childNodes[len-1];
        let oldId = tr.id.substring(2);
        let id = parseInt(oldId);
        return id+ 1;    
    }
    return 0;
}
    