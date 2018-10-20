# language: es
Característica: El cliente visualiza la orden
    Parte de 'Haciendo una orden' epica

    Como un cliente
    Quiero visualizar la orden
    en la orden revisar el contenido de mi orden y su precio facilmente

    Escenario: La orden esta vacia
        Dado que la orden esta vacia
        Cuando el cliente visualize la orden
        Entonces no deberia mostrar articulos en la orden
        Y deberia mostrar "0" en el precio total
        Y solo deberia ser posible añadir bebidas
