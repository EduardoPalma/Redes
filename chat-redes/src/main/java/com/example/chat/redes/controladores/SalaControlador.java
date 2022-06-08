package com.example.chat.redes.controladores;


import com.example.chat.redes.objects.Mensaje;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class SalaControlador {

  private SimpMessagingTemplate simpMessagingTemplate;

  @MessageMapping("/mensaje")
  @SendTo("/sala/publico")
  public Mensaje recibeMensajePublico(@Payload Mensaje mensaje){
    return mensaje;
  }

  @MessageMapping("/mensaje-p")
  @SendTo
  public Mensaje recibeMensajePrivado(@Payload Mensaje mensaje){
    simpMessagingTemplate.convertAndSendToUser(mensaje.getNombreDestinario(),"/privado",mensaje);
    return mensaje;
  }
}
