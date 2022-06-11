import React, {useState,useEffect} from 'react';
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
		<div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}} >
			{datosUsuario.conectado?
			<div id='chat'>
				<div id='list-usuarios'> 
					<ul>
						<li>
							Sala Publica
						</li>
						{[salaPrivada.keys()].map((name,index) => (
							<li key={index}>
								{name}
							</li>
						))}

					</ul>
				</div>
				<div id='table-mensajes'> 
					<div > 
						<ul className='mensajes-publicos'>
							{salaPublica.map((chatMensaje,index) => (
								<li key={index}>
									<div>{chatMensaje.nombreRemitente}</div>
									<div>{chatMensaje.mensaje}</div>
								</li>
							))}	
						</ul>
						<div> 
							<input type="text" placeholder='ingrese un Mensaje' value={datosUsuario.mensaje} onChange={manejarMensaje}></input>
							<button type='button' onClick={enviarMensaje} >Enviar</button>
						</div>
					</div>
				</div>

			</div>
			:
			<div className='text-center'>
				<input id='nombre-usuario' placeholder='ingrese su nombre' value={datosUsuario.nombreUsuario} onChange = {manejarUsuario}></input>
				<button className='btn btn-success' type='button' onClick={conectado}> Conectarse</button>
			</div>
			}	
		</div>
	</div>
    )
}

export default Sala