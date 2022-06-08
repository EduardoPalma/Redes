import React, {useState} from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompCliente = null;
const Sala = () => {
	const [salaPublica,setSalaPublica] = useState([]);
	const [salaPrivada,setSalaPrivada] = useState(new Map());
	const [salaChat, setSalaChat] = useState("Sala");
  	const [userData, setUserData] = useState({
    	nombreUsuario: "",
    	nombreDestinario : "",
    	mensaje: "",
    	conectado: false
  	});


  const hangleMensaje =(event) =>{
	const {value,name} = event.target;
	setUserData({...userData,[name]:value});
}

  const registrarUsuario = () =>{
	  let sock = SockJS("http://localhost:8080/ws");
	  stompCliente = over(sock);
	  stompCliente.connect({},conectadoOn,conectadoError);
  }

  const conectadoOn = () => {
	  setUserData({...userData,"conectado":true});
	  stompCliente.subscribe('/sala/publico',mensajePublicoRecivido);
	  stompCliente.subscribe('/usuario/'+userData.nombreUsuario+'/privado',mensajePrivadoRecivido);
  }

  const mensajePublicoRecivido = (payload) => {
	  	let cargaDatos = JSON.parse(payload.body);
	  	switch(cargaDatos.estado){
		  	case "UNIDO":
				if(salaPrivada.get(cargaDatos.nombreRemitente)){
					salaPrivada.set(cargaDatos.nombreRemitente,[]);
					setSalaPrivada(new Map(salaPrivada));
				}
				break;
		  	case "MENSAJE":
			  	setSalaPublica({...salaPublica});
			  	break;

	  }
  }

  const mensajePrivadoRecivido = (payload) => {
	  let cargaDatos = JSON.parse(payload);
	  if(salaPrivada.get(cargaDatos.nombreRemitente)){
		  salaPrivada.get(cargaDatos.nombreRemitente).push(cargaDatos);
		  setSalaPrivada(new Map(salaPrivada));
	  }else{
		  	let list = [];
		  	list.push(cargaDatos);
			salaPrivada.set(cargaDatos.nombreRemitente,list);
			setSalaPrivada(new Map(salaPrivada));
	  }
  }

  const conectadoError = (err) =>{
	  console.log(err);
  }

  const enviarMensajePublico = () => {
	  if(stompCliente){
		  let mensaje = {
			  nombreDestinario:userData.nombreUsuario,
			  mensaje:userData.mensaje,
			  estado:"MENSAJE"
		  };
		  stompCliente.send('/app/mensaje',{},JSON.stringify(mensaje));
		  setUserData({...userData,"mensaje":""});
	  }
  }

  

  const enviarMensajePrivado = () => {
	if(stompCliente){
		let mensaje = {
			nombreDestinario:userData.nombreUsuario,

			mensaje:userData.mensaje,
			estado:"MENSAJE"
		};
		stompCliente.send('/app/mensaje',{},JSON.stringify(mensaje));
		setUserData({...userData,"mensaje":""});
	}

  }


  return (
    <div className='container'>
      	{userData.conectado?
      	<div className='caja-mensajes'>
		  	<div className='lista-usuarios'>
				  <ul>
					  <li onClick={() => (setSalaChat("Sala"))} className={`usuario ${salaChat==="Sala" && "activo"}`}>Salas de Mensajes</li>
					  {[...salaPrivada.keys()].map((name,index) => (
						<li key={index} className={`miembro ${salaChat===name && "activo"}`} onClick={() => {setSalaChat(name)}}>
							{name}
						</li>
					  ))}
				  </ul>
			</div>
			{salaChat === "Sala" && <div className='contenidos-mensajes'>
				<ul className='Sala-mensajes'>
					{salaPublica.map((chat,index) => (
						<li className='mensaje' key={index}>
							{chat.nombreDestinario != userData.nombreUsuario && 
								<div className='avatar'> {chat.nombreDestinario}</div>}
							<div className='dato-mensaje'>{chat.mensaje}</div>
							{chat.nombreDestinario === userData.nombreUsuario &&
								<div className='avatar self'>{chat.nombreDestinario}</div>}
						</li>
					))}
				</ul>
				<div className='enviar-mensaje'>
					<input type='text' name= "mensaje" className='ingresar-mensaje' placeholder='ingrese un mensaje' value={userData.mensaje} onChange= {hangleMensaje}></input>
					<button type='button' className='boton-enviar' onClick={enviarMensajePublico}>Enviar</button>
				</div>
			</div>}
			{salaChat !== "Sala" && <div className='contenidos-mensajes'>
				<ul className='Sala-mensajes'>
					{salaPrivada.get(salaChat).map((chat,index) => (
						<li className='mensaje' key={index}>
							{chat.nombreDestinario != userData.nombreUsuario && 
								<div className='avatar'> {chat.nombreDestinario}</div>}
							<div className='dato-mensaje'>{chat.mensaje}</div>
							{chat.nombreDestinario === userData.nombreUsuario &&
								<div className='avatar self'>{chat.nombreDestinario}</div>}
						</li>
					))}
				</ul>
				<div className='enviar-mensaje'>
					<input type='text' name = "mensaje" className='ingresar-mensaje' placeholder='ingrese un mensaje' value={userData.mensaje} onChange= {hangleMensaje}></input>
					<button type='button' className='boton-enviar' onClick={enviarMensajePrivado}>Enviar</button>
				</div>
			</div>}	 	  	
      	</div>:
     	 <div className='registro'>
		  <input id='nombre-usuario' name= "nombreUsuario" placeholder='Ingrese su nombre' value={userData.nombreUsuario} onChange={hangleMensaje}></input>
		  <button type='button' onClick={registrarUsuario}>Conectarse</button>
     	 </div>
     	 }
   	</div>
  )
}

export default Sala