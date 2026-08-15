# ADR 0003: Separar identidades y custodia de Drive

Fecha: 2026-08-14

Estado: aceptada para el diseño del importador

## Contexto

La cuenta donde vive un documento, la persona que opera el importador y la
persona que mantiene Praxis pueden ser distintas. Seleccionar o compartir un
archivo no cambia su propietario, ubicación o consumo de almacenamiento. Una
copia creada por el operador en una carpeta compartida de `Mi unidad` puede
seguir perteneciendo al operador.

## Decisión

Se separan estas identidades:

```text
Autor o propietario de origen
Operador autenticado del importador
Cuenta o unidad de alojamiento de Praxis
Responsable técnico de Firebase y OAuth
```

Google OAuth autoriza acceso a Drive. Firebase Authentication autoriza acciones
en Praxis. No se exige que los correos coincidan.

Picker solo entrega los archivos seleccionados expresamente. Los originales no
se mueven ni modifican. Antes de publicar, una copia canónica debe quedar bajo
custodia comprobable de la cuenta o unidad de alojamiento de Praxis. Firestore
registra la referencia canónica, no el enlace temporal de origen.

## Consecuencias

- Compartir un archivo no completa la importación.
- El importador debe verificar ID, ubicación y propiedad de la copia canónica.
- Si la custodia no se comprueba, se bloquea `publicado`.
- Los tokens y credenciales no se guardan en metadata o Firestore.
- El responsable técnico no obtiene acceso implícito a documentos editoriales.
- La auditoría distingue autor, operador, revisor y publicador.

## Etapa transitoria

Mientras la carpeta maestra viva en `Mi unidad`, la copia definitiva debe
crearla una operación autorizada como la cuenta de alojamiento o completarse
mediante una transferencia comprobable de propiedad.

## Evolución preferida

Usar una Unidad compartida institucional, donde la organización sea propietaria
de los archivos y la custodia no dependa de la persona que ejecuta la carga.
