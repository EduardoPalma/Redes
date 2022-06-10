import React, {useState,useEffect} from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const Sala = () => {
	const [salaPublica, setsalaPublica] = useState([])
	const [datosUsuario, setdatosUsuario] = useState({
		nombreUsuario: '',
		nombreDestinario : '',
		conectado : true,
		mensaje : ''
	})

	const conectado = () => {
		let Sock = new SockJS("http://localhost:8080/ws");
		stompClient = over(Sock);
		stompClient.connect({},conectadoOn,error);
	}

	const conectadoOn = () =>{
		setdatosUsuario({...datosUsuario, "conectado": true})
	}

	const error = (err) =>{
		console.log(err)
	};


    return (
    <div className="d-flex justify-content-center align-items-center">
		{datosUsuario.conectado?
		<div id='chat'>
			<div id='list-usuarios'> 
				<ul>
					<li>
						Sala Publica
					</li>

				</ul>
			</div>
			<div> 

			</div>

		</div>
		:
		<div className='text-center'>
			<input id='nombre-usuario' placeholder='ingrese su nombre'></input>
			<button className='btn btn-success' type='button' onClick={conectado}> Conectarse</button>
		</div>
		}	
    </div>
    )
}

export default Sala