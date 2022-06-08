package com.example.chat.redes.objects;

public class Mensaje {
  private String nombre;
  private String nombreDestinario;
  private String nombreRemitente;
  private String mensaje;
  private Estado estado;

  public Mensaje(String nombre, String mensaje) {
    this.nombre = nombre;
    this.mensaje = mensaje;
  }

  public String getMensaje() {
    return mensaje;
  }

  public void setMensaje(String mensaje) {
    this.mensaje = mensaje;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getNombreDestinario() {
    return nombreDestinario;
  }

  public void setNombreDestinario(String nombreDestinario) {
    this.nombreDestinario = nombreDestinario;
  }

  public String getNombreRemitente() {
    return nombreRemitente;
  }

  public void setNombreRemitente(String nombreRemitente) {
    this.nombreRemitente = nombreRemitente;
  }
}
