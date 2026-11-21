# Architecture
- Keep the short student trial isolated from the full classroom session flow, with its own persisted Zustand store; trial answers must not create incomplete classroom records.
- Resolve trial missions by their stable IDs, not array positions, because the full mission catalogue is grouped by competency.