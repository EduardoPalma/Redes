package com.example.chat.redes.config;



import java.io.Console;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocket implements WebSocketMessageBrokerConfigurer{

  @Override
  public void configureMessageBroker(MessageBrokerRegistry messageBrokerRegistry){
    messageBrokerRegistry.setApplicationDestinationPrefixes("/app");
    messageBrokerRegistry.enableSimpleBroker("/sala","/usuario");
    messageBrokerRegistry.setUserDestinationPrefix("/usuario");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry stompEndpointRegistry){
    System.out.println("datos " + stompEndpointRegistry.toString());
    stompEndpointRegistry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
  }


}
