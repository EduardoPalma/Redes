import React, {useState,useEffect} from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const Sala = () => {
	const [salaPublica, setsalaPublica] = useState([]);
	const [salaPrivada, setsalaPrivada] = useState([]);
	const [datosUsuario, setdatosUsuario] = useState({
		nombreUsuario: '',
		nombreDestinario : '',
		conectado : false,
		mensaje : ''
	})

	const conectado = () => {
		let Sock = new SockJS("http://localhost:8080/ws");
		stompClient = over(Sock);
		stompClient.connect({},conectadoOn,error);
	}

	const conectadoOn = () =>{
		setdatosUsuario({...datosUsuario, "conectado": true});
		stompClient.subscribe('/sala/publico', mensajeRecividoOn);
		usuarioIngreso();
	}

	const mensajeRecividoOn = (payload) =>{
		var payloadDatos = JSON.parse(payload.body);
		//console.log(payload);
		switch(payloadDatos.estado){
			case "UNIDO":
				if(!salaPrivada.get(payloadDatos.nombreRemitente)){
					console.log("unido");
					salaPrivada.set(payloadDatos.nombreRemitente, []);
					setsalaPrivada(new Map(salaPrivada));
				}
				break;
			case "MENSAJE":
				salaPublica.push(payloadDatos);
				setsalaPublica([...salaPublica]);
				break;
		}
	}


	const usuarioIngreso = () => {
		var chatMensaje = {
			nombreRemitente: datosUsuario.nombreUsuario,
			estado : "UNIDO"
		};
		stompClient.send("/app/mensaje",{},JSON.stringify(chatMensaje));
	}

	const error = (err) =>{
		console.log(err)
	};

	const manejarUsuario = (event) => {
		const {value} = event.target;
		setdatosUsuario({...datosUsuario, "nombreUsuario": value})
	}

	const manejarMensaje = (event) => {
		const {value} = event.target;
		setdatosUsuario({...datosUsuario, "mensaje": value});
	}

	const enviarMensaje = () => {
		if(stompClient){
			var mensajeChat = {
				nombreRemitente : datosUsuario.nombreUsuario,
				mensaje : datosUsuario.mensaje,
				estado : "MENSAJE"
			};
			console.log(mensajeChat);
			stompClient.send("/app/mensaje",{},JSON.stringify(mensajeChat));
		}
	}

    return (
	<div className='container'>
		<div className="abs-center">
			{datosUsuario.conectado?
			<div className='chat'>
				<div className='list-usuarios'> 
					<ul>
						<li className='public'>
							Sala Publica
						</li>
						{[salaPrivada.keys()].map((name,index) => (
							<li className='usuarios' key={index}>
								{name}
							</li>
						))}

					</ul>
				</div>
				<div className='table-mensajes'> 
						<div className='mensajes-publicos'>
							{salaPublica.map((chatMensaje,index) => (
								<div className={`mensaje ${chatMensaje.nombreRemitente === datosUsuario.nombreUsuario && "usuario"}`} key={index}>
									<div className='dato-remitente'>{chatMensaje.nombreRemitente}</div>
									<div className='dato-mensaje'>{chatMensaje.mensaje}</div>
								</div>
							))}	
						</div>
						<div className='enviar-mensaje'> 
							<input className='entrada-mensaje' type="text" placeholder='ingrese un Mensaje' value={datosUsuario.mensaje} onChange={manejarMensaje}></input>
							<button classname ="btn btn-success" type='button' onClick={enviarMensaje} >Enviar</button>
						</div>
				</div>
			</div>
			:
			<div className='entrada-usuario'>
				<input id='nombre-usuario' placeholder='ingrese su nombre' value={datosUsuario.nombreUsuario} onChange = {manejarUsuario}></input>
				<button className="" type='button' onClick={conectado}> Conectarse</button>
			</div>
			}
		</div>
	</div>
    )
}

export default Sala