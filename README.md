# Hexagonal Task Manager

De una aplicacion monolitica Legacy a una Arquitectura Hexagonal (Ports & Adapters).

## Arquitectura
El proyecto sigue la separacion de responsabilidades:

- **Domain:** Pura logica de negocio (`Task`, `User`). No depende de nada.
- **Ports:** Interfaces que definen "contratos" (`TaskRepository`).
- **Application:** Casos de uso y orquestacion (`TaskService`).
- **Adapters:** Implementaciones concretas (UI Web, LocalStorage).

## Tecnologias
- **Frontend:** Vanilla JavaScript
- **State Management:** Hexagonal Service Pattern
- **Persistencia:** LocalStorage (Reemplazable por Supabase/Firebase)
- **Hosting:** Vercel

## Instalacion Local
1. Clonar el repositorio.
2. Abrir `index.html` en un servidor local.
   *OJO, se requiere un servidor local debido al uso de ES Modules.*

## El Proyecto ya tiene:
- Migracion de Monolito a Hexagonal
- Implementacion de Repositorios
- Despliegue en Vercel
