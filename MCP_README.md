# Paladino MCP Server

Servidor MCP (Model Context Protocol) para Paladino Propiedades que expone todas las funcionalidades principales de la API inmobiliaria.

## 🚀 Instalación

```bash
npm install
```

## 📋 Herramientas Disponibles

El servidor MCP expone las siguientes herramientas:

### 1. `get_inmuebles`
Obtiene una lista de propiedades con filtros opcionales.

**Parámetros:**
- `tipo` (opcional): Tipo de propiedad (Departamento, Casa, etc.)
- `operacion` (opcional): Operación (venta, alquiler, comprar, alquilar)
- `habitaciones` (opcional): Cantidad de habitaciones (1, 2, 3, 4, +4)
- `search` (opcional): Búsqueda por texto
- `destacado` (opcional): Solo propiedades destacadas (boolean)
- `limit` (opcional): Limitar número de resultados

**Ejemplo:**
```json
{
  "tipo": "Departamento",
  "operacion": "venta",
  "habitaciones": "2",
  "destacado": true,
  "limit": 10
}
```

### 2. `get_inmueble_by_slug`
Obtiene los detalles completos de una propiedad por su slug.

**Parámetros:**
- `slug` (requerido): Slug de la propiedad

**Ejemplo:**
```json
{
  "slug": "departamento-2-habitaciones-centro"
}
```

### 3. `get_emprendimientos`
Obtiene una lista de emprendimientos disponibles.

**Parámetros:**
- `limit` (opcional): Limitar número de resultados

### 4. `get_emprendimiento_by_slug`
Obtiene los detalles completos de un emprendimiento por su slug.

**Parámetros:**
- `slug` (requerido): Slug del emprendimiento

### 5. `get_novedades`
Obtiene una lista de novedades/noticias.

**Parámetros:**
- `limit` (opcional): Limitar número de resultados
- `destacado` (opcional): Solo novedades destacadas (boolean)

### 6. `get_novedad_by_slug`
Obtiene los detalles completos de una novedad por su slug.

**Parámetros:**
- `slug` (requerido): Slug de la novedad

### 7. `get_obras`
Obtiene una lista de obras realizadas.

**Parámetros:**
- `limit` (opcional): Limitar número de resultados

### 8. `get_site_configuration`
Obtiene la configuración del sitio (contactos, ubicación, logos, etc.).

### 9. `search_inmuebles`
Búsqueda avanzada de propiedades con múltiples filtros.

**Parámetros:**
- `query` (opcional): Texto de búsqueda
- `tipo` (opcional): Tipo de propiedad
- `operacion` (opcional): Operación (venta/alquiler)
- `habitaciones` (opcional): Cantidad de habitaciones
- `zona` (opcional): Zona/localidad
- `precio_min` (opcional): Precio mínimo
- `precio_max` (opcional): Precio máximo

## 🔧 Configuración para Claude Desktop

Agrega esta configuración a tu archivo de configuración de Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "paladino": {
      "command": "node",
      "args": ["/ruta/completa/a/paladino/mcp-server.js"],
      "cwd": "/ruta/completa/a/paladino"
    }
  }
}
```

**Ejemplo con ruta absoluta:**
```json
{
  "mcpServers": {
    "paladino": {
      "command": "node",
      "args": ["/Users/daniel/develop/paladino/mcp-server.js"],
      "cwd": "/Users/daniel/develop/paladino"
    }
  }
}
```

## 🏃 Ejecución Manual

Para ejecutar el servidor MCP manualmente:

```bash
npm run mcp
```

O directamente:

```bash
node mcp-server.js
```

## 📝 Notas

- El servidor se conecta a la API de Paladino en: `https://api.paladinopropiedades.com.ar`
- El servidor usa comunicación stdio para la integración MCP
- Todos los datos se devuelven en formato JSON
- Los errores se devuelven con `isError: true`

## 🔗 API Endpoints Usados

- `/inmuebles` - Lista de propiedades
- `/emprendimientos` - Lista de emprendimientos
- `/novedades` - Lista de novedades
- `/obras` - Lista de obras
- `/configuracion-sitio` - Configuración del sitio

