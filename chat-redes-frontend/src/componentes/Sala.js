import React, {useState} from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const Sala = () => {
	const [salaPublica, setsalaPublica] = useState([]);
	const [salaPrivada, setsalaPrivada] = useState(new Map());
	const [datosUsuario, setdatosUsuario] = useState({
		nombreUsuario: '',
		nombreDestinario : '',
		conectado : false,
		mensaje : ''
	})

	const conectado = () => {
		if(document.getElementById("nombre-usuario").value != ""){
			let Sock = new SockJS("http://localhost:8080/ws");
			stompClient = over(Sock);
			stompClient.connect({},conectadoOn,error);
		}

	}

	const conectadoOn = () =>{
		setdatosUsuario({...datosUsuario, "conectado": true});
		stompClient.subscribe('/sala/publico', mensajeRecividoOn);
		usuarioIngreso();
	}

	const mensajeRecividoOn = (payload) =>{
		var payloadDatos = JSON.parse(payload.body);
		switch(payloadDatos.estado){
			case "UNIDO":
				if(!salaPrivada.get(payloadDatos.nombreRemitente)){
					salaPrivada.set(payloadDatos.nombreRemitente, []);
					setsalaPrivada(new Map(salaPrivada));
				}
				break;
			case "MENSAJE":
				salaPublica.push(payloadDatos);
				setsalaPublica([...salaPublica]);
				if(!salaPrivada.get(payloadDatos.nombreRemitente)){
					salaPrivada.set(payloadDatos.nombreRemitente, []);
					setsalaPrivada(new Map(salaPrivada));
				}
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
		if(document.getElementById("input-mensaje").value != ""){
			if(stompClient){
				var mensajeChat = {
					nombreRemitente : datosUsuario.nombreUsuario,
					mensaje : datosUsuario.mensaje,
					estado : "MENSAJE"
				};
				stompClient.send("/app/mensaje",{},JSON.stringify(mensajeChat));
				setdatosUsuario({...datosUsuario,"mensaje":""});
			}
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
						{[...salaPrivada.keys()].map((name,index) => (
							<li className='usuarios' key={index}>
								{name.toString()}
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
							<input id = 'input-mensaje' className='entrada-mensaje' type="text" placeholder='ingrese un Mensaje' value={datosUsuario.mensaje} onChange={manejarMensaje}></input>
							<button type='button' onClick={enviarMensaje}>Enviar
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
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