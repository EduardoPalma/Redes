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
									<div className={`contenedor-mensaje ${chatMensaje.nombreRemitente === datosUsuario.nombreUsuario && "left"}`}>
										<div className={`mensaje ${chatMensaje.nombreRemitente === datosUsuario.nombreUsuario && "usuario"}`} key={index}>
											<div className='dato-remitente'>{chatMensaje.nombreRemitente}</div>
											<div className='dato-mensaje'>{chatMensaje.mensaje}</div>
										</div>
									</div>
								))}	
						</div>
						<div className='enviar-mensaje'> 
							<input className='entrada-mensaje' type="text" placeholder='ingrese un Mensaje' value={datosUsuario.mensaje} onChange={manejarMensaje}></input>
							<button type='button' onClick={enviarMensaje} >
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
									<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
								</svg>
							</button>
						</div>
				</div>
			</div>
			:
			<div className='entrada-usuario'>
				<input id='nombre-usuario' placeholder='ingrese su nombre' value={datosUsuario.nombreUsuario} onChange = {manejarUsuario}></input>
					<button type='button' onClick={conectado}> Conectarse</button>
			</div>
			}
		</div>
	</div>
    )
}

export default Sala