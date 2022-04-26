"use strict";

// Seleccionar elementos

const form = document.forms[0]
const taskInput = form.task //para sacar texto de la tarea

const addButton = document.querySelector("#add") //añadir
const cleanButton = document.querySelector("#clean") //limpiar
const emptyButton = document.querySelector("#empty") //borrar

const taskUl = document.querySelector("ul") //donde añadir las tareas en el DOM



// Almacenamos las tareas en un array
let taskArr = []


// Leemos el localStorage
const savedTasks = localStorage.getItem("tasks")

//Si había tareas guardadas...
if(savedTasks){

  // Las asigno al array PARSEANDOLAS (conviertiendo de nuevo a array el string)
  taskArr = JSON.parse(savedTasks)
}




///////////////////////////////
// VERIÓN CREATE ELEMENT


/* //Función para actualizar el DOM
function updateList(){


  //Lo primero es asegurarse de que la lista está vacia
  taskUl.innerHTML = ""

    // Actualizamos el localStorage
  saveTasks()

  // creamos un fragment para almacenar las tareas
  const fragment = document.createDocumentFragment()

  // Recorremos la lista de tareas
  for(let i = 0; i < taskArr.length; i++){
    
    // Cojo los datos de la tarea correspondiente
    const {text, done} = taskArr[i]

    // Creo el li
    const li = document.createElement("li")

    //Creo el checkbox
    const check = document.createElement("input")
    check.setAttribute("type", "checkbox")

    // Añadimos el indice como atributo personalizado
    //Para poder seleccionar facilmente el obj en el arr
    check.dataset.index = i;

    //Creo el texto
    const textP = document.createElement("p")
    textP.textContent = text


    // Cuando los elementos estén creados, 
    //pero antes de añadirlos...

    //Si la tarea está hecha
    if(done //=== true
      ){
      li.classList.add("done")
      check.setAttribute("checked", true)
    }


//Añadimos el checkbox y el texto al li
li.append(check, textP)
    
//Añadimos el li al fragment
fragment.append(li)
  }

  //Fuera del bucle, añadimos el fragment al ul
  taskUl.append(fragment)
}

 */




/////////////////////////////////////
// VERSIÓN INNERHTML (Lucía)

function updateList(){

  //Lo primero es asegurarse de que el ul está vacío
  taskUl.innerHTML = ""

  // Actualizamos el localStorage
  saveTasks()

  // Creamos el string en el que iremos concatenando lo li
  let htmlString = ""

  // Recorremos la lista de tareas
  for( let i = 0; i < taskArr.length; i++){

    //Cogemos los datos de la tarea
    const {text, done} = taskArr[i]

    //Creamos el string del li
    const liString = `<li ${done? 'class="done"' : ""}>
        <input type="checkbox" data-index="${i}" ${done? "checked" : ""}>
        <p>${text}</p>
      </li>`

     //Concatenamos el string del li al total
     htmlString += liString // htmlString = htmlString + liString

  }

  //Fuera del bucle añado el string total al innerHTML del ul
  taskUl.innerHTML = htmlString
}



//////////////////////////////////////


// LLamamos a la función por primera vez que que al cargas aparezcan las tareas
updateList()



// Función para guardar las tareas en el localStorage
function saveTasks(){
  //Convertir el array en un string JSON
  const tasksJSON = JSON.stringify(taskArr)

  //Guardo el string en el localStorage
  localStorage.setItem("tasks", tasksJSON)
}





// Función para añadir tareas
function addTask(){

  //El texto será el valor del input
  const text = taskInput.value

  //Si el texto mide 3 caracteres o más
  if(text.length >= 3){

    //Añadimos al array un objeto con ese texto y done a false
    taskArr.unshift({
      text, // text: text,
      done: false
    })

    //Limpiamos el input (tiene que ser con la propiedad value 
    //porque queremos modificar el objeto taskInput)
    taskInput.value = ""


    //Actualizamos la lista del DOM (a su vez, actualiza el localStorage)
    updateList()

  } else{
    //Si no, mostramos un alert indicándolo
    alert("El texto tiene que tener al menos tres caracteres")
  }

}


// Función para marcar/desmarcar tareas como hechas
function toggleTaskDone(e){

  //Solo nos interesa que se ejecute si es el checkbox
  if(e.target.matches("input")){
    const checkbox = e.target

    // Miro que posición ocupa en el array
    const {index} = checkbox.dataset

    //Seleccionamos la tarea correspondiende del array
    const task = taskArr[index]
    
    // Asignamos a la propiedad done de la tarea su contrario
    task.done = !task.done
    

    //Actualizamos la lista
    updateList()
  }
}


// Función para limpiar (eliminar las tareas hechas)
function clean(){

  // Filtramos el array para dejar solo los que tengan done a false
// Como done es un booleano y queremos que pasen los que etán a false, 
//el callback devuelve lo contrario de done
  const filteredArr = taskArr.filter(task => !task.done)

  //Asignamos las tareas filtradas al array de tareas
  taskArr = filteredArr
  


  //Actualizamos las listas
  updateList()
}



//Función para borrar
function empty(){

  //Pedimos confimación
  // Podríamos usar confirm, pero una palabra con prompt es más seguro

  const code = prompt("Para borrar escribe 'BORRAR':")

  // Si el código coincide...
  if(code === "BORRAR"){

     // Convierto el array en un array vacio
  taskArr = []


  //Actualizo
  updateList()
  }
  
 
}




// Añadimos funciones a los botones
addButton.addEventListener("click", addTask)
cleanButton.addEventListener("click", clean)
emptyButton.addEventListener("click", empty)


//Añadimos la funcion de marcar/desmarcar a la lista (event delegation)

taskUl.addEventListener("click", toggleTaskDone)