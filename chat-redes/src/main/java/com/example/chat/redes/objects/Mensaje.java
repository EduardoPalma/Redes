package com.example.chat.redes.objects;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Mensaje {
  public String nombreDestinario;
  public String nombreRemitente;
  public String mensaje;
  public Estado estado;

}
